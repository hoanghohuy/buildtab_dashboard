import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import viCommon from '@/locales/vi/common.json';
import viOverview from '@/locales/vi/overview.json';
import viOrgChart from '@/locales/vi/orgChart.json';
import viFinance from '@/locales/vi/finance.json';
import viHealth from '@/locales/vi/health.json';

import enCommon from '@/locales/en/common.json';
import enOverview from '@/locales/en/overview.json';
import enOrgChart from '@/locales/en/orgChart.json';
import enFinance from '@/locales/en/finance.json';
import enHealth from '@/locales/en/health.json';

const NAMESPACES = ['common', 'overview', 'orgChart', 'finance', 'health'] as const;

i18n.use(initReactI18next).init({
  lng: 'vi',
  fallbackLng: 'en',
  ns: [...NAMESPACES],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  resources: {
    vi: {
      common: viCommon,
      overview: viOverview,
      orgChart: viOrgChart,
      finance: viFinance,
      health: viHealth,
    },
    en: {
      common: enCommon,
      overview: enOverview,
      orgChart: enOrgChart,
      finance: enFinance,
      health: enHealth,
    },
  },
});

export default i18n;
