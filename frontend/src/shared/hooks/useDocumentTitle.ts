import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import '@/app/providers/I18nProvider';

import type { TDashboardTab } from '@/features/kiosk/slices/kioskSlice';

const TITLE_PREFIX = 'Dashboard';

function getTabKeyFromPath(pathname: string): TDashboardTab {
  if (pathname.startsWith('/org-chart')) return 'orgChart';
  if (pathname.startsWith('/finance')) return 'finance';
  if (pathname.startsWith('/contractor-health')) return 'contractorHealth';
  return 'overview';
}

/**
 * Gắn `document.title` theo tab hiện tại: `Dashboard - Tên trang`.
 */
export function useDocumentTitle(): void {
  const { t, i18n } = useTranslation('common');
  const { pathname } = useLocation();

  useEffect(() => {
    const tabKey = getTabKeyFromPath(pathname);
    const pageName = t(`tabs.${tabKey}`);
    document.title = `${TITLE_PREFIX} - ${pageName}`;
  }, [i18n.language, pathname, t]);
}
