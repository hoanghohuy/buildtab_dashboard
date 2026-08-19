import useSWR from 'swr';

import { REFRESH_INTERVALS } from '@/shared/constants/REFRESH_INTERVALS';

import { OverviewService } from '@/features/overview/services/OverviewService';

import type { IOverviewDashboard } from '@/features/overview/types/overview.types';

import type {
  IUseOverviewDataOptions,
  IUseOverviewDataResult,
} from '@/features/overview/services/hooks/types/useOverviewData.types';

const OVERVIEW_DASHBOARD_SWR_KEY = 'dashboard/overview/dashboard';

const fetchOverviewDashboard = async (): Promise<IOverviewDashboard> => OverviewService.getOverviewDashboard();

/**
 * Hook SWR lấy dữ liệu Tab 1 Tổng quan.
 *
 * - Không tự tính KPI trên FE: chỉ map dữ liệu từ mock/BFF.
 * - refreshInterval mặc định theo `REFRESH_INTERVALS.DOCUMENT_PROGRESS`.
 */
export function useOverviewData(options?: IUseOverviewDataOptions): IUseOverviewDataResult {
  const refreshIntervalMs = options?.refreshIntervalMs ?? REFRESH_INTERVALS.DOCUMENT_PROGRESS;

  const { data, error } = useSWR<IOverviewDashboard, Error>(OVERVIEW_DASHBOARD_SWR_KEY, fetchOverviewDashboard, {
    refreshInterval: refreshIntervalMs,
  });

  const isLoading = typeof data === 'undefined' && typeof error === 'undefined';

  return {
    data,
    error,
    isLoading,
  };
}

