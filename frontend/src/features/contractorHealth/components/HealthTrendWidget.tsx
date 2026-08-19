import type { ReactElement } from 'react';

import { BaseChart } from '@/shared/components/charts/BaseChart';
import { E_CHARTS_THEME_DARK_NAME } from '@/shared/components/charts/echartsDarkTheme';
import { formatDate } from '@/shared/utils/formatDate';

import type { IContractorHealthDashboard } from '../types/contractorHealth.types';
import { buildHealthTrendLineChartOption } from '../utils/contractorHealthUtils';

export interface IHealthTrendWidgetProps {
  dashboard: IContractorHealthDashboard;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value);
}

/**
 * Health trend: line chart theo `trendHistory` của mock.
 */
export function HealthTrendWidget({ dashboard }: IHealthTrendWidgetProps): ReactElement {
  const option = buildHealthTrendLineChartOption({
    trendHistory: dashboard.trendHistory,
    avgScore: dashboard.avgScore,
  });

  const lastValue = dashboard.trendHistory[dashboard.trendHistory.length - 1] ?? dashboard.avgScore;
  const latest = formatNumber(lastValue);
  const updated = formatDate(dashboard.generatedAt);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-start justify-between gap-3 pb-3">
        <div className="min-w-0">
          <div className="text-caption text-[var(--text-secondary)]">Điểm sức khỏe nhà thầu (TB)</div>
          <div className="text-heading-md font-semibold tabular-nums text-[var(--text-primary)]">
            {latest}
          </div>
        </div>
        <div className="shrink-0 text-caption text-[var(--text-tertiary)]">Cập nhật: {updated}</div>
      </div>

      <div className="min-h-0 flex-1">
        <BaseChart option={option} theme={E_CHARTS_THEME_DARK_NAME} height={240} />
      </div>
    </div>
  );
}

HealthTrendWidget.displayName = 'HealthTrendWidget';

