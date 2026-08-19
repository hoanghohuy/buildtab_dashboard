import type { ReactElement } from 'react';

import { RadarChart } from '@/shared/components/charts/RadarChart';

import type { IContractorHealthDashboard } from '../types/contractorHealth.types';
import { buildHealthRadarChartData } from '../utils/contractorHealthUtils';

export interface IHealthRadarWidgetProps {
  dashboard: IContractorHealthDashboard;
}

/**
 * Widget Radar so sánh <= 3 series (best / average / worst).
 */
export function HealthRadarWidget({ dashboard }: IHealthRadarWidgetProps): ReactElement {
  const radarData = buildHealthRadarChartData(dashboard.contractors);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0 pb-2">
        <p className="text-caption text-[var(--text-secondary)]">
          So sánh 6 trụ cột: best / trung bình / nguy cơ cao
        </p>
      </div>
      <div className="min-h-0 flex-1">
        <RadarChart data={radarData} height={200} />
      </div>
    </div>
  );
}

HealthRadarWidget.displayName = 'HealthRadarWidget';

