import type { ReactElement } from 'react';

import { BulletChart } from '@/shared/components/charts/BulletChart';

import type { IBulletChartItem } from '@/shared/components/charts/BulletChart';

import type { IOverviewDashboard } from '@/features/overview/types/overview.types';

export interface IDelayedPackagesWidgetProps {
  data: IOverviewDashboard;
}

/** Ngưỡng chậm chấp nhận được (ngày) — hiển thị marker trên bullet. */
const ACCEPTABLE_DELAY_DAYS = 14;

/**
 * Widget W1.3 — Top gói thầu chậm hồ sơ (bullet chart).
 */
export function DelayedPackagesWidget({ data }: IDelayedPackagesWidgetProps): ReactElement {
  const packages = data.delayedPackages.slice(0, 5);
  const maxDelay = Math.max(...packages.map((p) => p.delayDays), ACCEPTABLE_DELAY_DAYS);

  const items: IBulletChartItem[] = packages.map((p) => ({
    label: p.packageCode,
    actualRate: Math.min(100, (p.delayDays / maxDelay) * 100),
    targetRate: Math.min(100, (ACCEPTABLE_DELAY_DAYS / maxDelay) * 100),
    delayDays: p.delayDays,
  }));

  return (
    <div className="chart-fill flex min-h-0 w-full items-stretch overflow-hidden">
      <BulletChart data={{ items }} height="100%" />
    </div>
  );
}
