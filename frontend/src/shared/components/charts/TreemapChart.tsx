import { memo } from 'react'
import * as echarts from 'echarts'

import { COLOR_TOKENS } from '@/shared/constants/COLOR_TOKENS'
import { BaseChart } from '@/shared/components/charts/BaseChart'
import { E_CHARTS_THEME_DARK_NAME } from '@/shared/components/charts/echartsDarkTheme'

export interface ITreemapNode {
  name: string
  value: number
  children?: ITreemapNode[]
}

export interface ITreemapChartData {
  rootName?: string
  nodes: ITreemapNode[]
}

export interface ITreemapChartProps {
  data?: ITreemapChartData
  height?: number | string
}

const PLACEHOLDER_DATA: ITreemapChartData = {
  rootName: 'Cơ cấu chi phí',
  nodes: [
    {
      name: 'Chi phí xây lắp',
      value: 68,
      children: [
        { name: 'Nền móng', value: 28 },
        { name: 'Mặt đường', value: 22 },
        { name: 'Cầu/hầm', value: 18 },
      ],
    },
    {
      name: 'Chi phí GPMB',
      value: 16,
      children: [
        { name: 'Tái định cư', value: 9 },
        { name: 'HTKT', value: 7 },
      ],
    },
    { name: 'Chi phí thiết bị', value: 10 },
    { name: 'Chi phí tư vấn', value: 6 },
  ],
}

function buildTreemapOption(data: ITreemapChartData): echarts.EChartsOption {
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: 'rgba(15,23,42,0.72)' },
    series: [
      {
        type: 'treemap',
        name: data.rootName ?? 'Treemap',
        data: data.nodes,
        breadcrumb: { show: false },
        top: 20,
        left: 10,
        right: 10,
        bottom: 10,
        leafDepth: 2,
        roam: false,
        nodeClick: false,
        label: {
          show: true,
          color: '#F1F5F9',
          formatter: (params) => {
            const name = params.name ?? '—'
            const rawValue = params.value
            const value =
              typeof rawValue === 'number'
                ? rawValue
                : typeof rawValue === 'string'
                  ? Number(rawValue)
                  : 0
            return `${name}\n${value}%`
          },
        },
        itemStyle: {
          borderColor: 'rgba(255,255,255,0.10)',
          gapWidth: 2,
        },
        levels: [
          {
            // Level chính
            itemStyle: {
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.12)',
              color: COLOR_TOKENS.accent,
            },
          },
          {
            // Leaf
            itemStyle: {
              color: 'rgba(34,211,238,0.25)',
            },
            label: {
              fontSize: 14,
            },
          },
        ],
      },
    ],
  }
}

/**
 * Widget Treemap.
 * Skeleton: vẽ treemap đơn giản từ mock nodes.
 */
export const TreemapChart = memo(function TreemapChart({
  data,
  height = 260,
}: ITreemapChartProps) {
  const chartData = data ?? PLACEHOLDER_DATA
  const option = buildTreemapOption(chartData)

  return <BaseChart option={option} theme={E_CHARTS_THEME_DARK_NAME} height={height} />
})

TreemapChart.displayName = 'TreemapChart'

