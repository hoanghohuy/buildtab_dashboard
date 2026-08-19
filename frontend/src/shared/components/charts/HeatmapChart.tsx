import { memo } from 'react'
import * as echarts from 'echarts'

import { BaseChart } from '@/shared/components/charts/BaseChart'
import { E_CHARTS_THEME_DARK_NAME } from '@/shared/components/charts/echartsDarkTheme'
import { COLOR_TOKENS } from '@/shared/constants/COLOR_TOKENS'

type THeatmapValue = number[] | null | undefined

export interface IHeatmapChartData {
  xLabels: string[]
  yLabels: string[]
  /**
   * Ma trận giá trị: values[yIndex][xIndex] = score.
   */
  values: number[][]
  min?: number
  max?: number
}

export interface IHeatmapChartProps {
  data?: IHeatmapChartData
  height?: number | string
  /** Bố cục gọn cho widget nhỏ (ma trận rủi ro 5×5) */
  compact?: boolean
}

const PLACEHOLDER_DATA: IHeatmapChartData = {
  xLabels: ['Tiến độ', 'Hồ sơ', 'Chất lượng', 'An toàn'],
  yLabels: ['ĐV A', 'ĐV B', 'ĐV C', 'ĐV D', 'ĐV E'],
  values: [
    [10, 40, 55, 70],
    [20, 45, 60, 85],
    [30, 50, 65, 90],
    [25, 35, 58, 78],
    [15, 42, 52, 74],
  ],
  min: 0,
  max: 100,
}

const AXIS_LABEL_STYLE = { color: '#94A3B8', fontSize: 14 }

function buildHeatmapOption(data: IHeatmapChartData, compact: boolean): echarts.EChartsOption {
  const min = data.min ?? 0
  const max = data.max ?? 100

  const heatmapData = data.yLabels.flatMap((_, yIndex) =>
    data.xLabels.map((__, xIndex) => [xIndex, yIndex, data.values[yIndex]?.[xIndex] ?? min]),
  )

  const grid = compact
    ? { left: 4, right: 4, top: 4, bottom: 28, containLabel: true }
    : { left: 90, right: 20, top: 20, bottom: 50, containLabel: true }

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15,23,42,0.72)',
      textStyle: { fontSize: 14 },
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params
        const callbackParams = p as { value?: THeatmapValue }
        const rawValue = callbackParams.value
        const v = Array.isArray(rawValue) ? rawValue[2] : undefined
        const xIdx = Array.isArray(rawValue) ? rawValue[0] : 0
        const yIdx = Array.isArray(rawValue) ? rawValue[1] : 0
        const xLabel = data.xLabels[xIdx] ?? ''
        const yLabel = data.yLabels[yIdx] ?? ''
        if (typeof v === 'number' && v > 0) {
          return `P${xLabel} × I${yLabel}: ${v} rủi ro`
        }
        return `P${xLabel} × I${yLabel}: —`
      },
    },
    grid,
    xAxis: {
      type: 'category',
      data: data.xLabels,
      axisLabel: { ...AXIS_LABEL_STYLE, fontSize: compact ? 13 : 16 },
      splitArea: { show: false },
    },
    yAxis: {
      type: 'category',
      data: data.yLabels,
      axisLabel: { ...AXIS_LABEL_STYLE, fontSize: compact ? 13 : 16 },
      splitArea: { show: false },
    },
    visualMap: {
      min,
      max: Math.max(max, 1),
      calculable: false,
      show: !compact,
      orient: 'horizontal',
      left: 'center',
      bottom: 10,
      textStyle: { color: '#94A3B8', fontSize: 14 },
      inRange: {
        color: [COLOR_TOKENS.neutral, COLOR_TOKENS.warning, COLOR_TOKENS.danger],
      },
    },
    series: [
      {
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          formatter: (params) => {
            const callbackParams = params as { value?: THeatmapValue }
            const rawValue = callbackParams.value
            const v = Array.isArray(rawValue) ? rawValue[2] : undefined
            return typeof v === 'number' && v > 0 ? String(v) : ''
          },
          color: '#F1F5F9',
          fontSize: compact ? 15 : 16,
          fontWeight: 600,
        },
        itemStyle: {
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(255,255,255,0.65)',
            borderWidth: 1.5,
          },
        },
      },
    ],
  }
}

/**
 * Widget Heatmap (Tiêu chí × Đơn vị hoặc ma trận rủi ro).
 */
export const HeatmapChart = memo(function HeatmapChart({
  data,
  height = '100%',
  compact = false,
}: IHeatmapChartProps) {
  const chartData = data ?? PLACEHOLDER_DATA
  const option = buildHeatmapOption(chartData, compact)

  return <BaseChart option={option} theme={E_CHARTS_THEME_DARK_NAME} height={height} />
})

HeatmapChart.displayName = 'HeatmapChart'
