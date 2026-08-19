import type { ReactElement } from 'react';

import { HeatmapChart } from '@/shared/components/charts/HeatmapChart';

import type { IContractorHealthDashboard } from '../types/contractorHealth.types';
import { buildWorkloadBubbleMatrixHeatmapData } from '../utils/contractorHealthUtils';

export interface IWorkloadHealthBubbleMatrixWidgetProps {
  dashboard: IContractorHealthDashboard;
}

/**
 * Ma trận "bubble matrix" xấp xỉ bằng heatmap:
 * - Trục X: health score bucket
 * - Trục Y: workload bucket
 * - Màu/label: cường độ ~ packageCount
 */
export function WorkloadHealthBubbleMatrixWidget({
  dashboard,
}: IWorkloadHealthBubbleMatrixWidgetProps): ReactElement {
  const heatmapData = buildWorkloadBubbleMatrixHeatmapData(dashboard.contractors);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0 pb-2">
        <p className="text-caption text-[var(--text-secondary)]">
          Heatmap giả lập bubble: màu & số trong ô ~ số gói
        </p>
      </div>
      <div className="min-h-0 flex-1">
        <HeatmapChart data={heatmapData} height={200} />
      </div>
    </div>
  );
}

WorkloadHealthBubbleMatrixWidget.displayName = 'WorkloadHealthBubbleMatrixWidget';

