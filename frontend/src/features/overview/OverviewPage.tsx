import type { ReactElement } from 'react';

import { AlertTriangle, CalendarDays, ChartLine, Camera, Hourglass, Map as MapIcon, Trophy } from 'lucide-react';

import { useTranslation } from 'react-i18next';

import { DashboardShell } from '@/shared/components/layout/DashboardShell';
import { WidgetContainer } from '@/shared/components/glass/WidgetContainer';

import { useOverviewData } from '@/features/overview/services/hooks/useOverviewData';

import { DocumentSCurveWidget } from '@/features/overview/components/DocumentSCurveWidget';
import { DelayedPackagesWidget } from '@/features/overview/components/DelayedPackagesWidget';
import { MilestoneRibbonWidget } from '@/features/overview/components/MilestoneRibbonWidget';
import { ProjectMapWidget } from '@/features/overview/components/ProjectMapWidget';
import { SitePhotosWidget } from '@/features/overview/components/SitePhotosWidget';
import { TopRisksWidget } from '@/features/overview/components/TopRisksWidget';
import { UnitRankingWidget } from '@/features/overview/components/UnitRankingWidget';

/**
 * TAB 1 — Tổng quan dự án (không deep map).
 *
 * Lưới 12×9 (R1 = KPI strip trong shell):
 * - W1.1 Map: C1–C6, R2–R6
 * - W1.2 Document S-curve: C7–C12, R2–R4
 * - W1.7 Site photos: C1–C3, R7–R9 (sát dưới map)
 * - W1.3 Delayed packages: C4–C6, R7–R9 (sát dưới map)
 * - W1.4/1.5 Unit ranking: C7–C9, R5–R7
 * - W1.6 Top risks + heatmap: C10–C12, R5–R7
 * - W1.8 Milestone ribbon: C7–C12, R8–R9 (cùng cột ranking + rủi ro)
 */
export default function OverviewPage(): ReactElement {
  const { t } = useTranslation('overview');

  const { data, error, isLoading } = useOverviewData();

  const sCurveSubtitle = `${t('sCurve.planned', 'Kế hoạch')} · ${t('sCurve.actual', 'Thực tế')} · ${t('sCurve.forecast', 'Dự báo')}`;

  return (
    <DashboardShell>
      <WidgetContainer
        title={t('map.title', 'Bản đồ tuyến')}
        icon={<MapIcon className="h-5 w-5" aria-hidden="true" />}
        subtitle={t('map.subtitle', 'Tuyến thi công · SPI')}
        position={{ colStart: 1, colSpan: 6, rowStart: 2, rowSpan: 5 }}
        isLoading={isLoading}
        error={error}
      >
        <ProjectMapWidget />
      </WidgetContainer>

      <WidgetContainer
        title={t('sCurve.title', 'S-Curve tiến độ hồ sơ')}
        icon={<ChartLine className="h-5 w-5" aria-hidden="true" />}
        subtitle={sCurveSubtitle}
        position={{ colStart: 7, colSpan: 6, rowStart: 2, rowSpan: 3 }}
        isLoading={isLoading}
        error={error}
      >
        {data ? <DocumentSCurveWidget data={data} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title={t('topDelay.title', 'Top gói chậm nhất')}
        icon={<Hourglass className="h-5 w-5" aria-hidden="true" />}
        subtitle={t('topDelay.delayDays', 'Chậm (ngày)')}
        position={{ colStart: 4, colSpan: 3, rowStart: 7, rowSpan: 3 }}
        isLoading={isLoading}
        error={error}
      >
        {data ? <DelayedPackagesWidget data={data} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title={t('ranking.title', 'Xếp hạng nhà thầu / tư vấn')}
        icon={<Trophy className="h-5 w-5" aria-hidden="true" />}
        subtitle="TVTK / Nhà thầu"
        position={{ colStart: 7, colSpan: 3, rowStart: 5, rowSpan: 3 }}
        isLoading={isLoading}
        error={error}
      >
        {data ? (
          <UnitRankingWidget designerRanking={data.designerRanking} contractorRanking={data.contractorRanking} />
        ) : null}
      </WidgetContainer>

      <WidgetContainer
        title={t('risk.title', 'Top rủi ro')}
        icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
        subtitle={t('risk.activeRisks', 'Rủi ro đang mở')}
        position={{ colStart: 10, colSpan: 3, rowStart: 5, rowSpan: 3 }}
        isLoading={isLoading}
        error={error}
      >
        {data ? <TopRisksWidget topRisks={data.topRisks} riskMatrix={data.riskMatrix} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title={t('sitePhotos.title', 'Ảnh công trường')}
        icon={<Camera className="h-5 w-5" aria-hidden="true" />}
        subtitle={t('sitePhotos.latest', 'Mới nhất')}
        position={{ colStart: 1, colSpan: 3, rowStart: 7, rowSpan: 3 }}
        isLoading={isLoading}
        error={error}
      >
        {data ? <SitePhotosWidget sitePhotos={data.sitePhotos} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title={t('milestones.title', 'Mốc tiến độ quan trọng')}
        icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
        position={{ colStart: 7, colSpan: 6, rowStart: 8, rowSpan: 2 }}
        isLoading={isLoading}
        error={error}
      >
        {data ? <MilestoneRibbonWidget milestones={data.milestones} /> : null}
      </WidgetContainer>
    </DashboardShell>
  );
}
