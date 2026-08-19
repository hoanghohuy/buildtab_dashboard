import { memo } from 'react'
import * as echarts from 'echarts'

import { COLOR_TOKENS } from '@/shared/constants/COLOR_TOKENS'
import { BaseChart } from '@/shared/components/charts/BaseChart'
import { E_CHARTS_THEME_DARK_NAME } from '@/shared/components/charts/echartsDarkTheme'

export interface IWaterfallStep {
  label: string
  /**
   * Giá trị thay đổi cho từng bước.
   * - value > 0: bước tăng (ví dụ: đã giải ngân)
   * - value < 0: bước giảm (ví dụ: còn lại / chưa triển khai)
   */
  value: number
  /**
   * Đánh dấu cột tổng (ví dụ: TMĐT, Giải ngân total).
   * Skeleton dùng để đổi màu nổi bật.
   */
  isTotal?: boolean
}

export interface IWaterfallChartData {
  steps: IWaterfallStep[]
}

export interface IWaterfallChartProps {
  data?: IWaterfallChartData
  height?: number | string
}

const PLACEHOLDER_DATA: IWaterfallChartData = {
  steps: [
    { label: 'TMĐT', value: 24.860, isTotal: true },
    { label: 'Giảm -3.520', value: -3.52 },
    { label: 'HĐ đã ký', value: 21.34, isTotal: true },
    { label: 'Giảm -2.620', value: -2.62 },
    { label: 'Cam kết', value: 18.72 },
    { label: 'Giảm -5.240', value: -5.24 },
    { label: 'Chờ thanh toán', value: -1.52 },
    { label: 'Đã giải ngân', value: 11.96, isTotal: true },
  ],
}

function buildWaterfallChartOption(data: IWaterfallChartData): echarts.EChartsOption {
  const steps = data.steps
  const labels = steps.map((s) => s.label)

  const resolveBarColor = (step: IWaterfallStep): string => {
    if (step.isTotal) return COLOR_TOKENS.accent
    if (step.value >= 0) return COLOR_TOKENS.success
    return COLOR_TOKENS.danger
  }

  return {
    backgroundColor: 'transparent',
    grid: { left: 56, right: 22, top: 22, bottom: 42, containLabel: true },
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.72)' },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: '#64748B' },
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#64748B' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    series: [
      {
        type: 'bar',
        data: steps.map((step) => ({
          value: step.value,
          itemStyle: {
            color: resolveBarColor(step),
            borderRadius: [10, 10, 10, 10],
          },
        })),
        barWidth: '52%',
      },
    ],
  }
}

/**
 * Widget Waterfall.
 * Skeleton: render bar dạng "tăng/giảm" thay vì custom waterfall phức tạp.
 */
export const WaterfallChart = memo(function WaterfallChart({
  data,
  height = 240,
}: IWaterfallChartProps) {
  const chartData = data ?? PLACEHOLDER_DATA
  const option = buildWaterfallChartOption(chartData)

  return <BaseChart option={option} theme={E_CHARTS_THEME_DARK_NAME} height={height} />
})

WaterfallChart.displayName = 'WaterfallChart'

