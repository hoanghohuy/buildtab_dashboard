import type { ReactElement } from 'react';

import { FolderTree, Pin, TreeDeciduous } from 'lucide-react';

import orgChartMockRaw from '@/mocks/org-chart.json';
import { DashboardShell } from '@/shared/components/layout/DashboardShell';
import { WidgetContainer } from '@/shared/components/glass/WidgetContainer';

import { ClusterRail } from './components/ClusterRail';
import { KpiRailR1 } from './components/KpiRailR1';
import { OrgTreeCanvas } from './components/OrgTreeCanvas';
import { UnitDetailPanel } from './components/UnitDetailPanel';
import { useOrgChartSelection } from './hooks/useOrgChartSelection';
import type { IOrgChartDashboard, IOrgChartMockResponse } from './types/orgChart.types';

/**
 * TAB 2 — Sơ đồ tổ chức (master-detail):
 * - ClusterRail (cụm) + KPI rail R1
 * - OrgTreeCanvas (React Flow, dagre, LR)
 * - UnitDetailPanel (đơn vị + sức khỏe mock)
 */
export default function OrgChartPage(): ReactElement {
  const mockResponse = orgChartMockRaw as IOrgChartMockResponse;
  const orgChart: IOrgChartDashboard = {
    ...mockResponse.data,
    meta: mockResponse.meta,
  };
  const selection = useOrgChartSelection(orgChart);

  return (
    <DashboardShell>
      <WidgetContainer
        title="Cụm & KPI"
        icon={<FolderTree className="h-5 w-5" aria-hidden="true" />}
        subtitle="R1: số đơn vị & cảnh báo"
        position={{ colStart: 1, colSpan: 3, rowStart: 2, rowSpan: 8 }}
      >
        <div className="flex h-full w-full flex-col gap-4 overflow-hidden">
          <KpiRailR1 unitCount={selection.kpis.unitCount} warningCount={selection.kpis.warningCount} />

          <div className="min-h-0 flex-1">
            <ClusterRail
              clusters={selection.clusters}
              selectedClusterId={selection.selectedClusterId}
              onSelectCluster={selection.selectCluster}
              clusterHealthById={selection.clusterHealthById}
            />
          </div>
        </div>
      </WidgetContainer>

      <WidgetContainer
        title="Org Tree (4 cấp)"
        icon={<TreeDeciduous className="h-5 w-5" aria-hidden="true" />}
        subtitle="Cụm → Vai trò → Đơn vị → Đầu mối"
        position={{ colStart: 4, colSpan: 6, rowStart: 2, rowSpan: 8 }}
      >
        <OrgTreeCanvas
          selectedClusterNode={selection.selectedClusterNode}
          selectedUnitId={selection.selectedUnitId}
          onSelectUnit={selection.selectUnit}
        />
      </WidgetContainer>

      <WidgetContainer
        title="Chi tiết đơn vị"
        icon={<Pin className="h-5 w-5" aria-hidden="true" />}
        subtitle="Mock sức khỏe (từ CDE/ERP - giả lập)"
        position={{ colStart: 10, colSpan: 3, rowStart: 2, rowSpan: 8 }}
      >
        <UnitDetailPanel selectedClusterNode={selection.selectedClusterNode} selectedUnit={selection.selectedUnit} />
      </WidgetContainer>
    </DashboardShell>
  );
}
