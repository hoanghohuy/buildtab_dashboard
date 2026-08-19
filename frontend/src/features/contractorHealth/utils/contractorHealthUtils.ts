import * as echarts from 'echarts';

import type { IRadarChartData } from '@/shared/components/charts/RadarChart';
import type { IHeatmapChartData } from '@/shared/components/charts/HeatmapChart';

import { COLOR_TOKENS } from '@/shared/constants/COLOR_TOKENS';

import type {
  IContractorHealth,
  IContractorHealthDashboard,
  IHealthPillars,
} from '../types/contractorHealth.types';

type TScoreBucket = {
  label: string;
  min: number;
  max: number;
};

type TWorkloadBucket = {
  label: string;
  min: number;
  max: number;
};

const HEALTH_INDICATORS: string[] = ['Tiến độ', 'Hồ sơ', 'Chất lượng', 'An toàn', 'Nguồn lực', 'Tài chính'];

const HEALTH_PILLAR_KEYS: (keyof IHealthPillars)[] = ['progress', 'document', 'quality', 'safety', 'resource', 'finance'];

const SCORE_BUCKETS: TScoreBucket[] = [
  { label: '0–59', min: 0, max: 59 },
  { label: '60–69', min: 60, max: 69 },
  { label: '70–79', min: 70, max: 79 },
  { label: '80–100', min: 80, max: 100 },
];

const WORKLOAD_BUCKETS: TWorkloadBucket[] = [
  { label: '≤1k', min: 0, max: 1000 },
  { label: '1–4k', min: 1001, max: 4000 },
  { label: '4–7k', min: 4001, max: 7000 },
  { label: '>7k', min: 7001, max: 2000000 },
];

function getBucketIndex<T extends { min: number; max: number }>(
  value: number,
  buckets: Array<T>,
): number | null {
  for (let i = 0; i < buckets.length; i += 1) {
    if (value >= buckets[i].min && value <= buckets[i].max) return i;
  }

  return null;
}

function toPillarsArray(pillars: IHealthPillars): number[] {
  return HEALTH_PILLAR_KEYS.map((key) => pillars[key]);
}

/**
 * Build data cho `RadarChart` (tối đa 3 series): best / average / worst.
 */
export function buildHealthRadarChartData(contractors: IContractorHealth[]): IRadarChartData {
  const sorted = [...contractors].sort((a, b) => b.totalScore - a.totalScore);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const avgPillars: IHealthPillars = HEALTH_PILLAR_KEYS.reduce((acc, key) => {
    const sum = contractors.reduce((total, c) => total + c.pillars[key], 0);
    acc[key] = sum / Math.max(1, contractors.length);
    return acc;
  }, {} as IHealthPillars);

  return {
    indicators: HEALTH_INDICATORS,
    max: 100,
    series: [
      { name: best?.organizationName ?? 'Best', values: best ? toPillarsArray(best.pillars) : [0, 0, 0, 0, 0, 0] },
      {
        name: 'Trung bình',
        values: toPillarsArray(avgPillars),
      },
      {
        name: worst?.organizationName ?? 'Worst',
        values: worst ? toPillarsArray(worst.pillars) : [0, 0, 0, 0, 0, 0],
      },
    ],
  };
}

/**
 * Build data `HeatmapChart` cho Heatmap tiêu chí × đơn vị.
 */
export function buildCriteriaHeatmapChartData(dashboard: IContractorHealthDashboard): IHeatmapChartData {
  const xLabels = HEALTH_INDICATORS;
  const yLabels = dashboard.contractors.map((c) => c.organizationName);

  const values: number[][] = dashboard.contractors.map((c) => {
    return HEALTH_PILLAR_KEYS.map((key) => c.pillars[key]);
  });

  return {
    xLabels,
    yLabels,
    values,
    min: 0,
    max: 100,
  };
}

