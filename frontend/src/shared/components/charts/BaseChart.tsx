import { memo, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import type { CSSProperties } from 'react'

import { E_CHARTS_THEME_DARK_NAME } from '@/shared/components/charts/echartsDarkTheme'

export interface IBaseChartProps {
  /** Option cấu hình cho ECharts */
  option: echarts.EChartsOption
  /**
   * Theme name (đã register bằng `echarts.registerTheme`) hoặc theme object.
   * Ở dashboard này chủ yếu dùng theme dark.
   */
  theme?: string
  /** CSSStyle (thường dùng để set height động theo layout container). */
  style?: CSSProperties
  /** Chiều cao chart (ưu tiên thay vì set style trực tiếp). */
  height?: number | string
}

/**
 * Wrapper bọc `echarts-for-react` theo design tokens (theme dark + glass).
 * Mục tiêu: các widget chart phía trên không phải lặp lại cấu hình ECharts.
 */
export const BaseChart = memo(function BaseChart({
  option,
  theme = E_CHARTS_THEME_DARK_NAME,
  style,
  height,
}: IBaseChartProps) {
  const mergedStyle = useMemo<CSSProperties>(() => {
    const heightValue =
      height === undefined ? '100%' : typeof height === 'number' ? `${height}px` : height
    return {
      width: '100%',
      height: heightValue,
      minHeight: 0,
      ...style,
    }
  }, [height, style])

  return (
    <ReactECharts
      option={option}
      theme={theme}
      notMerge={false}
      lazyUpdate={false}
      style={mergedStyle}
      opts={{ renderer: 'canvas' }}
    />
  )
})

