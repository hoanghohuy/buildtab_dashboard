import type { ReactElement } from 'react'

import { formatCurrency } from '@/shared/utils/formatCurrency'

import type { IFinanceDashboard } from '../types/finance.types'

export interface IMonthlyDisbursementWidgetProps {
  data: IFinanceDashboard['monthlyDisbursement']
}

function formatMonthShortFromISO(month: string): string {
  const [year, rawMonth] = month.split('-')
  const monthNumber = Number(rawMonth)
  const yy = year.slice(-2)
  const mm = Number.isFinite(monthNumber) ? String(monthNumber).padStart(2, '0') : rawMonth
  return `${mm}/${yy}`
}

function getMaxPlanned(points: IFinanceDashboard['monthlyDisbursement']): number {
  return points.reduce((max, p) => (p.planned > max ? p.planned : max), 0)
}

/**
 * W3.7 — Giải ngân theo tháng (KH vs TT).
 * Widget V0 dùng bar nhóm + line lũy kế; tại V0 wireframe giai đoạn này, hiển thị compact bằng mini-bar:
 * - nền: KH (planned)
 * - overlay: TT (actual)
 */
export function MonthlyDisbursementWidget({ data }: IMonthlyDisbursementWidgetProps): ReactElement {
  const maxPlanned = getMaxPlanned(data)

  return (
    <div className="grid h-full w-full grid-cols-12 items-end gap-2 overflow-hidden">
      {data.map((p) => {
        const plannedPercent = maxPlanned > 0 ? (p.planned / maxPlanned) * 100 : 0
        const actualPercent = maxPlanned > 0 ? (p.actual / maxPlanned) * 100 : 0

        return (
          <div key={p.month} className="flex h-full flex-col items-center overflow-hidden">
            <div className="truncate text-caption text-[var(--text-tertiary)] tabular-nums">
              {formatMonthShortFromISO(p.month)}
            </div>

            <div className="relative mt-1 h-2 w-full overflow-hidden rounded bg-white/[0.06]">
              <div
                className="absolute left-0 top-0 h-full bg-white/[0.14]"
                style={{ width: `${plannedPercent}%` }}
              />
              <div
                className="absolute left-0 top-0 h-full bg-accent/60"
                style={{ width: `${actualPercent}%` }}
              />
            </div>

            <div className="mt-1 truncate text-caption font-mono tabular-nums text-accent">
              {formatCurrency(p.actual)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

