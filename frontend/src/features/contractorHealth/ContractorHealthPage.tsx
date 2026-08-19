import type { ReactElement } from 'react';

import { AlarmCheck, ChartLine, ClipboardList, Map as MapIcon, Network, Target } from 'lucide-react';

import { DashboardShell } from '@/shared/components/layout/DashboardShell';
import { WidgetContainer } from '@/shared/components/glass/WidgetContainer';

import { useContractorHealthMock } from './hooks/useContractorHealthMock';

import { CriteriaHeatmapWidget } from './components/CriteriaHeatmapWidget';
import { EarlyWarningWidget } from './components/EarlyWarningWidget';
import { HealthRadarWidget } from './components/HealthRadarWidget';
import { HealthTrendWidget } from './components/HealthTrendWidget';
import { ScorecardWidget } from './components/ScorecardWidget';
import { WorkloadHealthBubbleMatrixWidget } from './components/WorkloadHealthBubbleMatrixWidget';

/**
 * TAB 4 — Sức khỏe nhà thầu / tư vấn: Radar + bubble matrix + heatmap criteria + scorecard + cảnh báo + trend.
 *
 * V0 bố trí:
 * - W4.1: Radar so sánh đa tiêu chí
 * - W4.2: Ma trận Khối lượng × Sức khỏe (bubble matrix xấp xỉ bằng heatmap)
 */
export default function ContractorHealthPage(): ReactElement {
  const { dashboard, isLoading, error } = useContractorHealthMock();

  return (
    <DashboardShell>
      <WidgetContainer
        title="Radar so sánh đa tiêu chí"
        icon={<Target className="h-5 w-5" aria-hidden="true" />}
        subtitle="Best / Trung bình / Worst (≤ 3 series)"
        position={{ colStart: 1, colSpan: 4, rowStart: 2, rowSpan: 3 }}
        isLoading={isLoading}
        error={error}
      >
        <HealthRadarWidget dashboard={dashboard} />
      </WidgetContainer>

      <WidgetContainer
        title="Ma trận Khối lượng × Sức khỏe"
        icon={<Network className="h-5 w-5" aria-hidden="true" />}
        subtitle="Bubble matrix (giả lập) x: score, y: workload"
        position={{ colStart: 5, colSpan: 4, rowStart: 2, rowSpan: 3 }}
        isLoading={isLoading}
        error={error}
      >
        <WorkloadHealthBubbleMatrixWidget dashboard={dashboard} />
      </WidgetContainer>

      <WidgetContainer
        title="Scorecard nhà thầu"
        icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
        subtitle="Top 7 (best/worst) + tổng điểm"
        position={{ colStart: 9, colSpan: 4, rowStart: 2, rowSpan: 3 }}
        isLoading={isLoading}
        error={error}
      >
        <ScorecardWidget dashboard={dashboard} />
      </WidgetContainer>

      <WidgetContainer
        title="Heatmap tiêu chí × đơn vị"
        icon={<MapIcon className="h-5 w-5" aria-hidden="true" />}
        subtitle="Hiển thị heatmapData (6 trụ cột)"
        position={{ colStart: 1, colSpan: 8, rowStart: 5, rowSpan: 2 }}
        isLoading={isLoading}
        error={error}
      >
        <CriteriaHeatmapWidget dashboard={dashboard} />
      </WidgetContainer>

      <WidgetContainer
        title="Early Warning"
        icon={<AlarmCheck className="h-5 w-5" aria-hidden="true" />}
        subtitle="Cảnh báo sớm (≤ 4)"
        position={{ colStart: 9, colSpan: 4, rowStart: 5, rowSpan: 2 }}
        isLoading={isLoading}
        error={error}
      >
        <EarlyWarningWidget dashboard={dashboard} />
      </WidgetContainer>

      <WidgetContainer
        title="Health trend"
        icon={<ChartLine className="h-5 w-5" aria-hidden="true" />}
        subtitle="Line chart theo trendHistory / avgScore"
        position={{ colStart: 1, colSpan: 12, rowStart: 7, rowSpan: 3 }}
        isLoading={isLoading}
        error={error}
      >
        <HealthTrendWidget dashboard={dashboard} />
      </WidgetContainer>
    </DashboardShell>
  );
}
