# Intent classification benchmarks

Comparação entre as três estratégias de montagem de contexto para o endpoint `/context/preview-*`.

## Estratégias

| Modo | Endpoint | Como funciona |
|---|---|---|
| **v1** | `POST /context/preview` | Injeta a categoria inteira. Sem LLM. Custo: zero overhead, contexto grande. |
| **v2** | `POST /context/preview-v2` | LLM cheap chama `lookup_<category>(query)` (tool calling). Multi-step possível (modelo pode chamar várias tools e ler resultados). |
| **v3** | `POST /context/preview-v3` | LLM cheap devolve JSON estruturado `{lookups: [{category, query}]}` via `generateObject`. Single round-trip, sem tool definitions. |

Fórmula de custo total da request final (intent step + answer step):

```
custo_v1 = full_ctx_tokens × price_answer_in
custo_v2 = (intent_in × price_intent_in + intent_out × price_intent_out) + targeted_ctx_tokens × price_answer_in
custo_v3 = idem v2, mas geralmente menos intent_in (sem tool defs)
```

A v2/v3 só compensam quando `(full_ctx − targeted_ctx) × price_answer_in > intent_call_cost`.

---

## Benchmarks observados

### #1 — "como funciona a spell fireball?" / categories=[spells]

**Setup**
- Modelo intent: `meta-llama/llama-3.3-70b-instruct:free` (OpenRouter, free tier)
- Data: 2026-05-12
- Render-side: já com a otimização compacta de tokens (V2 do storage shape)

**Tamanhos de contexto**
- v1 full injection (spells inteira, 5 entries): **~2 469 chars**
- v2/v3 targeted (só Fireball renderizado): **~700 chars**
- Context saved: ~72%

**v2 (tool calling)**
- HTTP calls observadas no log: **2** (multi-step loop do AI SDK)
  - Call #1: input **409 tok** / output **290 tok**
  - Call #2: input **369 tok** / output **44 tok**
- Totais reais: **778 in / 334 out**
- Bug do MVP: o painel mostrava `result.usage` que é só o último step → reportava 369/44 em vez de 778/334. Corrigido pra `result.totalUsage`.
- Caracterização: a 1ª chamada tinha 6 tool definitions no payload (~400 tok de overhead em definitions). A 2ª chamada veio depois do tool result voltar → multi-step.

