import type { ReactElement } from 'react';

import type { IKpiMetric, TStatusLevel } from '@/shared/types/common.types';
import { GlassCard } from '@/shared/components/glass/GlassCard';
import { DeltaBadge } from '@/shared/components/kpi/DeltaBadge';
import { Sparkline } from '@/shared/components/kpi/Sparkline';

export interface IKpiCardProps {
  metric: IKpiMetric;
}

function statusToTone(status: TStatusLevel): {
  textClass: string;
  sparkStroke: string;
} {
  switch (status) {
    case 'warning':
      return { textClass: 'text-warning', sparkStroke: '#FBBF24' };
    case 'danger':
    case 'critical':
      return { textClass: 'text-danger', sparkStroke: '#FB7185' };
    case 'normal':
    case 'good':
    default:
      return { textClass: 'text-accent', sparkStroke: '#22D3EE' };
  }
}

/**
 * Một card KPI trong Global KPI Strip.
 */
export function KpiCard({ metric }: IKpiCardProps): ReactElement {
  const tone = statusToTone(metric.status);

  const delta = metric.delta;
  const sparkValues = metric.sparkline ?? [];

  return (
    <div className="min-h-0 flex h-full flex-col">
      <GlassCard className="flex h-full min-h-0 flex-col justify-between gap-0.5 p-2">
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="truncate text-caption leading-snug text-[var(--text-secondary)]">
              {metric.label}
            </div>
          </div>
          {delta ? <DeltaBadge delta={delta} /> : null}
        </div>

        <div className="flex min-w-0 items-end justify-between gap-1.5">
          <div
            className={`truncate tabular-nums text-heading-md font-bold leading-none ${tone.textClass}`}
          >
            {metric.formatted}
          </div>
        </div>

        <div className="mt-0.5 shrink-0">
          <Sparkline values={sparkValues} stroke={tone.sparkStroke} />
        </div>
      </GlassCard>
    </div>
  );
}

