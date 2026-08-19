import type { ReactElement } from 'react'

import { TreemapChart, type ITreemapChartData } from '@/shared/components/charts/TreemapChart'
import { formatCurrency } from '@/shared/utils/formatCurrency'

import type { IFinanceDashboard } from '../types/finance.types'

export interface ICostBreakdownTreemapWidgetProps {
  data: IFinanceDashboard['costBreakdown']
}

/**
 * W3.3 — Cơ cấu chi phí (Treemap).
 * Giai đoạn V0: treemap cho thấy tỷ trọng (%), kèm giá trị tỷ đồng trong nhãn.
 */
export function CostBreakdownTreemapWidget({ data }: ICostBreakdownTreemapWidgetProps): ReactElement {
  const chartData: ITreemapChartData = {
    rootName: 'Cơ cấu chi phí',
    nodes: data.map((item) => ({
      name: `${item.category}\n${formatCurrency(item.value)}`,
      value: item.percentage,
    })),
  }

  return (
    <div className="h-full w-full">
      <TreemapChart data={chartData} height="100%" />
    </div>
  )
}

