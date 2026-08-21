import type { ReactElement, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleDot, Database } from 'lucide-react';

import '@/app/providers/I18nProvider';

import overviewMockRaw from '@/mocks/overview.json';

import { formatDate, formatRelativeTime } from '@/shared/utils/formatDate';
import { DashboardGrid } from '@/shared/components/layout/DashboardGrid';
import { KpiStrip } from '@/shared/components/kpi/KpiStrip';
import { TabNavigation } from '@/shared/components/layout/TabNavigation';
import type { IKpiMetric } from '@/shared/types/common.types';
import type { IGridPosition } from '@/shared/constants/GRID_LAYOUT';
import { GRID_LAYOUT } from '@/shared/constants/GRID_LAYOUT';
import { useAppSelector } from '@/app/hooks';
import { useAutoRotateTab } from '@/features/kiosk/hooks/useAutoRotateTab';
import { useIdleDetection } from '@/features/kiosk/hooks/useIdleDetection';
import { usePerformanceGuard } from '@/features/kiosk/hooks/usePerformanceGuard';

interface IOverviewMockData {
  projectInfo?: { name?: string };
  kpis?: IKpiMetric[];
}

interface IOverviewMockMeta {
  sourceSyncedAt?: string;
  cacheHit?: boolean;
  sources?: string[];
}

interface IOverviewMock {
  data?: IOverviewMockData;
  meta?: IOverviewMockMeta;
}

export interface IDashboardShellProps {
  children: ReactNode;
}

const KPI_STRIP_POSITION: IGridPosition = {
  colStart: 1,
  colSpan: 12,
  rowStart: 1,
  rowSpan: 1,
};

const PIXEL_SHIFT_INTERVAL_MS = 600_000; // 10 phút
const PIXEL_SHIFT_MAX_PX = 2;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDeterministicPixelShiftPx(bucket: number): { x: number; y: number } {
  const seedBase = bucket ^ 0x9e3779b9;
  const randX = mulberry32(seedBase);
  const randY = mulberry32(seedBase ^ 0x85ebca6b);

  const rangeSize = PIXEL_SHIFT_MAX_PX * 2 + 1; // -2..2
  const x = Math.floor(randX() * rangeSize) - PIXEL_SHIFT_MAX_PX;
  const y = Math.floor(randY() * rangeSize) - PIXEL_SHIFT_MAX_PX;

  return { x, y };
}

/**
 * Shell chính cho dashboard: Header 72px + Global KPI strip + DashboardGrid.
 */