/**
 * Build data `HeatmapChart` dùng như "bubble matrix" (x: health score, y: workload).
 *
 * Bubble được xấp xỉ bằng:
 * - trục X: bucket `totalScore`
 * - trục Y: bucket `workloadValue`
 * - màu & label: cường độ ~ `packageCount`
 */
export function buildWorkloadBubbleMatrixHeatmapData(contractors: IContractorHealth[]): IHeatmapChartData {
  const xLabels = SCORE_BUCKETS.map((b) => b.label);
  const yLabels = WORKLOAD_BUCKETS.map((b) => b.label);

  const values: number[][] = Array.from({ length: yLabels.length }, () =>
    Array.from({ length: xLabels.length }, () => 0),
  );

  contractors.forEach((c) => {
    const xIndex = getBucketIndex(c.totalScore, SCORE_BUCKETS);
    const yIndex = getBucketIndex(c.workloadValue, WORKLOAD_BUCKETS);
    if (xIndex === null || yIndex === null) return;

    const bubbleValue = c.packageCount * 25; // 0..100 (vì packageCount trong mock <= 4)
    values[yIndex][xIndex] = Math.min(100, values[yIndex][xIndex] + bubbleValue);
  });

  return {
    xLabels,
    yLabels,
    values,
    min: 0,
    max: 100,
  };
}

function formatTrendDelta(delta: number): { label: string; color: string } {
  if (delta > 0) return { label: `+${delta.toFixed(1)}`, color: COLOR_TOKENS.success };
  if (delta < 0) return { label: `${delta.toFixed(1)}`, color: COLOR_TOKENS.danger };
  return { label: '0,0', color: COLOR_TOKENS.neutral };
}

/**
 * Build option line chart cho trend sức khỏe.
 */
export function buildHealthTrendLineChartOption(params: {
  trendHistory: number[];
  avgScore: number;
}): echarts.EChartsOption {
  const { trendHistory, avgScore } = params;

  const periods = trendHistory.map((_, idx) => `T${idx + 1}`);
  const lastIdx = trendHistory.length - 1;
  const prevIdx = trendHistory.length - 2;
  const last = lastIdx >= 0 ? trendHistory[lastIdx] : avgScore;
  const prev = prevIdx >= 0 ? trendHistory[prevIdx] : avgScore;
  const delta = last - prev;
  const deltaMeta = formatTrendDelta(delta);

  const areaGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: 'rgba(34,211,238,0.28)' },
    { offset: 1, color: 'rgba(34,211,238,0.00)' },
  ]);

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      backgroundColor: 'rgba(15,23,42,0.72)',
    },
    grid: {
      left: 44,
      right: 18,
      top: 30,
      bottom: 36,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: periods,
      boundaryGap: false,
      axisLabel: { color: '#64748B' },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { color: '#64748B' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    series: [
      {
        name: 'Điểm sức khỏe TB',
        type: 'line',
        data: trendHistory,
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: {
          width: 3,
          color: COLOR_TOKENS.accent,
        },
        areaStyle: {
          color: areaGradient,
        },
        markPoint: {
          data: [
            {
              name: 'Hiện tại',
              xAxis: periods[lastIdx] ?? 'T',
              yAxis: last,
              value: last,
              itemStyle: {
                color: deltaMeta.color,
              },
            },
          ],
          symbolSize: 14,
        },
      },
    ],
  };
}

/**
 * Build scorecard: Top 7 tốt nhất / xấu nhất + tổng điểm.
 */
export function buildContractorScorecard(contractors: IContractorHealth[]): {
  totalPoints: number;
  best: IContractorHealth[];
  worst: IContractorHealth[];
} {
  const sortedDesc = [...contractors].sort((a, b) => b.totalScore - a.totalScore);

  const totalPoints = sortedDesc.reduce((sum, c) => sum + c.totalScore, 0);

  const best = sortedDesc.slice(0, 7);
  const worst = sortedDesc.slice(Math.max(0, sortedDesc.length - 7));

  return { totalPoints, best, worst };
}

