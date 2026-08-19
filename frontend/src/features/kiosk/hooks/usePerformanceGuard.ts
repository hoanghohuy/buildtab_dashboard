import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setPerfMode } from '@/features/kiosk/slices/kioskSlice';

const MEASURE_DURATION_MS = 1500;
const LOW_FPS_THRESHOLD = 30;

/**
 * Guard hiệu năng cho kiosk:
 * - Đo FPS trung bình trong ~1.5s bằng `requestAnimationFrame`.
 * - Nếu FPS < 30 => bật `kioskSlice.isPerfMode` để giảm chi phí (tắt backdrop-filter).
 * - Chạy lại khi chuyển tab để phản ánh đúng "độ nặng" từng màn.
 */
export function usePerformanceGuard(): void {
  const dispatch = useAppDispatch();

  const isKioskMode = useAppSelector((s) => s.kiosk.isKioskMode);
  const activeTab = useAppSelector((s) => s.kiosk.activeTab);

  useEffect(() => {
    if (!isKioskMode) {
      dispatch(setPerfMode(false));
      return;
    }

    let rafId = 0;
    let frameCount = 0;
    const startAtMs = performance.now();

    const tick = (nowMs: number): void => {
      frameCount += 1;
      const elapsedMs = nowMs - startAtMs;

      if (elapsedMs >= MEASURE_DURATION_MS) {
        const fps = (frameCount / elapsedMs) * 1000;
        dispatch(setPerfMode(fps < LOW_FPS_THRESHOLD));
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [activeTab, dispatch, isKioskMode]);
}

