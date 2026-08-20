import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';

const OverviewPage = lazy(() => import('@/features/overview/OverviewPage'));
const OrgChartPage = lazy(() => import('@/features/orgChart/OrgChartPage'));
const FinancePage = lazy(() => import('@/features/finance/FinancePage'));
const ContractorHealthPage = lazy(() => import('@/features/contractorHealth/ContractorHealthPage'));

/** @description App router — 4 tab chính */
export const AppRouter = () => {
  useDocumentTitle();

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/org-chart" element={<OrgChartPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/contractor-health" element={<ContractorHealthPage />} />
      </Routes>
    </Suspense>
  );
};
