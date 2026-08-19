import type { ReactElement } from 'react';

import { HeatmapChart } from '@/shared/components/charts/HeatmapChart';

import type { IContractorHealthDashboard } from '../types/contractorHealth.types';
import { buildCriteriaHeatmapChartData } from '../utils/contractorHealthUtils';

export interface ICriteriaHeatmapWidgetProps {
  dashboard: IContractorHealthDashboard;
}

/**
 * Heatmap tiêu chí × đơn vị (6 trụ cột).
 */
export function CriteriaHeatmapWidget({ dashboard }: ICriteriaHeatmapWidgetProps): ReactElement {
  const heatmapData = buildCriteriaHeatmapChartData(dashboard);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0 pb-2">
        <p className="text-caption text-[var(--text-secondary)]">Điểm theo 6 trụ cột (0–100)</p>
      </div>
      <div className="min-h-0 flex-1">
        <HeatmapChart data={heatmapData} height={220} />
      </div>
    </div>
  );
}

CriteriaHeatmapWidget.displayName = 'CriteriaHeatmapWidget';

