import {
	CATEGORY_KEYS,
	type CategoryKey,
	type ContextPreviewRequest,
	type ContextPreviewResponse,
	type ContextPreviewV2Response,
} from "@dd-chat/validators"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"

export type { ContextPreviewV2Response }
export { CATEGORY_KEYS, type CategoryKey }

export function useContextPreview() {
	return useMutation<ContextPreviewResponse, Error, ContextPreviewRequest>({
		mutationFn: (input) => api.post<ContextPreviewResponse>("/context/preview", input),
	})
}

export function useContextPreviewV2() {
	return useMutation<ContextPreviewV2Response, Error, ContextPreviewRequest>({
		mutationFn: (input) => api.post<ContextPreviewV2Response>("/context/preview-v2", input),
	})
}

export function useContextPreviewV3() {
	return useMutation<ContextPreviewV2Response, Error, ContextPreviewRequest>({
		mutationFn: (input) => api.post<ContextPreviewV2Response>("/context/preview-v3", input),
	})
}
