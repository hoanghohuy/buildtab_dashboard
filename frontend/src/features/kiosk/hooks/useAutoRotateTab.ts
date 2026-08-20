import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { KIOSK_AUTO_ROTATE } from '@/features/kiosk/constants/KIOSK_CONFIG';
import { pauseRotation, resumeRotation, setActiveTab } from '@/features/kiosk/slices/kioskSlice';
import type { TDashboardTab } from '@/features/kiosk/slices/kioskSlice';

const PAUSE_DURATION_MS = 180_000;
const TICK_MS = 200;

const TAB_SEQUENCE: TDashboardTab[] = ['overview', 'orgChart', 'finance', 'contractorHealth'];

const TAB_ROUTES: Record<TDashboardTab, string> = {
  overview: '/overview',
  orgChart: '/org-chart',
  finance: '/finance',
  contractorHealth: '/contractor-health',
};

function getNextTabKey(activeTab: TDashboardTab): TDashboardTab {
  const idx = TAB_SEQUENCE.indexOf(activeTab);
  if (idx < 0) return TAB_SEQUENCE[0];
  return TAB_SEQUENCE[(idx + 1) % TAB_SEQUENCE.length];
}

export interface IUseAutoRotateTabResult {
  progressPercent: number | null;
  pauseFor180Seconds: () => void;
  selectTab: (tabKey: TDashboardTab) => void;
}

/**
 * Auto-rotate tab theo durations kiosk và tính progress mảnh dưới tab bar.
 *
 * - Chạy khi `kioskSlice.isKioskMode === true` và `KIOSK_AUTO_ROTATE` (env `VITE_KIOSK_AUTO_ROTATE`).
 * - Auto-rotate khi `isRotating === true` và `pausedUntil === null` hoặc `Date.now() > pausedUntil`.
 * - Pause 180s khi user tương tác (do useIdleDetection gọi `pauseFor180Seconds`).
 * - Chuyển tab bằng Redux `setActiveTab` + push router.
 */
