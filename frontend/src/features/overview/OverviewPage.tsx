import type { ReactElement } from 'react';

import { AlertTriangle, CalendarDays, ChartLine, Camera, Hourglass, Map as MapIcon, Trophy } from 'lucide-react';

import { useTranslation } from 'react-i18next';

import { DashboardShell } from '@/shared/components/layout/DashboardShell';
import { WidgetContainer } from '@/shared/components/glass/WidgetContainer';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import type { IGridPosition } from '@/shared/constants/GRID_LAYOUT';

import { useOverviewData } from '@/features/overview/services/hooks/useOverviewData';

import { DocumentSCurveWidget } from '@/features/overview/components/DocumentSCurveWidget';
import { DelayedPackagesWidget } from '@/features/overview/components/DelayedPackagesWidget';
import { MilestoneRibbonWidget } from '@/features/overview/components/MilestoneRibbonWidget';
import { ProjectMapWidget } from '@/features/overview/components/ProjectMapWidget';
import { SitePhotosWidget } from '@/features/overview/components/SitePhotosWidget';
import { TopRisksWidget } from '@/features/overview/components/TopRisksWidget';
import { UnitRankingWidget } from '@/features/overview/components/UnitRankingWidget';

/** Dưới iPad Pro 11" (834px) — xếp cặp widget full hàng. */
const BELOW_IPAD_PRO_QUERY = '(max-width: 833px)';

interface IOverviewLayout {
  map: IGridPosition;
  sCurve: IGridPosition;
  delayed: IGridPosition;
  ranking: IGridPosition;
  risk: IGridPosition;
  photos: IGridPosition;
  milestones: IGridPosition;
}

const LAYOUT_DEFAULT: IOverviewLayout = {
  map: { colStart: 1, colSpan: 6, rowStart: 2, rowSpan: 5 },
  sCurve: { colStart: 7, colSpan: 6, rowStart: 2, rowSpan: 3 },
  delayed: { colStart: 4, colSpan: 3, rowStart: 7, rowSpan: 3 },
  ranking: { colStart: 7, colSpan: 3, rowStart: 5, rowSpan: 3 },
  risk: { colStart: 10, colSpan: 3, rowStart: 5, rowSpan: 3 },
  photos: { colStart: 1, colSpan: 3, rowStart: 7, rowSpan: 3 },
  milestones: { colStart: 7, colSpan: 6, rowStart: 8, rowSpan: 2 },
};

const LAYOUT_COMPACT: IOverviewLayout = {
  map: { colStart: 1, colSpan: 6, rowStart: 2, rowSpan: 5 },
  sCurve: { colStart: 7, colSpan: 6, rowStart: 2, rowSpan: 5 },
  photos: { colStart: 1, colSpan: 6, rowStart: 7, rowSpan: 3 },
  delayed: { colStart: 7, colSpan: 6, rowStart: 7, rowSpan: 3 },
  ranking: { colStart: 1, colSpan: 6, rowStart: 10, rowSpan: 3 },
  risk: { colStart: 7, colSpan: 6, rowStart: 10, rowSpan: 3 },
  milestones: { colStart: 1, colSpan: 12, rowStart: 13, rowSpan: 2 },
};

/**
 * TAB 1 — Tổng quan dự án (không deep map).
 *
 * Desktop / iPad Pro: map + s-curve trên, ranking/risk cạnh phải, ảnh/gói dưới map.
 * Tablet nhỏ hơn iPad Pro: ảnh+gói chậm một hàng; xếp hạng+rủi ro hàng tiếp theo.
 */
export default function OverviewPage(): ReactElement {
  const { t } = useTranslation('overview');
  const isCompactTablet = useMediaQuery(BELOW_IPAD_PRO_QUERY);
  const layout = isCompactTablet ? LAYOUT_COMPACT : LAYOUT_DEFAULT;

  const { data, error, isLoading } = useOverviewData();

  const sCurveSubtitle = `${t('sCurve.planned', 'Kế hoạch')} · ${t('sCurve.actual', 'Thực tế')} · ${t('sCurve.forecast', 'Dự báo')}`;

  return (
    <DashboardShell>
      <WidgetContainer
        title={t('map.title', 'Bản đồ tuyến')}
        icon={<MapIcon className="h-5 w-5" aria-hidden="true" />}
        subtitle={t('map.subtitle', 'Tuyến thi công · SPI')}
        position={layout.map}
        widgetId="project-map"
        isLoading={isLoading}
        error={error}
      >
        <ProjectMapWidget />
      </WidgetContainer>

      <WidgetContainer
        title={t('sCurve.title', 'S-Curve tiến độ hồ sơ')}
        icon={<ChartLine className="h-5 w-5" aria-hidden="true" />}
        subtitle={sCurveSubtitle}
        position={layout.sCurve}
        widgetId="document-s-curve"
        isLoading={isLoading}
        error={error}
      >
        {data ? <DocumentSCurveWidget data={data} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title={t('topDelay.title', 'Top gói chậm nhất')}
        icon={<Hourglass className="h-5 w-5" aria-hidden="true" />}
        subtitle={t('topDelay.delayDays', 'Chậm (ngày)')}
        position={layout.delayed}
        isLoading={isLoading}
        error={error}
      >
        {data ? <DelayedPackagesWidget data={data} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title={t('ranking.title', 'Xếp hạng nhà thầu / tư vấn')}
        icon={<Trophy className="h-5 w-5" aria-hidden="true" />}
        subtitle="TVTK / Nhà thầu"
        position={layout.ranking}
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
        position={layout.risk}
        isLoading={isLoading}
        error={error}
      >
        {data ? <TopRisksWidget topRisks={data.topRisks} riskMatrix={data.riskMatrix} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title={t('sitePhotos.title', 'Ảnh công trường')}
        icon={<Camera className="h-5 w-5" aria-hidden="true" />}
        subtitle={t('sitePhotos.latest', 'Mới nhất')}
        position={layout.photos}
        isLoading={isLoading}
        error={error}
      >
        {data ? <SitePhotosWidget sitePhotos={data.sitePhotos} /> : null}
      </WidgetContainer>

      <WidgetContainer
        title={t('milestones.title', 'Mốc tiến độ quan trọng')}
        icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
        position={layout.milestones}
        isLoading={isLoading}
        error={error}
      >
        {data ? <MilestoneRibbonWidget milestones={data.milestones} /> : null}
      </WidgetContainer>
    </DashboardShell>
  );
}