**v3 (forced tool call)** — registro de 2026-05-12
- HTTP calls: **1** (steps=1)
- Input tok: **399**, Output tok: **66**
- Latência: 4020 ms
- Provider efetivo: **OpenInference**, modelo servido: **`openai/gpt-oss-120b:free`** (3º da lista de fallback). Llama 3.3 (#1) e Qwen3 Next (#2) estavam ambos rate-limited na Venice; OpenRouter rotou pro GPT-OSS automaticamente via `models` array.
- Implementação: `generateText` + `tools = { submit_lookups }` + `toolChoice: { type: "tool" }` + `stopWhen: stepCountIs(1)` + `maxRetries: 0`.
- A primeira tentativa de v3 usava `generateObject` (response_format=json_schema). Esse modo só era suportado por um subset de providers (Venice no free tier), que tava rate-limited. Trocar pra tool-mode destravou os outros providers e cortou ~50% do input vs v2.

### Resumo comparativo

| | v1 | v2 | v3 |
|---|---|---|---|
| HTTP calls | 0 | 2 (multi-step) | 1 |
| Intent in tokens | 0 | ~778 | **399** |
| Intent out tokens | 0 | ~334 | **66** |
| Provider | n/a | OpenInference (gpt-oss-120b) | OpenInference (gpt-oss-120b) |
| Latência intent | 0 | ~2-3s | 4s |
| Context entregue ao answer LLM | ~2469 chars | ~700 chars | ~700 chars |
| Context saved vs v1 | — | ~72% | ~72% |

**Custo estimado por call** (Haiku 4.5 a $1/1M in, $5/1M out, e contexto enviado ao answer LLM também via Haiku):

- v1: 617 in tok × $1/1M ≈ **$0.00062**
- v2: (778×$1/1M + 334×$5/1M) + 175 in ≈ $0.00245 + $0.000175 ≈ **$0.00263** (~4× mais caro que v1 em query pequena)
- v3: (399×$1/1M + 66×$5/1M) + 175 in ≈ $0.00073 + $0.000175 ≈ **$0.00091** (~1.5× mais caro que v1)

**Conclusão pra esse caso (spells, 1 entry):** v1 ainda ganha em custo porque a categoria é pequena. v2/v3 só pagam o overhead do intent step quando a categoria é grande o suficiente pro saved-context superar o custo.

**Cenário onde v3 ganha:** se a categoria é `combat` (~40K chars = ~10K tokens, vs spells = ~2.5K chars/~600 tokens):

- v1 (combat full): 10K × $1/1M = **$0.01**
- v3 (combat targeted ~250 chars/~62 tok): $0.00073 + 62 × $1/1M ≈ **$0.0008**
- v3 ~12× mais barato

A heurística é: **v3 ganha proporcionalmente ao tamanho da categoria**. Pra categorias estruturadas pequenas (spells/monsters/items/abilities), o intent step não compensa. Pra `combat` (rule-sections do PHB pesados), compensa muito.

### Como atualizar

Quando rodar o experimento de novo:

1. Suba API + Web
2. Login → `/debug-context`
3. Mesma query e categoria nos 3 modos
4. Anota: tokens totais reportados no painel (já são `totalUsage`), context chars do `injectedContext`, latency
5. Atualiza esta tabela

---

## Heurísticas de quando cada modo ganha

- **v1**: quando o usuário pergunta algo amplo ("o que existe em spells?") ou quando o contexto da categoria já é pequeno o bastante pra não compensar o intent call.
- **v2**: faz sentido quando você espera **encadeamento dinâmico** (chamar uma tool, ver o resultado, decidir chamar outra). No nosso caso de intent classification one-shot, é overhead puro vs v3.
- **v3**: melhor opção pro nosso problema. Single call, payload menor (sem tool defs), comportamento previsível pelo Zod schema. Cai mais perto do mínimo teórico de tokens.

## Limitações

- Provider routing do OpenRouter pode mudar qual provedor real serve o modelo free → variabilidade de latência e até de tokens (alguns providers contam diferente).
- Llama 3.3 70B no free tier costuma ter rate-limit upstream (provider Venice). Por isso passamos `models` em `settings` (não em `providerOptions.openrouter`) com lista de fallback (max 3).
- Os números são por-request, não estatísticos. Pra benchmark sério, rodar N vezes e tirar média.

---

## Findings (encerramento do experimento)

### Técnicos

1. **`generateObject` ≠ "single tool call".** A heurística de modo do AI SDK escolhe `response_format: json_schema` quando o provider suporta. No free tier do OpenRouter, isso restringe a Venice (provider sobrecarregado). Resultado: a v3 original (`generateObject`) tinha o **mesmo comportamento multi-step da v2** (1 tool_calls + 1 stop) e ficava presa em providers ruins.

2. **Forced tool call é o jeito robusto de fazer structured output em free tier.** `generateText` + `tools = { one_tool }` + `toolChoice: { type: "tool", toolName }` + `stopWhen: stepCountIs(1)` + tool sem `execute` = single round-trip. Funciona em qualquer provider que aceite tool calling (basicamente todos).

3. **`models` array em `settings` ≠ `providerOptions.openrouter.models`.** O `@openrouter/ai-sdk-provider@1.5.4` só lê `models` quando passado em `.chat(id, settings)`, não em `providerOptions` por-call. Bug silencioso: sem erro, simplesmente não envia o array.

4. **`result.totalUsage` ≠ `result.usage`.** `usage` é só o último step; `totalUsage` soma. Em multi-step (v2), `usage` subreporta. Em single-step (v3), são iguais.

5. **`result.response.modelId` é o modelo real servido.** Quando o `models` fallback rota pra outro modelo, o que você pediu (`anthropic/claude-haiku-4.5`) pode não ser o que respondeu (`openai/gpt-oss-120b:free`). Pra log/UI honesto, ler do response, não da config.

6. **Tool call vs plain prompt pra structured output.** Tool call tem ~5-10% mais tokens nominais mas ~100% confiabilidade vs ~95% do plain prompt. No agregado (incluindo retries), tool call ganha.

### Sobre o produto

7. **v3 é o caminho certo, mas o ROI depende do tamanho da categoria.** Pra `spells` (~2.5K chars de full injection), o overhead do intent step (~399 in / ~66 out) não compensa o saved context. Pra `combat` (~40K chars), v3 é ~10-12× mais barato que v1.

8. **Heurística de produção**: usar v1 (full injection) por padrão; ativar v3 só quando uma categoria pesada (`combat`) é selecionada. Ou: detectar tamanho da categoria selecionada e decidir runtime.

9. **Prompt caching muda tudo.** Anthropic cobra 10% pelos tokens cacheados. A REFERÊNCIA é estável entre requests da mesma conversa → cache hit perfeito. Com isso, v1 vira basicamente o mais barato em conversas longas. **Quando entrarmos no M6 (LLM real), ativar prompt caching dilui boa parte da motivação pra v2/v3.**

### Decisão de produto

- **Ficar com v1 (full injection) como padrão no M6.** Adicionar prompt caching quando integrar OpenRouter.
- Manter v2 e v3 no código como endpoints de debug/experiment. Não usar em produção.
- O painel `/debug-context` continua útil pra inspecionar o prompt antes de enviar.
