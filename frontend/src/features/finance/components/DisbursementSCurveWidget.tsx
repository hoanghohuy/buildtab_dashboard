import type { ReactElement } from 'react'

import { SCurveChart, type IScurveChartData } from '@/shared/components/charts/SCurveChart'

import type { IDisbursementPoint, IFinanceDashboard } from '../types/finance.types'

export interface IDisbursementSCurveWidgetProps {
  data: IFinanceDashboard['disbursementCurve']
}

function formatMonthShort(month: string): string {
  const [year, rawMonth] = month.split('-')
  const monthNumber = Number(rawMonth)
  const yy = year.slice(-2)
  const mm = Number.isFinite(monthNumber) ? String(monthNumber).padStart(2, '0') : rawMonth
  return `${mm}/${yy}`
}

function computeLastActualIndex(points: IDisbursementPoint[]): number {
  for (let i = points.length - 1; i >= 0; i -= 1) {
    if (points[i].actual > 0) return i
  }
  return 0
}

/**
 * W3.2 — S-Curve giải ngân (KH năm vs Thực tế vs Dự báo).
 * Dữ liệu V0 chỉ có planned/actual + % lũy kế, nên phần "Dự báo" được nội suy bằng planned lũy kế cho các kỳ tương lai.
 */
export function DisbursementSCurveWidget({
  data,
}: IDisbursementSCurveWidgetProps): ReactElement {
  const lastActualIndex = computeLastActualIndex(data)

  const periods = data.map((p) => formatMonthShort(p.month))
  const baselineCumulative = data.map((p) => p.cumulativePlannedPercent)
  const actualCumulative = data.map((p, idx) =>
    idx <= lastActualIndex ? p.cumulativeActualPercent : null,
  )
  const forecastCumulative = data.map((p, idx) =>
    idx > lastActualIndex ? p.cumulativePlannedPercent : null,
  )
  const submittedInPeriod = data.map((p) => p.actual)

  const chartData: IScurveChartData = {
    periods,
    baselineCumulative,
    actualCumulative,
    forecastCumulative,
    submittedInPeriod,
    todayIndex: lastActualIndex,
  }

  return (
    <div className="h-full w-full">
      <SCurveChart data={chartData} height="100%" />
    </div>
  )
}

