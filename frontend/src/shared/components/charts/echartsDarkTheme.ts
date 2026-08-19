import * as echarts from 'echarts'
import { COLOR_TOKENS } from '@/shared/constants/COLOR_TOKENS'

/**
 * Theme name để ECharts có thể được truyền qua prop `theme` của `echarts-for-react`.
 */
export const E_CHARTS_THEME_DARK_NAME = 'dashboard-dark'

const TEXT_PRIMARY = '#F1F5F9'
const TEXT_SECONDARY = '#94A3B8'
const TEXT_TERTIARY = COLOR_TOKENS.neutral

/**
 * Palette categorical theo thứ tự trong §10.2 (Design Tokens).
 * 1. #22D3EE  Cyan
 * 2. #A78BFA  Violet
 * 3. #34D399  Emerald
 * 4. #FBBF24  Amber
 * 5. #FB7185  Rose
 * 6. #60A5FA  Blue
 * 7. #2DD4BF  Teal
 * 8. #FCD34D  Yellow
 * 9. #94A3B8  Slate
 */
const DATA_CATEGORICAL_PALETTE: string[] = [
  COLOR_TOKENS.accent, // 1
  COLOR_TOKENS.info, // 2
  COLOR_TOKENS.success, // 3
  COLOR_TOKENS.warning, // 4
  COLOR_TOKENS.danger, // 5
  '#60A5FA', // 6
  '#2DD4BF', // 7
  '#FCD34D', // 8
  TEXT_SECONDARY, // 9
]

const BORDER_COLOR = 'rgba(255,255,255,0.10)'
const SPLIT_LINE_COLOR = 'rgba(255,255,255,0.08)'

const DASHBOARD_DARK_THEME = {
  color: DATA_CATEGORICAL_PALETTE,
  backgroundColor: 'transparent',

  textStyle: {
    color: TEXT_PRIMARY,
  },

  legend: {
    textStyle: {
      color: TEXT_SECONDARY,
    },
  },

  tooltip: {
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    textStyle: {
      color: TEXT_PRIMARY,
    },
  },

  xAxis: {
    axisLabel: {
      color: TEXT_TERTIARY,
    },
    axisLine: {
      lineStyle: {
        color: BORDER_COLOR,
      },
    },
    axisTick: {
      lineStyle: {
        color: BORDER_COLOR,
      },
    },
    splitLine: {
      lineStyle: {
        color: SPLIT_LINE_COLOR,
      },
    },
  },

  yAxis: {
    axisLabel: {
      color: TEXT_TERTIARY,
    },
    axisLine: {
      lineStyle: {
        color: BORDER_COLOR,
      },
    },
    axisTick: {
      lineStyle: {
        color: BORDER_COLOR,
      },
    },
    splitLine: {
      lineStyle: {
        color: SPLIT_LINE_COLOR,
      },
    },
  },

  radar: {
    name: {
      color: TEXT_TERTIARY,
    },
    splitLine: {
      lineStyle: {
        color: SPLIT_LINE_COLOR,
      },
    },
    axisLine: {
      lineStyle: {
        color: BORDER_COLOR,
      },
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.02)'],
      },
    },
  },

  series: {
    itemStyle: {
      borderColor: 'rgba(255,255,255,0.06)',
    },
  },
}

echarts.registerTheme(E_CHARTS_THEME_DARK_NAME, DASHBOARD_DARK_THEME)

