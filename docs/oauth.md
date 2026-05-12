# OAuth 2.0 + OpenID Connect com Google — Ponta a ponta

> Documento de arquitetura. Cobre como o "Login com Google" funciona neste repo: dos modelos Zod até a sessão criada no banco, com explicação do protocolo por baixo de cada decisão. Acompanhar com o código aberto ajuda — todas as referências apontam pra arquivos reais.

---

## Sumário

1. [Visão geral — OAuth 2.0 e OpenID Connect (OIDC)](#1-visao-geral)
2. [Atores](#2-atores)
3. [Fluxo completo (diagrama de sequência)](#3-fluxo-completo)
4. [Etapa por etapa, com código](#4-etapa-por-etapa)
5. [Schema de dados — User / Account / Session](#5-schema-de-dados)
6. [Estratégia de vinculação de contas](#6-estrategia-de-vinculacao)
7. [Segurança — o que cada peça protege](#7-seguranca)
8. [Verificação manual do `id_token` (JWT) com `node:crypto`](#8-verificacao-jwt)
9. [Estratégia de testes (mock do boundary)](#9-estrategia-de-testes)
10. [Variáveis de ambiente](#10-variaveis-de-ambiente)
11. [Mapa de arquivos](#11-mapa-de-arquivos)

---

<a id="1-visao-geral"></a>
## 1. Visão geral — OAuth 2.0 e OpenID Connect

**OAuth 2.0** é um protocolo de **autorização** — o usuário diz pro provedor (Google): "deixa esse app aqui (D&D Chat) acessar X informação minha". Ele NÃO foi feito pra dizer "esse é o fulano". É só uma delegação de acesso.

**OpenID Connect (OIDC)** é uma camada em cima do OAuth 2.0 que adiciona **autenticação** — o provedor devolve, junto com o `access_token`, um `id_token` (um JWT assinado) que afirma "o usuário X autenticou agora; aqui está o email e o ID dele no meu sistema". É isso que a gente realmente quer pra fazer "Login com Google".

Existem várias **OAuth flows** (variações do protocolo). A gente usa o **Authorization Code Flow** — o padrão e mais seguro pra apps com backend:

1. Cliente (nosso backend) manda usuário pro Google com um `state` aleatório.
2. Google autentica o usuário, pede consentimento, redireciona de volta pro nosso backend com um `code` curto-lived.
3. Backend troca esse `code` (no canal seguro server-to-server) por `access_token` + `id_token`.
4. Backend valida o `id_token` e cria a sessão local.

O `code` nunca passa pelo navegador como token usável — ele é só um "ticket" pra resgatar os tokens reais. Por isso essa flow é segura mesmo num app web tradicional.

---

<a id="2-atores"></a>
## 2. Atores

| Ator | Papel |
|---|---|
| **User-Agent** | O navegador do usuário. Carrega cookies, segue redirects, mas nunca vê tokens. |
| **Resource Owner** | O ser humano que está autenticando. |
| **Client** | Nosso backend (`apps/api`). É quem detém `GOOGLE_CLIENT_SECRET`. |
| **Authorization Server / IdP** | Google (`accounts.google.com` + `oauth2.googleapis.com`). Autentica o usuário e emite tokens. |
| **JWKS endpoint** | `googleapis.com/oauth2/v3/certs`. Publica as chaves públicas que a gente usa pra verificar a assinatura do `id_token`. |

---

<a id="3-fluxo-completo"></a>
## 3. Fluxo completo (diagrama de sequência)

```
User-Agent          api (D&D Chat)              Google IdP             JWKS endpoint
   |                      |                          |                        |
   |---- GET /auth/google ->                          |                        |
   |                      |                                                   |
   |                      | generateState() -> "abc123..."                    |
   |                      | setCookie oauth_state=abc123 (HttpOnly, 10min)    |
   |                      | buildAuthUrl(state=abc123)                        |
   |                      |                                                   |
   |<- 302 Location: ----                                                     |
   |   accounts.google.com/o/oauth2/v2/auth                                   |
   |   ?client_id=...&redirect_uri=...&scope=openid+email+profile             |
   |   &response_type=code&state=abc123                                       |
   |   Set-Cookie: oauth_state=abc123                                         |
   |                                                                          |
   |---- GET accounts.google.com/... -----> |                                 |
   |                                        | (login + consent UI)            |
   |<------ 302 Location: ----------------- |                                 |
   |   localhost:3001/auth/google/callback?code=4/0Ab...&state=abc123        |
   |                                                                          |
   |---- GET /auth/google/callback ->       |                                 |
   |   ?code=4/0Ab...&state=abc123          |                                 |
   |   Cookie: oauth_state=abc123                                             |
   |                      |                                                   |
   |                      | 1) clearStateCookie()  (independente do desfecho) |
   |                      | 2) state da query == state do cookie? OK         |
   |                      | 3) exchangeCodeForTokens(code) ------------------>|
   |                      |    POST oauth2.googleapis.com/token               |
   |                      |    body: code, client_id, client_secret,          |
   |                      |          redirect_uri, grant_type                 |
   |                      |<------------------------------ tokens             |
   |                      |    { access_token, id_token (JWT), expires_in }   |
   |                      |                                                   |
   |                      | 4) verifyIdToken(id_token):                       |
   |                      |    - decodifica header, extrai kid                |
   |                      |    - getSigningKey(kid) ----------------------------------> GET /oauth2/v3/certs
   |                      |                                                            <- { keys: [...] } + Cache-Control: max-age=...
   |                      |    - crypto.createPublicKey(jwk) + crypto.verify(RSA-SHA256, ...)
   |                      |    - valida iss, aud, exp, iat (clock skew 60s)   |
   |                      |    - zod.parse(payload) -> GoogleIdTokenPayload   |
   |                      |                                                   |
   |                      | 5) findOrCreateGoogleUser(payload):               |
   |                      |    a) Account com (google, sub) existe? -> User  |
   |                      |    b) email_verified=false? -> 401               |
   |                      |    c) User com mesmo email? -> auto-link         |
   |                      |    d) senão -> cria User + Account                |
   |                      |                                                   |
   |                      | 6) createSession(user.id) (TTL 7 dias)            |
   |                      | 7) setSessionCookie (HttpOnly, SameSite=Lax)      |
   |                      |                                                   |
   |<- 302 Location: / ----                                                   |
   |   Set-Cookie: session=...; HttpOnly; SameSite=Lax; Max-Age=604800         |
   |   Set-Cookie: oauth_state=; Max-Age=0  (limpa o cookie de state)         |
   |                                                                          |
   |---- GET / (autenticado pelo cookie session) -->                          |
```

---

<a id="4-etapa-por-etapa"></a>
## 4. Etapa por etapa, com código

### 4.1 Usuário clica em "Login com Google" → `GET /auth/google`

`apps/api/src/auth/route.ts:64-68`:

```ts
app.get("/google", (c) => {
  const state = generateState()
  setStateCookie(c, state)
  return c.redirect(buildAuthUrl(state), 302)
})
```

Três coisas acontecem aqui, em ordem:

**(a) Geração do `state`**

`apps/api/src/auth/oauth.ts:18-20`:

```ts
export function generateState(): string {
  return crypto.randomBytes(24).toString("hex")
}
```

24 bytes random viram 48 chars hex. É um nonce **single-use**, criptograficamente seguro. Serve como token CSRF: vai junto no redirect pra Google e também no cookie do navegador, e na volta a gente exige que os dois batam.

**(b) Cookie `oauth_state`**

`apps/api/src/auth/oauth.ts:22-29`:

```ts
export function setStateCookie(c: Context, state: string) {
  setCookie(c, OAUTH_STATE_COOKIE, state, {
    maxAge: OAUTH_STATE_TTL_SECONDS,  // 600 = 10 min
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
  })
}
```

- `HttpOnly` — JavaScript do navegador não consegue ler. Mitiga roubo via XSS.
- `SameSite=Lax` — não vai junto em requests cross-site iniciados por POST/iframe/etc., mas **vai** em navegações top-level (que é exatamente o caso do callback OAuth). É o equilíbrio certo pra esse cookie.
- `Max-Age=600` — janela de 10 min. Se o usuário levar mais que isso pra autorizar na Google, perde a transação. Trade-off entre UX e tamanho da janela exploitável.

**(c) Redirect para a URL de autorização do Google**

`apps/api/src/auth/google.ts:25-35`:

```ts
export function buildAuthUrl(state: string): string {
  const url = new URL(GOOGLE_AUTH_URL)
  url.searchParams.set("client_id", requireEnv("GOOGLE_CLIENT_ID"))
  url.searchParams.set("redirect_uri", requireEnv("GOOGLE_REDIRECT_URI"))
  url.searchParams.set("response_type", "code")
  url.searchParams.set("scope", SCOPES.join(" "))  // "openid email profile"
  url.searchParams.set("state", state)
  url.searchParams.set("access_type", "offline")
  url.searchParams.set("prompt", "select_account")
  return url.toString()
}
```

Significado de cada parâmetro:

| Param | Significado |
|---|---|
| `client_id` | Identifica nosso app pra Google. Público (vai no navegador). |
| `redirect_uri` | Onde a Google manda o usuário de volta. **Precisa bater exatamente** com um URI cadastrado no Google Cloud Console. É uma das defesas: se atacante usar nosso `client_id` pra mandar usuário pra outro lugar, a Google rejeita. |
| `response_type=code` | Pede o **Authorization Code Flow**. Outras opções (`token`, `id_token`) existem mas são pra Implicit Flow (deprecated). |
| `scope=openid email profile` | `openid` ativa OIDC (sem ele, não vem `id_token`). `email` adiciona `email`/`email_verified` ao token. `profile` adiciona `name`/`picture`. |
| `state` | Nosso nonce CSRF. Google devolve sem ler. |
| `access_type=offline` | Pede `refresh_token`. Não usamos ainda, mas reduz fricção se precisar depois. |
| `prompt=select_account` | Sempre força a tela "escolha uma conta". Útil pra trocar de conta no dev; em produção pode ser irritante. |

### 4.2 Google autentica o usuário e redireciona

Lá no domínio `accounts.google.com`, o usuário faz login (se ainda não estava logado), vê a tela de consentimento listando os scopes, clica em "Permitir". Google emite um `code` (string opaca de ~50 chars, TTL ~10 min) e redireciona o navegador:

```
302 Location: http://localhost:3001/auth/google/callback?code=4/0Ab...&state=abc123
```

Se o usuário **negar**, Google ainda redireciona, mas com:

```
?error=access_denied&error_description=...&state=abc123
```

### 4.3 Callback — `GET /auth/google/callback`

`apps/api/src/auth/route.ts:70-89` (handler completo):

```ts
app.get(
  "/google/callback",
  zValidator("query", oauthCallbackQuerySchema, throwOnInvalid),
  async (c) => {
    const query = c.req.valid("query")
    const cookieState = getStateCookie(c)
    clearStateCookie(c)

    if (query.error) {
      throw new BadRequestError(`Google OAuth error: ${query.error}`)
    }
    if (!query.code || !query.state) {
      throw new BadRequestError("Missing code or state")
    }
    if (!cookieState || cookieState !== query.state) {
      throw new BadRequestError("Invalid OAuth state")
    }

    const tokens = await exchangeCodeForTokens(query.code)
    const payload = await verifyIdToken(tokens.id_token)
    const user = await findOrCreateGoogleUser(payload)
    const session = await createSession(user.id)
    setSessionCookie(c, session)

    return c.redirect(POST_LOGIN_REDIRECT, 302)
  },
)
```

Vamos pela ordem:

**(a) Validação Zod do query**

`packages/validators/src/oauth.ts:7-12`:

```ts
export const oauthCallbackQuerySchema = z.object({
  code: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  error: z.string().min(1).optional(),
  error_description: z.string().optional(),
})
```

Todos opcionais porque o callback aceita dois shapes — sucesso (`code` + `state`) e erro (`error` + `state`). A discriminação fica no handler. Schema único é mais simples que `z.union` e plays nice com o `zValidator`.

**(b) Limpa o cookie de state (independente do desfecho)**

```ts
clearStateCookie(c)
```

`Set-Cookie: oauth_state=; Max-Age=0` invalida o cookie no navegador. Single-use, exatamente como um nonce deve ser.

**(c) Checa erros do provedor**

Se Google mandou `?error=access_denied`, a gente lança `BadRequestError` antes de fazer qualquer outra coisa. Importante: o teste valida que `exchangeCodeForTokens` **não é chamado** nesse caso — código não é gasto à toa.

**(d) Checa state**

```ts
if (!cookieState || cookieState !== query.state) {
  throw new BadRequestError("Invalid OAuth state")
}
```

Essa é **a defesa CSRF do OAuth**. Cenário do ataque:

1. Atacante inicia o flow no próprio navegador, captura sua URL de redirect com `?code=X&state=Y`.
2. Engana a vítima logada pra clicar num link que aciona esse mesmo callback.
3. Se não checássemos `state`, a vítima logaria como o atacante na sua própria sessão — passando a usar a "identidade Google" do atacante (que pode ter sido configurada pra logar sua propriedade depois).

O `state` único impede isso: o cookie da vítima nunca terá o `state=Y` do atacante.

**(e) Troca o `code` por tokens**

`apps/api/src/auth/google.ts:37-56`:

```ts
export async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: requireEnv("GOOGLE_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),  // NUNCA vai pro navegador
      redirect_uri: requireEnv("GOOGLE_REDIRECT_URI"),
      grant_type: "authorization_code",
    }),
  })
  // ... parse Zod
}
```

Esse é o canal **server-to-server**. Google verifica:

- `code` é válido, não expirou e ainda não foi resgatado (single-use).
- `client_id` + `client_secret` batem com um app real.
- `redirect_uri` bate com o usado na fase de auth.

Se tudo OK, devolve um JSON validado por `googleTokenResponseSchema`:

```json
{
  "access_token": "ya29.a0...",
  "id_token": "eyJhbGciOi...",
  "expires_in": 3599,
  "token_type": "Bearer",
  "scope": "openid email profile https://www.googleapis.com/auth/userinfo..."
}
```

O `access_token` serve pra chamar APIs da Google em nome do usuário (não usamos). O **`id_token` é o que importa pra nós** — é o JWT que afirma a identidade.

**(f) Verifica o `id_token`**

Aqui acontece toda a mágica de validação criptográfica. Detalhada na [seção 8](#8-verificacao-jwt).

**(g) Resolve o usuário local**

`apps/api/src/auth/oauth.ts:71-119` — função `findOrCreateGoogleUser`. Detalhada na [seção 6](#6-estrategia-de-vinculacao).

**(h) Cria sessão + cookie**

`apps/api/src/auth/session.ts` (do M2):

```ts
const session = await createSession(user.id)  // insere row em Session, TTL 7 dias
setSessionCookie(c, session)                    // Set-Cookie: session=<token>; HttpOnly; SameSite=Lax; Max-Age=604800
```

A partir daqui o usuário tá logado igual a um login email+senha. Mesma sessão, mesmo cookie, mesma middleware (`authMiddleware`), mesmo `/me`. **OAuth e password compartilham a infra de sessão do M2 100%.**

**(i) Redirect final**

`return c.redirect(POST_LOGIN_REDIRECT, 302)` — pra `/` por default. Configurável via `OAUTH_POST_LOGIN_REDIRECT`.

---

<a id="5-schema-de-dados"></a>
## 5. Schema de dados — User / Account / Session

`packages/db/prisma/schema.prisma`:

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  username     String   @unique
  displayName  String
  passwordHash String?           // NULL para usuários OAuth-only
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  sessions     Session[]
  accounts     Account[]
}

model Account {
  id                String   @id @default(uuid())
  userId            String
  provider          String                   // "google"
  providerAccountId String                   // "sub" do id_token (ID único do user na Google)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])    // 1 conta externa por usuário externo
  @@index([userId])
}

model Session {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

### Por que `Account` separada?

A primeira tentação seria adicionar colunas `googleId`, `googleEmail`... no `User`. Não escala:

- Se amanhã suportar GitHub: `githubId`, `githubEmail`, `appleId`... — Sparse columns.
- Um mesmo usuário pode ter Google **e** GitHub vinculados. Modelo 1:N resolve.
- Operações como "desvincular Google" viram `DELETE FROM account` ao invés de zerar 4 colunas.

Esse padrão é **o padrão da indústria** — NextAuth/Auth.js, Better Auth, Clerk, Supabase, todos usam variantes desse shape.

### Por que `passwordHash` virou opcional?

Usuário que entra **só** via Google nunca define senha. Alternativas pioraram:

- Senha aleatória forçada: cria sujeira semântica ("essa coluna tem um valor que ninguém pode usar").
- String vazia: idem, e pega edge cases ruins no `bcrypt.compare`.

`NULL` comunica intenção: "esse usuário não tem credencial local". O `loginUser` agora rejeita `if (!user?.passwordHash)` mantendo a mesma mensagem genérica — anti-enumeration.

### `provider + providerAccountId` como chave única

Não usamos email como chave da Account. Razão: o **`sub`** do Google é estável; o email pode mudar (raramente, mas pode — usuário renomeia, organização migra de domínio). Sempre olhamos pra `sub`.

---

<a id="6-estrategia-de-vinculacao"></a>
## 6. Estratégia de vinculação de contas

`apps/api/src/auth/oauth.ts:71-119`:

```ts
export async function findOrCreateGoogleUser(payload: GoogleIdTokenPayload) {
  // (1) Account já existe? Reusa o user.
  const existing = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: payload.sub,
      },
    },
    select: { user: { select: publicUserSelect } },
  })
  if (existing) return existing.user

  // (2) Sem auto-link se o email não foi verificado.
  if (!payload.email_verified) {
    throw new AuthenticationError("Google email not verified")
  }

  // (3) Existe User com esse email? Auto-vincula.
  const userByEmail = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true },
  })
  if (userByEmail) {
    await prisma.account.create({
      data: {
        provider: "google",
        providerAccountId: payload.sub,
        userId: userByEmail.id,
      },
    })
    return prisma.user.findUniqueOrThrow({
      where: { id: userByEmail.id },
      select: publicUserSelect,
    })
  }

  // (4) Novo usuário: User + Account no mesmo nested write.
  const username = await generateUniqueUsername(payload.email)
  return prisma.user.create({
    data: {
      email: payload.email,
      username,
      displayName: payload.name ?? username,
      accounts: {
        create: { provider: "google", providerAccountId: payload.sub },
      },
    },
    select: publicUserSelect,
  })
}
```

### Os 3 cenários que essa função discrimina

**Cenário A — Retorno (já vinculado).** Usuário já logou com Google antes. `Account` existe com `(provider="google", providerAccountId=sub)`. Reaproveita o `User`. Caminho mais quente.

**Cenário B — Auto-link.** Usuário se cadastrou antes via email+senha com o mesmo email que aparece no `id_token`. Como confiamos no `email_verified=true` (Google atestou que ele controla aquela caixa), cria-se uma `Account` apontando pro `User` existente. Próximo login (cenário A) será instantâneo.

**Trade-off do auto-link:** mais simples pra UX, mas assume que `email_verified` é confiável. Existem provedores OIDC onde isso pode ser fraudado. Pra Google é seguro. Documentado conscientemente.

**Cenário C — Novo usuário.** Não existe `Account` nem `User` com esse email. Cria os dois numa única operação (nested write do Prisma — atômico).

`username` é derivado do email (`john.doe@x.com` → `john-doe`), com sufixo hex em colisão (`john-doe-a1b2`). `displayName` vem do `name` do Google (ou fallback pro username).

### O que NÃO acontece

- **Não pedimos senha** pra usuário OAuth. `passwordHash` fica `NULL`.
- **Não criamos sessão dentro dessa função.** Ela só resolve qual `User` retornar. Sessão é responsabilidade do handler (que orquestra Google → user → session).
- **Não tratamos o caso "email-verified=false E user já existente com esse email"**. Hoje cai na Account-by-sub (cenário A) se já vinculado, ou rejeita (passo 2). Em produção, considerar UX de "verifique antes de logar".

---

<a id="7-seguranca"></a>
## 7. Segurança — o que cada peça protege

| Vetor de ataque | Defesa | Onde |
|---|---|---|
| **CSRF no callback** (atacante força vítima a logar com identidade do atacante) | `state` aleatório single-use que precisa bater no cookie `oauth_state` | `route.ts` (gera, valida) + `oauth.ts` (cookie) |
| **Roubo de cookie de session via XSS** | `HttpOnly` em todos os cookies (session + state) | `session.ts` + `oauth.ts` |
| **CSRF em endpoints com side-effect** | `SameSite=Lax` no cookie de session — não vai junto em POST cross-site | `session.ts` |
| **Code interception** (atacante intercepta o code no redirect) | Canal server-to-server na troca + `code` single-use + `client_secret` que só o backend tem | `google.ts:exchangeCodeForTokens` |
| **Token forging** (atacante manda `id_token` falso direto no callback) | Não aceitamos `id_token` na query, só `code`. Token vem **só** via troca server-to-server com a Google. | Design da flow |
| **`id_token` falsificado** | Verificação de assinatura RSA contra a JWKS pública da Google | `google.ts:verifyIdToken` |
| **Replay de `id_token` antigo** | Validação de `exp` com clock skew de 60s | `google.ts:verifyIdToken` |
| **`id_token` emitido pra outro app** | Validação de `aud === GOOGLE_CLIENT_ID` | `google.ts:verifyIdToken` |
| **`id_token` emitido por outro IdP** | Validação de `iss` ∈ issuers oficiais do Google | `google.ts:verifyIdToken` |
| **User enumeration por mensagem de erro** | `loginUser` retorna a mesma mensagem se o user não existe OU se é OAuth-only OU se a senha errou | `service.ts:loginUser` |
| **Account takeover via email não verificado** | `findOrCreateGoogleUser` recusa quando `email_verified=false` (a não ser que a Account já exista) | `oauth.ts:findOrCreateGoogleUser` |
| **Sessão expirada / longa demais** | TTL de 7 dias no cookie + checagem de `expiresAt > now` em toda request | `session.ts` + `middleware.ts` |
| **Brute-force no callback** | _Não temos rate limit hoje._ Aberto pra revisitar. | — |

---

<a id="8-verificacao-jwt"></a>
## 8. Verificação manual do `id_token` (JWT) com `node:crypto`

Decisão: validar o JWT **sem libs externas** (não usamos `jose` nem `google-auth-library`). Alinhado com a filosofia "sem libs de auth" da CLAUDE.md.

### Anatomia de um JWT

`xxx.yyy.zzz` — três partes base64url separadas por ponto:

- **Header** (xxx): `{ "alg": "RS256", "kid": "abc123", "typ": "JWT" }` — algoritmo + ID da chave que assinou.
- **Payload** (yyy): claims (`iss`, `sub`, `aud`, `exp`, `iat`, `email`, `email_verified`, `name`, `picture`).
- **Signature** (zzz): assinatura criptográfica de `base64url(header) + "." + base64url(payload)` usando a chave privada da Google.

A gente usa **a chave pública correspondente** (publicada na JWKS) pra verificar.

### Os passos, no código (`apps/api/src/auth/google.ts:99-148`)

```ts
export async function verifyIdToken(idToken: string): Promise<GoogleIdTokenPayload> {
  // (1) Split do JWT.
  const parts = idToken.split(".")
  if (parts.length !== 3) throw new Error("Invalid JWT: expected 3 segments")
  const [headerB64, payloadB64, signatureB64] = parts

  // (2) Decodifica header pra pegar alg + kid.
  const header = JSON.parse(base64UrlDecode(headerB64).toString("utf8"))
  if (header.alg !== "RS256") throw new Error(`Unsupported JWT alg: ${header.alg}`)
  if (!header.kid)            throw new Error("Missing kid in JWT header")

  // (3) Busca a chave pública correta na JWKS (com cache + rotação).
  const jwk = await getSigningKey(header.kid)

  // (4) Converte o JWK pra KeyObject do Node 16+.
  const publicKey = crypto.createPublicKey({ key: jwk, format: "jwk" })

  // (5) Verifica a assinatura.
  const signedInput = Buffer.from(`${headerB64}.${payloadB64}`, "utf8")
  const signature   = base64UrlDecode(signatureB64)
  if (!crypto.verify("RSA-SHA256", signedInput, publicKey, signature)) {
    throw new Error("Invalid JWT signature")
  }

  // (6) Agora que sabemos que ninguém adulterou o payload, validamos a forma com Zod.
  const payload = googleIdTokenPayloadSchema.parse(
    JSON.parse(base64UrlDecode(payloadB64).toString("utf8")),
  )

  // (7) Validação semântica das claims.
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp + CLOCK_SKEW_SECONDS < now)         throw new Error("JWT expired")
  if (payload.iat - CLOCK_SKEW_SECONDS > now)         throw new Error("JWT iat in the future")
  if (!GOOGLE_ISSUERS.has(payload.iss))               throw new Error(`Invalid iss: ${payload.iss}`)
  if (payload.aud !== requireEnv("GOOGLE_CLIENT_ID")) throw new Error("Invalid aud")

  return payload
}
```

### Cache da JWKS (`google.ts:71-95`)

```ts
let jwksCache: JwksCache | null = null

async function fetchJwks(): Promise<JwksCache> {
  const response = await fetch(GOOGLE_JWKS_URL)
  const data = await response.json()
  const maxAgeMatch = response.headers.get("cache-control")?.match(/max-age=(\d+)/)
  const ttlMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : JWKS_FALLBACK_TTL_MS
  return {
    keys: new Map(data.keys.map((key) => [key.kid, key])),
    expiresAt: Date.now() + ttlMs,
  }
}

async function getSigningKey(kid: string): Promise<GoogleJwk> {
  if (!jwksCache || jwksCache.expiresAt <= Date.now()) {
    jwksCache = await fetchJwks()
  }
  let key = jwksCache.keys.get(kid)
  if (!key) {
    // Key rotation: Google trocou de chave entre fetches.
    jwksCache = await fetchJwks()
    key = jwksCache.keys.get(kid)
  }
  if (!key) throw new Error(`Unknown JWT key id: ${kid}`)
  return key
}
```

**Três comportamentos relevantes:**

1. **Cache respeita `Cache-Control: max-age=...`** da resposta da Google. Eles publicam algo como `max-age=21600` (6h). Se o header tiver, usamos; se não, fallback de 1h.
2. **Refetch em key miss.** Google rotaciona chaves periodicamente. Se o `kid` do JWT não existe na cache, refazemos o fetch uma vez (provavelmente cache está stale e a chave nova já tá lá).
3. **Cache em memória, global no módulo.** Sobrevive a múltiplas requests da mesma instância. Reinicia em deploy. Pra escala maior, viraria Redis — mas pra um app pessoal é desnecessário.

### Por que validamos `aud` e `iss`

Sem `aud`: alguém que controla outro app OAuth pegou o `id_token` que ele recebeu de um usuário (legitimamente) e tenta usar no nosso. A assinatura é válida, o `exp` tá no futuro, o `iss` é Google — mas `aud` é o `client_id` do **outro** app. Recusar.

Sem `iss`: imagine que `kid` colide com chave de outro IdP que assina RS256. Extremamente improvável, mas `iss` é a defesa correta.

---

<a id="9-estrategia-de-testes"></a>
## 9. Estratégia de testes (mock do boundary)

`tests/integration/api/auth/google.test.ts`.

### O problema

Testes de integração precisam ser **hermetic** — sem chamar a Google de verdade. Mas a verificação criptográfica do `id_token` é parte importante do código. Como cobrir o handler sem precisar gerar JWTs reais?

### A solução: mock do módulo `google.ts`

`google.ts` é o único lugar do código que toca a rede ou faz crypto. Isso é proposital — separar o boundary HTTP/crypto do resto:

```ts
// tests/integration/api/auth/google.test.ts
vi.mock("@dd-chat/api/auth/google", () => ({
  buildAuthUrl: vi.fn(...),
  exchangeCodeForTokens: vi.fn(),
  verifyIdToken: vi.fn(),
}))
```

A rota importa `./google.js` (relativa). O teste importa `@dd-chat/api/auth/google` (alias do workspace). Ambos resolvem pro mesmo arquivo absoluto, e o Vitest aplica o mock pelos dois caminhos.

Pra isso funcionar, foi necessário expor o módulo em `apps/api/package.json`:

```json
"exports": {
  "./app": "./src/app.ts",
  "./auth/service": "./src/auth/service.ts",
  "./auth/google": "./src/auth/google.ts"
}
```

### O que isso cobre, e o que não cobre

**Coberto:**
- O **handler** (validação de state, ordem de chamadas, response correto).
- A **orquestração** (`findOrCreateGoogleUser`, criação de sessão, cookies).
- A **persistência** (Account/User/Session no banco real).

**Não coberto** (registrado em `progress/M3.md` como dívida):
- Verificação real de assinatura JWT (`verifyIdToken` interno).
- Cache + rotação da JWKS.
- Erro real da Google na troca de code.

Quando criar `tests/unit/`, dá pra gerar um RSA keypair com `crypto.generateKeyPairSync`, exportar como JWK, stubar a JWKS via `vi.spyOn(globalThis, "fetch")`, assinar um JWT à mão, e testar `verifyIdToken` em isolamento.

### Test factory pattern

Os testes usam um **builder** local pro payload (`buildPayload(overrides)`) que produz um `GoogleIdTokenPayload` válido por default e permite sobrescrever campos. Igual ao pattern de `validSignupBody` do M2.

```ts
const buildPayload = (overrides = {}): GoogleIdTokenPayload => ({
  iss: "https://accounts.google.com",
  sub: faker.string.numeric(21),
  aud: "test-client-id",
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
  email: faker.internet.email().toLowerCase(),
  email_verified: true,
  name: faker.person.fullName(),
  picture: "https://example.com/avatar.png",
  ...overrides,
})
```

---

<a id="10-variaveis-de-ambiente"></a>
## 10. Variáveis de ambiente

| Variável | Significado | Exemplo |
|---|---|---|
| `GOOGLE_CLIENT_ID` | ID público do projeto no Google Cloud. | `123-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Segredo do app. **Nunca** vai pro navegador. | `GOCSPX-...` |
| `GOOGLE_REDIRECT_URI` | URL exata cadastrada no Google Console. | `http://localhost:3001/auth/google/callback` |
| `OAUTH_POST_LOGIN_REDIRECT` | Pra onde mandar o usuário após login bem-sucedido. | `/` (default) |

Todas validadas lazy via `requireEnv()` — a função lança erro descritivo na primeira request se faltar. Validação no boot fica como melhoria (registrada em `progress/M3.md`).

---

<a id="11-mapa-de-arquivos"></a>
## 11. Mapa de arquivos

```
packages/
  validators/src/
    oauth.ts                  Schemas Zod: callback query, token response, id_token payload
    auth.ts                   (M2) signupSchema, loginSchema
    user.ts                   (M2) userPublicSchema
    index.ts                  re-exporta tudo
  db/
    prisma/schema.prisma      User (passwordHash?), Account, Session
    prisma/migrations/
      20260512153541_add_oauth_accounts/    Migration: passwordHash nullable + Account

apps/api/src/
  auth/
    route.ts                  Rotas /auth/* (signup, login, me, logout, google, google/callback)
    service.ts                signupUser, loginUser, publicUserSelect (compartilhado)
    session.ts                createSession, setSessionCookie, clearSessionCookie, revokeSession
    middleware.ts             authMiddleware (lê cookie session, popula c.set('user'))
    password.ts               hashPassword, verifyPassword (bcrypt)
    google.ts                 buildAuthUrl, exchangeCodeForTokens, verifyIdToken (boundary HTTP/JWT)
    oauth.ts                  state cookies, findOrCreateGoogleUser, generateUniqueUsername
  errors.ts                   AppError, AuthenticationError, ConflictError, BadRequestError
  app.ts                      Hono app + onError centralizado
  index.ts                    bootstrap (serve())

tests/
  integration/api/auth/
    signup.test.ts            (M2) 10 testes
    login.test.ts             (M2) 8 testes
    me.test.ts                (M2) 4 testes
    logout.test.ts            (M2) 3 testes
    google.test.ts            (M3) 10 testes — flow OAuth completo
  helpers/
    app.ts, auth.ts, setup.ts, types.ts
    factories/user.ts

progress/
  M2.md                       Histórico fino do M2 (auth email+senha)
  M3.md                       Histórico fino do M3 (este milestone)

docs/
  oauth.md                    Este documento
```

### Princípio de organização

- **`validators/`** é o contrato. Tudo que cruza a fronteira (HTTP body, query, JWT payload) passa por Zod aqui.
- **`apps/api/src/auth/`** é vertical-slice: tudo de auth fica junto. Não tem `services/` separado de `routes/` — é feature-folder.
- **`google.ts`** é o único módulo do auth que faz I/O externo (fetch + crypto). Isso é proposital — concentra tudo que é mockável.
- **`oauth.ts`** é "OAuth, agnóstico de provedor": state, user resolution. Hoje só Google, mas adicionar GitHub seria criar `github.ts` e estender `findOrCreateOAuthUser` (refactor futuro).
- **`session.ts`** é compartilhado entre password-login e OAuth-login. Mesma row de `Session`, mesmo cookie, mesma middleware.
