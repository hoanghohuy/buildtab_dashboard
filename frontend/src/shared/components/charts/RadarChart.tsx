import { memo } from 'react'
import * as echarts from 'echarts'

import { COLOR_TOKENS } from '@/shared/constants/COLOR_TOKENS'
import { BaseChart } from '@/shared/components/charts/BaseChart'
import { E_CHARTS_THEME_DARK_NAME } from '@/shared/components/charts/echartsDarkTheme'

export interface IRadarSeries {
  name: string
  values: number[]
}

export interface IRadarChartData {
  indicators: string[]
  series: IRadarSeries[]
  max?: number
}

export interface IRadarChartProps {
  data?: IRadarChartData
  height?: number | string
}

const PLACEHOLDER_DATA: IRadarChartData = {
  indicators: ['Tiến độ', 'Hồ sơ', 'Chất lượng', 'An toàn', 'Nguồn lực', 'Tài chính'],
  max: 100,
  series: [
    { name: 'Đơn vị tốt nhất', values: [92, 88, 85, 90, 80, 86] },
    { name: 'Trung bình dự án', values: [70, 65, 68, 60, 72, 58] },
    { name: 'Đơn vị cần theo dõi', values: [45, 52, 40, 44, 48, 50] },
  ],
}

function buildRadarChartOption(data: IRadarChartData): echarts.EChartsOption {
  const max = data.max ?? 100

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: 'rgba(15,23,42,0.72)' },
    legend: {
      top: 10,
      textStyle: { color: '#94A3B8' },
    },
    radar: {
      indicator: data.indicators.map((name) => ({ name, max })),
      splitNumber: 5,
      axisName: {
        color: '#64748B',
        fontSize: 14,
      },
    },
    series: data.series.map((s, idx) => ({
      name: s.name,
      type: 'radar',
      data: [
        {
          value: s.values,
          name: s.name,
        },
      ],
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: {
        width: 2,
        color: idx === 0 ? COLOR_TOKENS.success : idx === 1 ? COLOR_TOKENS.neutral : COLOR_TOKENS.danger,
        type: idx === 1 ? 'dashed' : 'solid',
      },
      areaStyle: {
        opacity: idx === 0 ? 0.20 : 0.08,
      },
      itemStyle: {
        color:
          idx === 0 ? COLOR_TOKENS.success : idx === 1 ? COLOR_TOKENS.neutral : COLOR_TOKENS.danger,
      },
    })),
  }
}

/**
 * Widget Radar (≤ 3 series theo design).
 */
export const RadarChart = memo(function RadarChart({
  data,
  height = 260,
}: IRadarChartProps) {
  const chartData = data ?? PLACEHOLDER_DATA
  const option = buildRadarChartOption(chartData)

  return <BaseChart option={option} theme={E_CHARTS_THEME_DARK_NAME} height={height} />
})

RadarChart.displayName = 'RadarChart'

