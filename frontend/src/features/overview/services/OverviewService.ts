import overviewMockRaw from '@/mocks/overview.json';

import type { IOverviewDashboard } from '@/features/overview/types/overview.types';

interface IOverviewMockResponse {
  success: boolean;
  data: IOverviewDashboard;
  meta?: unknown;
}

/**
 * Service lấy dữ liệu Tab 1 Tổng quan.
 *
 * Hiện tại chạy mock-first theo yêu cầu: đọc trực tiếp `src/mocks/overview.json`.
 */
export const OverviewService = {
  /**
   * Lấy toàn bộ dữ liệu tổng hợp cho Tab 1 Tổng quan.
   */
  async getOverviewDashboard(): Promise<IOverviewDashboard> {
    const typed = overviewMockRaw as IOverviewMockResponse;
    return typed.data;
  },
};

