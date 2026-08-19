import type { ReactElement } from 'react';

import type { IKpiMetric } from '@/shared/types/common.types';
import type { IGridPosition } from '@/shared/constants/GRID_LAYOUT';
import { GlassPanel } from '@/shared/components/glass/GlassPanel';
import { KpiCard } from '@/shared/components/kpi/KpiCard';

export interface IKpiStripProps {
  /** Dùng bởi `DashboardGrid` để đặt đúng vị trí trên lưới */
  position: IGridPosition;
  kpis: IKpiMetric[];
}

/**
 * Global KPI Strip (Phase 2: dùng mock từ `mocks/overview.json`).
 */
export function KpiStrip({ kpis }: IKpiStripProps): ReactElement {
  return (
    <GlassPanel level="L1" className="h-full w-full p-2">
      <div className="grid h-full grid-cols-6 gap-2">
        {kpis.slice(0, 6).map((metric) => (
          <KpiCard key={metric.key} metric={metric} />
        ))}
      </div>
    </GlassPanel>
  );
}

