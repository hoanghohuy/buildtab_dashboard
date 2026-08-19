const DATA_ARM = import.meta.env.VITE_DATA_ARM || 'mock';

/** @description HTTP service — chuyển mock/live theo env VITE_DATA_ARM */
export const HttpService = {
  async get<T>(path: string): Promise<T> {
    if (DATA_ARM === 'mock') {
      const { loadMock } = await import('@/mocks/loadMock');
      return loadMock<T>(path) as T;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};