export function useAutoRotateTab(): IUseAutoRotateTabResult {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isKioskMode = useAppSelector((s) => s.kiosk.isKioskMode);
  const activeTab = useAppSelector((s) => s.kiosk.activeTab);
  const isRotating = useAppSelector((s) => s.kiosk.isRotating);
  const pausedUntil = useAppSelector((s) => s.kiosk.pausedUntil);
  const rotationDurations = useAppSelector((s) => s.kiosk.rotationDurations);

  const latestRef = useRef({
    isKioskMode,
    activeTab,
    isRotating,
    pausedUntil,
    rotationDurations,
  });
  useEffect(() => {
    latestRef.current = { isKioskMode, activeTab, isRotating, pausedUntil, rotationDurations };
  }, [activeTab, isKioskMode, isRotating, pausedUntil, rotationDurations]);

  const cycleStartAtMsRef = useRef<number>(Date.now());
  const totalPausedMsRef = useRef<number>(0);
  const pauseBeganAtMsRef = useRef<number | null>(null);
  const prevPausedRef = useRef<boolean>(false);

  // Throttle pause dispatch cho mousemove.
  const lastPauseDispatchAtMsRef = useRef<number>(0);

  const [progressPercent, setProgressPercent] = useState<number | null>(null);

  const pauseFor180Seconds = useCallback(() => {
    const now = Date.now();
    if (now - lastPauseDispatchAtMsRef.current < 300) return;
    lastPauseDispatchAtMsRef.current = now;
    dispatch(pauseRotation(now + PAUSE_DURATION_MS));
  }, [dispatch]);

  const selectTab = useCallback(
    (tabKey: TDashboardTab) => {
      dispatch(setActiveTab(tabKey));
      navigate(TAB_ROUTES[tabKey]);
    },
    [dispatch, navigate],
  );

  // Reset cycle timer khi activeTab đổi (cả manual lẫn auto).
  useEffect(() => {
    cycleStartAtMsRef.current = Date.now();
    totalPausedMsRef.current = 0;
    pauseBeganAtMsRef.current = null;
    prevPausedRef.current = false;
    setProgressPercent(null);
  }, [activeTab]);

  // Bật rotation khi kiosk mode bật — không ghi đè khi env tắt auto-rotate (debug).
  useEffect(() => {
    if (!isKioskMode || !KIOSK_AUTO_ROTATE) return;
    if (!isRotating) dispatch(resumeRotation());
  }, [dispatch, isKioskMode, isRotating]);

  const computedSequence = useMemo(() => TAB_SEQUENCE, []);

  useEffect(() => {
    if (!isKioskMode) return undefined;

    const handleKeyDown = (e: KeyboardEvent): void => {
      const key = e.key;
      if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== ' ' && key !== 'f' && key !== 'F' && key !== 'r' && key !== 'R') {
        return;
      }

      // Trong kiosk mode, tránh browser scroll/side-effect.
      e.preventDefault();

      if (key === 'r' || key === 'R') {
        dispatch(resumeRotation());
        return;
      }

      if (key === 'f' || key === 'F') {
        if (document.fullscreenElement) {
          void document.exitFullscreen().catch(() => {});
        } else {
          void document.documentElement.requestFullscreen().catch(() => {});
        }
        return;
      }

      if (key === ' ') {
        // Space => pause 180s (pause dispatch có thể đã chạy từ useIdleDetection, nhưng vẫn đảm bảo).
        pauseFor180Seconds();
        return;
      }

      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        // Arrow keys => chuyển tab manual.
        const currentIdx = computedSequence.indexOf(activeTab);
        const step = key === 'ArrowLeft' ? -1 : 1;
        const nextIdx = (currentIdx + step + computedSequence.length) % computedSequence.length;
        const nextTab = computedSequence[nextIdx] ?? computedSequence[0];
        selectTab(nextTab);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, computedSequence, dispatch, isKioskMode, pauseFor180Seconds, selectTab]);

  useEffect(() => {
    if (!isKioskMode || !KIOSK_AUTO_ROTATE) return undefined;

    const intervalId = window.setInterval(() => {
      const { isRotating: rotatingNow, pausedUntil: pausedUntilNow, activeTab: activeTabNow, rotationDurations: durationsNow } =
        latestRef.current;

      const now = Date.now();

      // Auto-resume khi pausedUntil đã hết.
      if (pausedUntilNow !== null && now > pausedUntilNow && !rotatingNow) {
        dispatch(resumeRotation());
      }

      const isPausedByDuration = pausedUntilNow !== null && now <= pausedUntilNow;

      // Track pause transitions để freeze progress.
      if (isPausedByDuration && !prevPausedRef.current) {
        prevPausedRef.current = true;
        pauseBeganAtMsRef.current = now;
      }

      if (!isPausedByDuration && prevPausedRef.current) {
        prevPausedRef.current = false;
        const pauseBeganAtMs = pauseBeganAtMsRef.current ?? now;
        totalPausedMsRef.current += now - pauseBeganAtMs;
        pauseBeganAtMsRef.current = null;
      }

      const durationSec = durationsNow[activeTabNow] ?? 60;
      const durationMs = durationSec * 1000;

      const cycleStartAtMs = cycleStartAtMsRef.current;
      const totalPausedMs = totalPausedMsRef.current;
      const pausedBeganAtMs = pauseBeganAtMsRef.current;

      const activeElapsedMs = isPausedByDuration && pausedBeganAtMs !== null
        ? pausedBeganAtMs - cycleStartAtMs - totalPausedMs
        : now - cycleStartAtMs - totalPausedMs;

      const safeElapsedMs = Math.max(0, activeElapsedMs);
      const nextProgress = Math.min(100, (safeElapsedMs / durationMs) * 100);

      setProgressPercent((prev) => {
        if (prev === null) return nextProgress;
        if (Math.abs(prev - nextProgress) < 0.5) return prev;
        return nextProgress;
      });

      const canRotate =
        rotatingNow && (pausedUntilNow === null || now > pausedUntilNow) && safeElapsedMs >= durationMs;

      if (canRotate) {
        const nextTab = getNextTabKey(activeTabNow);
        dispatch(setActiveTab(nextTab));
        navigate(TAB_ROUTES[nextTab]);

        // Reset timers ngay lập tức để progress mượt.
        cycleStartAtMsRef.current = now;
        totalPausedMsRef.current = 0;
        pauseBeganAtMsRef.current = null;
        prevPausedRef.current = false;
        setProgressPercent(0);
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [dispatch, isKioskMode, navigate]);

  return {
    progressPercent: isKioskMode && KIOSK_AUTO_ROTATE ? progressPercent : null,
    pauseFor180Seconds,
    selectTab,
  };
}

