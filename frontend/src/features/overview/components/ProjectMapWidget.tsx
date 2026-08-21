import type { ReactElement } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { LoaderCircle } from 'lucide-react';

import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';

import type { IProjectInfo } from '@/features/overview/types/overview.types';
import type { IApiResponse } from '@/shared/types/api.types';

import {
  getGisSceneConfig,
  isGisSceneConfigured,
} from '@/features/overview/constants/GIS_CONFIG';
import {
  createArcGisSceneView,
  destroyArcGisSceneView,
} from '@/features/overview/services/ArcGisSceneService';

import overviewMockRaw from '@/mocks/overview.json';

import type SceneView from '@arcgis/core/views/SceneView.js';

type TGisLoadState = 'loading' | 'ready' | 'error';

export interface IProjectMapWidgetProps {
  /**
   * Kiosk mode = TV mode. Giữ prop để tương thích; Scene GIS vẫn cho kéo/zoom khi debug.
   */
  isKiosk?: boolean;
}

/**
 * Widget bản đồ tuyến — ArcGIS Web Scene + overlay thông tin dự án.
 * Hiện loading cho đến khi GIS sẵn sàng; không dùng tuyến mock tĩnh.
 */
export function ProjectMapWidget(_props: IProjectMapWidgetProps): ReactElement {
  const { t } = useTranslation('overview');

  const overviewMock = useMemo(
    () => overviewMockRaw as IApiResponse<{ projectInfo: IProjectInfo }>,
    [],
  );
  const projectInfo = overviewMock.data.projectInfo;

  const gisConfig = useMemo(() => getGisSceneConfig(), []);
  const useArcGisScene = isGisSceneConfigured(gisConfig);

  const [loadState, setLoadState] = useState<TGisLoadState>('loading');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const sceneViewRef = useRef<SceneView | null>(null);

  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el || !useArcGisScene) {
      setLoadState(useArcGisScene ? 'loading' : 'error');
      return undefined;
    }

    let isAlive = true;
    setLoadState('loading');

    void createArcGisSceneView(el, gisConfig, { interactive: true })
      .then((view) => {
        if (!isAlive) {
          destroyArcGisSceneView(view);
          return;
        }
        sceneViewRef.current = view;
        setLoadState('ready');
      })
      .catch(() => {
        if (isAlive) setLoadState('error');
      });

    return () => {
      isAlive = false;
      destroyArcGisSceneView(sceneViewRef.current);
      sceneViewRef.current = null;
    };
  }, [gisConfig, useArcGisScene]);

  const overlayStats = useMemo(() => {
    const lengthText = `${projectInfo.length.toFixed(1).replace('.', ',')} km`;
    const lanesText = `${projectInfo.lanes} làn xe`;
    const investmentText = `${formatCurrency(projectInfo.totalInvestment, 'billion')} đ`;
    const startText = formatDate(projectInfo.startDate);
    const endText = formatDate(projectInfo.plannedEndDate);
    const progressText = `${projectInfo.progressPercent.toFixed(1).replace('.', ',')}%`;
    const remainingText = `D−${projectInfo.daysRemaining}`;

    return {
      lengthText,
      lanesText,
      investmentText,
      startText,
      endText,
      progressText,
      remainingText,
      ownerText: projectInfo.owner,
      fundingSourceText: projectInfo.fundingSource,
    };
  }, [projectInfo]);

  const progressPercent = Math.max(0, Math.min(100, projectInfo.progressPercent));

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="relative min-h-[220px] flex-1 overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0" />

        {loadState === 'loading' ? (
          <div
            className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-3 bg-[var(--bg-base)]/80"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="absolute inset-4 animate-pulse rounded-xl bg-white/[0.04]" />
            <LoaderCircle
              className="relative h-8 w-8 animate-spin text-accent"
              aria-hidden="true"
            />
            <p className="relative text-caption text-[var(--text-secondary)]">
              {t('map.loadingGis', 'Đang tải bản đồ GIS…')}
            </p>
          </div>
        ) : null}

        {loadState === 'error' ? (
          <div className="absolute inset-0 z-[5] flex items-center justify-center bg-[var(--bg-base)]/70">
            <p className="px-4 text-center text-caption text-[var(--text-secondary)]">
              {t('map.gisUnavailable', 'Không tải được bản đồ GIS.')}
            </p>
          </div>
        ) : null}
      </div>

      <div className="z-10 w-full shrink-0 border border-white/[0.12] bg-base-elevated p-3 shadow-glass max-[833px]:rounded-none max-[833px]:border-x-0 max-[833px]:border-b-0 min-[834px]:absolute min-[834px]:left-4 min-[834px]:top-4 min-[834px]:w-[30%] min-[834px]:min-w-[260px] min-[834px]:max-w-[360px] min-[834px]:rounded-2xl min-[834px]:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-caption text-[var(--text-secondary)]">
              {t('projectInfo.title', 'Thông tin dự án')}
            </div>
            <div className="truncate text-body-lg font-semibold text-[var(--text-primary)]">
              {projectInfo.name}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-caption">
          <div className="text-[var(--text-secondary)]">
            {t('projectInfo.totalLength', 'Tổng chiều dài')}
          </div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">
            {overlayStats.lengthText}
          </div>

          <div className="text-[var(--text-secondary)]">Quy mô</div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">
            {overlayStats.lanesText}
          </div>

          <div className="text-[var(--text-secondary)]">
            {t('projectInfo.totalBudget', 'Tổng mức đầu tư')}
          </div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">
            {overlayStats.investmentText}
          </div>

          <div className="text-[var(--text-secondary)]">Nguồn vốn</div>
          <div className="col-span-2 truncate justify-self-start text-[var(--text-primary)]">
            {overlayStats.fundingSourceText}
          </div>

          <div className="text-[var(--text-secondary)]">
            {t('projectInfo.startDate', 'Ngày khởi công')}
          </div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">
            {overlayStats.startText}
          </div>

          <div className="text-[var(--text-secondary)]">
            {t('projectInfo.endDate', 'Ngày hoàn thành')}
          </div>
          <div className="justify-self-end tabular-nums text-[var(--text-primary)]">
            {overlayStats.endText}
          </div>

          <div className="text-[var(--text-secondary)]">
            {t('projectInfo.owner', 'Chủ đầu tư')}
          </div>
          <div className="col-span-2 truncate justify-self-start text-[var(--text-primary)]">
            {overlayStats.ownerText}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-caption">
            <span className="text-[var(--text-secondary)]">Tiến độ</span>
            <span className="tabular-nums text-[var(--text-primary)]">
              {overlayStats.progressText} · {overlayStats.remainingText}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.10]">
            <div className="h-full bg-accent" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
