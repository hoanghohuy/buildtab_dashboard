import type { IApiResponse } from '@/shared/types/api.types';

const modules = import.meta.glob('./**/*.json', { eager: true });

/**
 * Tải mock data từ thư mục mocks.
 * @param path - Tên file không có extension, vd "overview", "finance"
 */
export async function loadMock<T>(path: string): Promise<IApiResponse<T>> {
  const key = `./${path}.json`;
  const mod = modules[key] as { default: IApiResponse<T> } | undefined;
  if (!mod) throw new Error(`Mock not found: ${key}`);
  return mod.default;
}