export function DashboardShell({ children }: IDashboardShellProps): ReactElement {
  const { t } = useTranslation('common');

  const overviewMock = useMemo((): IOverviewMock => overviewMockRaw as IOverviewMock, []);

  const projectName =
    overviewMock.data?.projectInfo?.name ?? t('projectName', 'Executive Dashboard');

  const kpis = overviewMock.data?.kpis ?? [];

  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const sourceSyncedAt = overviewMock.meta?.sourceSyncedAt;
  const minutesAgo = sourceSyncedAt
    ? Math.max(
        0,
        Math.round((Date.now() - new Date(sourceSyncedAt).getTime()) / 60_000),
      )
    : 0;

  const cacheHit = Boolean(overviewMock.meta?.cacheHit);
  const sourcesLabel = overviewMock.meta?.sources?.[0] ?? 'CDE';

  const isKioskMode = useAppSelector((s) => s.kiosk.isKioskMode);
  const isPerfMode = useAppSelector((s) => s.kiosk.isPerfMode);

  const { progressPercent, pauseFor180Seconds, selectTab } = useAutoRotateTab();

  const rootRef = useRef<HTMLDivElement | null>(null);

  // FPS (K2) -> setPerfMode (Redux), sau đó DashboardShell sẽ gắn class CSS tương ứng.
  usePerformanceGuard();

  useIdleDetection({ isKioskMode, onUserInteraction: pauseFor180Seconds });

  const timeText = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const updateText = sourceSyncedAt
    ? t('updatedAgo', { minutes: minutesAgo })
    : formatRelativeTime(now);

  const statusClasses = cacheHit
    ? 'border-warning/40 bg-warning/15 text-warning'
    : 'border-success/40 bg-success/15 text-success';

  // Perf mode: bật `html.perf-mode` để tắt backdrop-filter (giảm cost render).
  useEffect(() => {
    document.documentElement.classList.toggle('perf-mode', isKioskMode && isPerfMode);
    if (!isKioskMode) {
      document.documentElement.classList.remove('perf-mode');
    }
  }, [isKioskMode, isPerfMode]);

  // Pixel shift chống burn-in (dịch nhẹ từng 10 phút, deterministic theo "bucket thời gian").
  useEffect(() => {
    if (!isKioskMode) {
      if (rootRef.current) {
        rootRef.current.style.setProperty('--pixel-shift-x', '0px');
        rootRef.current.style.setProperty('--pixel-shift-y', '0px');
      }
      return;
    }

    const rootEl = rootRef.current;
    if (!rootEl) return undefined;

    const applyShift = (): void => {
      const bucket = Math.floor(Date.now() / PIXEL_SHIFT_INTERVAL_MS);
      const shift = getDeterministicPixelShiftPx(bucket);
      rootEl.style.setProperty('--pixel-shift-x', `${shift.x}px`);
      rootEl.style.setProperty('--pixel-shift-y', `${shift.y}px`);
    };

    applyShift();
    const intervalId = window.setInterval(applyShift, PIXEL_SHIFT_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isKioskMode]);

  // 4K scale (stub): gắn class để CSS quyết định scaling (mặc định vẫn đảm bảo nhìn rõ).
  useEffect(() => {
    if (!isKioskMode) {
      document.documentElement.classList.remove('kiosk-4k');
      return undefined;
    }

    const update = (): void => {
      const is4k = window.innerWidth >= 3840;
      document.documentElement.classList.toggle('kiosk-4k', is4k);
    };

    update();
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, [isKioskMode]);

  return (
    <div ref={rootRef} className="dashboard-shell kiosk-root flex min-h-dvh w-full flex-col">
      <header
        className="dashboard-header flex h-[72px] w-full items-center justify-between gap-6 border-b border-white/[0.08] bg-[rgba(7,11,20,0.55)] px-4 backdrop-blur-glass sm:px-6"
        style={{ height: GRID_LAYOUT.headerHeight }}
      >
        <div className="min-w-0">
          <div className="text-caption text-[var(--text-secondary)]">{t('appName', 'Executive Dashboard')}</div>
          <div className="truncate text-body-md font-semibold">{projectName}</div>
        </div>

        <div className="flex shrink-0 items-center justify-center">
          <TabNavigation
            progressPercent={progressPercent}
            onUserInteraction={pauseFor180Seconds}
            onSelectTab={selectTab}
          />
        </div>

        <div className="dashboard-header-meta flex flex-col items-end gap-1">
          <div className="text-caption text-[var(--text-secondary)] tabular-nums">
            {timeText}
          </div>
          <div
            className={[
              'inline-flex items-center gap-2 rounded-[10px] border px-3 py-1 text-caption',
              statusClasses,
            ].join(' ')}
            title={`${formatDate(sourceSyncedAt ?? now)} • ${sourcesLabel}`}
          >
            {cacheHit ? (
              <Database className="h-4 w-4" aria-hidden="true" />
            ) : (
              <CircleDot className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{updateText}</span>
          </div>
        </div>
      </header>

      <div className="dashboard-shell-body flex-1">
        <DashboardGrid>
          <KpiStrip position={KPI_STRIP_POSITION} kpis={kpis} />
          {children}
        </DashboardGrid>
      </div>
    </div>
  );
}

