/** Wrapper chuẩn cho mọi API response (BFF → FE) */
export interface IApiResponse<TData> {
  success: boolean;
  data: TData;
  meta: {
    generatedAt: string;
    sourceSyncedAt: string;
    cacheHit: boolean;
    sources: string[];
  };
  error?: {
    code: string;
    message: string;
  };
}
