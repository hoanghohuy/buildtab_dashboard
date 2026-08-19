import { useEffect, useRef } from 'react';

export interface IUseIdleDetectionOptions {
  isKioskMode: boolean;
  /**
   * Callback pause rotation 180s khi có tương tác (click/touch/mousemove/keydown/touchstart).
   */
  onUserInteraction: () => void;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!target) return false;
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable;
}

/**
 * Theo dõi idle của người dùng trong kiosk:
 * - Pause auto-rotate 180s khi có tương tác.
 * - On idle 5s => add CSS class ẩn cursor.
 * - On interaction đầu tiên => requestFullscreen (nếu chưa fullscreen).
 */
export function useIdleDetection(options: IUseIdleDetectionOptions): void {
  const { isKioskMode, onUserInteraction } = options;

  const lastInteractionAtRef = useRef<number>(Date.now());
  const requestedFullscreenRef = useRef<boolean>(false);
  const idleCheckedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isKioskMode) {
      document.documentElement.classList.remove('kiosk-hide-cursor');
      return undefined;
    }

    lastInteractionAtRef.current = Date.now();
    requestedFullscreenRef.current = Boolean(document.fullscreenElement);
    idleCheckedRef.current = false;

    const handleInteraction = (e: Event): void => {
      // Tránh pause khi người dùng đang tương tác với input/textarea (nếu có).
      if (e instanceof KeyboardEvent && isEditableElement(e.target)) return;

      lastInteractionAtRef.current = Date.now();
      document.documentElement.classList.remove('kiosk-hide-cursor');

      if (!requestedFullscreenRef.current && document.fullscreenElement === null) {
        requestedFullscreenRef.current = true;
        void document.documentElement
          .requestFullscreen()
          .catch(() => {
            // Nếu browser từ chối fullscreen, kiosk vẫn chạy bình thường.
          });
      }

      // Phím R là shortcut "resume" => không pause tiếp 180s.
      if (e instanceof KeyboardEvent && (e.key === 'r' || e.key === 'R')) return;

      onUserInteraction();
    };

    const handleMouseMove = (e: MouseEvent): void => {
      handleInteraction(e);
    };

    const handleTouchStart = (e: TouchEvent): void => {
      handleInteraction(e);
    };

    const handleClick = (e: MouseEvent): void => {
      handleInteraction(e);
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      handleInteraction(e);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    const intervalId = window.setInterval(() => {
      if (!isKioskMode) return;
      const idleMs = Date.now() - lastInteractionAtRef.current;
      if (idleMs >= 5000 && !idleCheckedRef.current) {
        idleCheckedRef.current = true;
        document.documentElement.classList.add('kiosk-hide-cursor');
      }
      if (idleMs < 5000) {
        idleCheckedRef.current = false;
      }
    }, 500);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.clearInterval(intervalId);
    };
  }, [isKioskMode, onUserInteraction]);
}

