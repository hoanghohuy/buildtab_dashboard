import type { ReactElement } from 'react'

import { WaterfallChart, type IWaterfallChartData } from '@/shared/components/charts/WaterfallChart'
import { formatCurrency } from '@/shared/utils/formatCurrency'

import type { IFinanceDashboard } from '../types/finance.types'

export interface ICashflowWaterfallWidgetProps {
  data: IFinanceDashboard['waterfall']
}

/**
 * W3.1 — Waterfall dòng tiền.
 * Mục tiêu: giúp lãnh đạo hiểu "tiền đi đâu" (TMĐT → các khoản giảm → Giải ngân).
 */
export function CashflowWaterfallWidget({ data }: ICashflowWaterfallWidgetProps): ReactElement {
  const chartData: IWaterfallChartData = {
    steps: data.map((item) => ({
      label: `${item.label} • ${formatCurrency(item.value)}`,
      value: item.value,
      // Waterfall primitive dùng `isTotal` để tô màu cột tổng nổi bật.
      isTotal: item.type === 'total',
    })),
  }

  return (
    <div className="h-full w-full">
      <WaterfallChart data={chartData} height="100%" />
    </div>
  )
}

