import type { ReactElement } from 'react';

import { SCurveChart } from '@/shared/components/charts/SCurveChart';

import type { IOverviewDashboard } from '@/features/overview/types/overview.types';

export interface IDocumentSCurveWidgetProps {
  data: IOverviewDashboard;
}

/**
 * Tính chỉ số tháng cuối có dữ liệu thực tế (markLine "Hôm nay").
 */
function findTodayIndex(points: IOverviewDashboard['documentProgress']['points']): number {
  let lastIdx = -1;
  points.forEach((p, i) => {
    if (p.actual !== null) lastIdx = i;
  });
  return lastIdx;
}

/**
 * Khối lượng nộp trong kỳ — lấy delta baseline từ mock (không tự tính KPI tổng).
 */
function computeSubmittedInPeriod(points: IOverviewDashboard['documentProgress']['points']): number[] {
  return points.map((p, i) => {
    if (i === 0) return Math.round(p.baseline);
    const prev = points[i - 1]?.baseline ?? 0;
    return Math.max(0, Math.round(p.baseline - prev));
  });
}

/**
 * Widget W1.2 — S-Curve hồ sơ (SCurve tiến độ hồ sơ).
 */
export function DocumentSCurveWidget({ data }: IDocumentSCurveWidgetProps): ReactElement {
  const points = data.documentProgress.points;

  const chartData = {
    periods: points.map((p) => p.month),
    baselineCumulative: points.map((p) => p.baseline),
    actualCumulative: points.map((p) => p.actual),
    forecastCumulative: points.map((p) => p.forecast),
    submittedInPeriod: computeSubmittedInPeriod(points),
    todayIndex: findTodayIndex(points),
  };

  return (
    <div className="chart-fill flex min-h-0 w-full items-stretch overflow-hidden">
      <SCurveChart data={chartData} height="100%" />
    </div>
  );
}
