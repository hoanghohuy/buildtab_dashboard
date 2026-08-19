import { memo } from 'react'
import * as echarts from 'echarts'

import { COLOR_TOKENS } from '@/shared/constants/COLOR_TOKENS'
import { BaseChart } from '@/shared/components/charts/BaseChart'
import { E_CHARTS_THEME_DARK_NAME } from '@/shared/components/charts/echartsDarkTheme'

export interface IBulletChartItem {
  label: string
  actualRate: number
  targetRate: number
  delayDays?: number
}

export interface IBulletChartData {
  items: IBulletChartItem[]
}

export interface IBulletChartProps {
  data?: IBulletChartData
  height?: number | string
  /** Nhãn trục X (mặc định %) */
  xAxisLabel?: string
}

const PLACEHOLDER_DATA: IBulletChartData = {
  items: [
    { label: 'XL-03 · Cầu vượt sông A', actualRate: 64, targetRate: 92, delayDays: 38 },
    { label: 'XL-06 · Hầm chui', actualRate: 56, targetRate: 80, delayDays: 21 },
    { label: 'XL-02 · Đắp nền', actualRate: 48, targetRate: 75, delayDays: 17 },
    { label: 'XL-10 · Cầu nhánh', actualRate: 38, targetRate: 60, delayDays: 12 },
    { label: 'XL-01 · Nút giao', actualRate: 30, targetRate: 55, delayDays: 9 },
  ],
}

const AXIS_LABEL_STYLE = { color: '#94A3B8', fontSize: 14 }

function getBarColor(rate: number): string {
  if (rate >= 75) return COLOR_TOKENS.danger
  if (rate >= 50) return COLOR_TOKENS.warning
  return COLOR_TOKENS.accent
}

function buildBulletChartOption(data: IBulletChartData): echarts.EChartsOption {
  const items = data.items
  const labels = items.map((i) => i.label)
  const actual = items.map((i) => i.actualRate)
  const targetMarkers = items.map((i, idx) => [i.targetRate, idx] as [number, number])

  return {
    backgroundColor: 'transparent',
    grid: { left: 8, right: 16, top: 8, bottom: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,23,42,0.72)',
      textStyle: { fontSize: 14 },
      formatter: (params) => {
        const list = Array.isArray(params) ? params : [params]
        const idx = list[0]?.dataIndex ?? 0
        const item = items[idx]
        if (!item) return ''
        const delayText = item.delayDays !== undefined ? `${item.delayDays} ngày` : `${item.actualRate}%`
        return `${item.label}<br/>Chậm: ${delayText}`
      },
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { ...AXIS_LABEL_STYLE, show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: labels,
      inverse: true,
      axisLabel: { ...AXIS_LABEL_STYLE, width: 110, overflow: 'truncate' },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        name: 'Actual',
        type: 'bar',
        barWidth: 16,
        data: actual.map((rate, idx) => ({
          value: rate,
          itemStyle: { color: getBarColor(rate), borderRadius: [0, 4, 4, 0] },
          label: {
            show: true,
            position: 'right',
            formatter: () => {
              const days = items[idx]?.delayDays
              return days !== undefined ? `${days}d` : `${Math.round(rate)}%`
            },
            color: '#F1F5F9',
            fontSize: 14,
          },
        })),
        showBackground: true,
        backgroundStyle: { color: 'rgba(148,163,184,0.14)', borderRadius: [0, 4, 4, 0] },
        z: 2,
      },
      {
        name: 'Target',
        type: 'scatter',
        symbol: 'rect',
        symbolSize: [3, 18],
        data: targetMarkers,
        itemStyle: {
          color: '#F1F5F9',
          borderColor: 'rgba(255,255,255,0.55)',
          borderWidth: 1,
        },
        z: 3,
        tooltip: { show: false },
      },
    ],
  }
}

/**
 * Widget Bullet chart ngang (Actual vs Target trên cùng một track).
 */
export const BulletChart = memo(function BulletChart({
  data,
  height = '100%',
}: IBulletChartProps) {
  const chartData = data ?? PLACEHOLDER_DATA
  const option = buildBulletChartOption(chartData)

  return (
    <BaseChart option={option} theme={E_CHARTS_THEME_DARK_NAME} height={height} />
  )
})

BulletChart.displayName = 'BulletChart'
