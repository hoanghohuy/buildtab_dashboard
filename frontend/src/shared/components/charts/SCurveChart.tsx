import { memo } from 'react'
import * as echarts from 'echarts'

import { COLOR_TOKENS } from '@/shared/constants/COLOR_TOKENS'
import { BaseChart } from '@/shared/components/charts/BaseChart'
import { E_CHARTS_THEME_DARK_NAME } from '@/shared/components/charts/echartsDarkTheme'

export interface IScurveChartData {
  periods: string[]
  baselineCumulative: number[]
  actualCumulative: Array<number | null>
  forecastCumulative: Array<number | null>
  submittedInPeriod: number[]
  todayIndex?: number
}

export interface ISCurveChartProps {
  data?: IScurveChartData
  height?: number | string
}

const PLACEHOLDER_DATA: IScurveChartData = {
  periods: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
  baselineCumulative: [12, 18, 25, 33, 41, 48],
  actualCumulative: [10, 16, 22, 30, 37, 44],
  forecastCumulative: [null, null, 28, 36, 44, 52],
  submittedInPeriod: [10, 6, 7, 8, 9, 7],
  todayIndex: 3,
}

const AXIS_LABEL_STYLE = { color: '#94A3B8', fontSize: 14 }
const LEGEND_TEXT_STYLE = { color: '#94A3B8', fontSize: 14 }

/**
 * Tạo option S-Curve (Baseline/Actual/Forecast + Submitted bars).
 */
function buildSCurveOption(data: IScurveChartData): echarts.EChartsOption {
  const periods = data.periods
  const todayIndex = data.todayIndex ?? -1
  const todayPeriod = todayIndex >= 0 && todayIndex < periods.length ? periods[todayIndex] : undefined

  const submittedMax = Math.max(...data.submittedInPeriod, 8)
  const secondaryMax = Math.ceil(submittedMax * 1.3)

  const actualAreaGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: 'rgba(34,211,238,0.35)' },
    { offset: 1, color: 'rgba(34,211,238,0)' },
  ])

  return {
    backgroundColor: 'transparent',
    animation: true,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      backgroundColor: 'rgba(15,23,42,0.72)',
      textStyle: { fontSize: 14 },
    },
    grid: {
      left: 52,
      right: 48,
      top: 36,
      bottom: 40,
      containLabel: true,
    },
    legend: {
      data: ['Baseline', 'Actual', 'Forecast', 'Submitted'],
      textStyle: LEGEND_TEXT_STYLE,
      itemWidth: 18,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: periods,
      boundaryGap: false,
      axisLabel: {
        ...AXIS_LABEL_STYLE,
        formatter: (value: string) => {
          const parts = value.split('-')
          return parts.length >= 2 ? `${parts[1]}/${parts[0].slice(2)}` : value
        },
        interval: Math.max(0, Math.floor(periods.length / 8) - 1),
      },
    },
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: { ...AXIS_LABEL_STYLE, formatter: '{value}%' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      },
      {
        type: 'value',
        min: 0,
        max: secondaryMax,
        axisLabel: { ...AXIS_LABEL_STYLE, show: false },
        splitLine: { show: false },
        position: 'right',
      },
    ],
    series: [
      {
        name: 'Baseline',
        type: 'line',
        data: data.baselineCumulative,
        smooth: false,
        symbol: 'none',
        z: 2,
        lineStyle: {
          width: 2,
          color: COLOR_TOKENS.neutral,
          type: 'dashed',
        },
      },
      {
        name: 'Actual',
        type: 'line',
        data: data.actualCumulative,
        connectNulls: false,
        smooth: true,
        symbolSize: 6,
        z: 4,
        lineStyle: {
          width: 3,
          color: COLOR_TOKENS.accent,
        },
        itemStyle: { color: COLOR_TOKENS.accent },
        areaStyle: {
          color: actualAreaGradient,
        },
        ...(todayPeriod
          ? {
              markLine: {
                symbol: 'none',
                label: {
                  show: true,
                  formatter: 'Hôm nay',
                  color: 'rgba(241,245,249,0.85)',
                  fontSize: 14,
                },
                lineStyle: {
                  color: 'rgba(241,245,249,0.5)',
                  width: 1,
                  type: 'dashed',
                },
                data: [{ xAxis: todayPeriod }],
              },
            }
          : {}),
      },
      {
        name: 'Forecast',
        type: 'line',
        data: data.forecastCumulative,
        connectNulls: true,
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        z: 3,
        lineStyle: {
          width: 2,
          color: COLOR_TOKENS.info,
          type: 'dashed',
        },
        itemStyle: { color: COLOR_TOKENS.info },
      },
      {
        name: 'Submitted',
        type: 'bar',
        data: data.submittedInPeriod,
        yAxisIndex: 1,
        z: 1,
        itemStyle: {
          color: 'rgba(34,211,238,0.30)',
          borderRadius: [2, 2, 0, 0],
        },
        barWidth: '35%',
      },
    ],
  }
}

/**
 * Widget S-Curve (Baseline / Actual / Forecast + Submitted).
 */
export const SCurveChart = memo(function SCurveChart({
  data,
  height = '100%',
}: ISCurveChartProps) {
  const chartData = data ?? PLACEHOLDER_DATA
  const option = buildSCurveOption(chartData)

  return <BaseChart option={option} theme={E_CHARTS_THEME_DARK_NAME} height={height} />
})

SCurveChart.displayName = 'SCurveChart'
