import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { TDashboardTab } from '@/features/kiosk/slices/kioskSlice';
import { setActiveTab } from '@/features/kiosk/slices/kioskSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

export interface ITabNavigationProps {
  /**
   * Tỷ lệ progress (0-100) cho mảnh progress bar dưới tab bar.
   * Khi kiosk mode tắt sẽ nhận `null`.
   */
  progressPercent?: number | null;
  /**
   * Callback pause 180s khi user tương tác (click/touch).
   */
  onUserInteraction?: () => void;
  /**
   * Handler select tab (kiosk mode dùng để phối hợp setActiveTab + navigate).
   * Nếu không truyền, TabNavigation sẽ tự dispatch + navigate theo route mặc định.
   */
  onSelectTab?: (tabKey: TDashboardTab) => void;
}

const TAB_ITEMS: Array<{
  key: TDashboardTab;
  route: string;
}> = [
  { key: 'overview', route: '/overview' },
  { key: 'orgChart', route: '/org-chart' },
  { key: 'finance', route: '/finance' },
  { key: 'contractorHealth', route: '/contractor-health' },
];

function getTabKeyFromPath(pathname: string): TDashboardTab {
  if (pathname.startsWith('/org-chart')) return 'orgChart';
  if (pathname.startsWith('/finance')) return 'finance';
  if (pathname.startsWith('/contractor-health')) return 'contractorHealth';
  return 'overview';
}

/**
 * Thanh điều hướng 4 tab (Overview / Org Chart / Finance / Contractor Health).
 */
export function TabNavigation({ progressPercent, onUserInteraction, onSelectTab }: ITabNavigationProps): ReactElement {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const activeTabFromKiosk = useAppSelector((s) => s.kiosk.activeTab);

  const activeTabFromRoute = getTabKeyFromPath(window.location.pathname);
  const activeTab = activeTabFromKiosk ?? activeTabFromRoute;

  return (
    <div className="relative">
      <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
        {TAB_ITEMS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                onUserInteraction?.();

                if (onSelectTab) {
                  onSelectTab(tab.key);
                  return;
                }

                dispatch(setActiveTab(tab.key));
                navigate(tab.route);
              }}
              className={[
                'rounded-[10px] px-2.5 py-2 text-caption transition-colors sm:px-4',
                isActive
                  ? 'bg-white/10 text-[var(--text-primary)]'
                  : 'text-[var(--text-tertiary)] hover:bg-white/5',
              ].join(' ')}
            >
              {t(`tabs.${tab.key}`)}
            </button>
          );
        })}
      </nav>

      {typeof progressPercent === 'number' ? (
        <div className="absolute bottom-[-8px] left-0 right-0 h-[2px] overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-200 ease-linear"
            style={{ width: typeof progressPercent === 'number' ? `${progressPercent}%` : '0%' }}
          />
        </div>
      ) : null}
    </div>
  );
}

