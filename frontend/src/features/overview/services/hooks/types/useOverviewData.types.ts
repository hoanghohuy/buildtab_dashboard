import type { IOverviewDashboard } from '@/features/overview/types/overview.types';

export interface IUseOverviewDataOptions {
  refreshIntervalMs?: number;
}

export interface IUseOverviewDataResult {
  data: IOverviewDashboard | undefined;
  error: Error | undefined;
  isLoading: boolean;
}

