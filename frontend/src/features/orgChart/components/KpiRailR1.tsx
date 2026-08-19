import type { ReactElement } from 'react';

import { GlassCard } from '@/shared/components/glass/GlassCard';

export interface IKpiRailR1Props {
  unitCount: number;
  warningCount: number;
}

/**
 * KPI rail nhỏ cho Tab Org Chart (R1).
 */
export function KpiRailR1({ unitCount, warningCount }: IKpiRailR1Props): ReactElement {
  return (
    <div className="flex w-full items-stretch gap-3">
      <GlassCard className="flex h-full w-1/2 flex-col justify-between p-2.5">
        <div className="text-caption text-[var(--text-secondary)]">Số đơn vị</div>
        <div className="tabular-nums text-heading-md font-bold text-[var(--text-primary)]">{unitCount}</div>
      </GlassCard>
      <GlassCard className="flex h-full w-1/2 flex-col justify-between p-2.5">
        <div className="text-caption text-[var(--text-secondary)]">Cảnh báo</div>
        <div className="tabular-nums text-heading-md font-bold text-warning">{warningCount}</div>
      </GlassCard>
    </div>
  );
}

