import type { ReactElement } from 'react'

import { formatCurrency } from '@/shared/utils/formatCurrency'
import { formatPercent } from '@/shared/utils/formatPercent'

import type { IFinanceDashboard, IVariationOrder } from '../types/finance.types'

export interface IVariationOrderPanelWidgetProps {
  variationOrders: IFinanceDashboard['variationOrders']
  totalVOValue: IFinanceDashboard['totalVOValue']
  voRatio: IFinanceDashboard['voRatio']
}

type TVOTone = 'warning' | 'info' | 'success'

const VO_STATUS_TONE_CLASS_MAP: Record<IVariationOrder['status'], { bg: string; text: string; border: string; tone: TVOTone }> =
  {
    proposed: { bg: 'bg-warning/15', text: 'text-warning', border: 'border-warning/40', tone: 'warning' },
    reviewing: { bg: 'bg-info/15', text: 'text-info', border: 'border-info/40', tone: 'info' },
    approved: { bg: 'bg-success/15', text: 'text-success', border: 'border-success/40', tone: 'success' },
  }

function statusTone(status: IVariationOrder['status']): { bg: string; text: string; border: string; tone: TVOTone } {
  return VO_STATUS_TONE_CLASS_MAP[status]
}

function sortTopVO(items: IVariationOrder[]): IVariationOrder[] {
  return [...items].sort((a, b) => b.value - a.value)
}

/**
 * W3.5 — Phát sinh & Điều chỉnh (VO).
 * V0: Top 3 VO lớn nhất + KPI voRatio.
 */
export function VariationOrderPanelWidget({
  variationOrders,
  totalVOValue,
  voRatio,
}: IVariationOrderPanelWidgetProps): ReactElement {
  const top = sortTopVO(variationOrders).slice(0, 3)
  const ratioPercent = voRatio * 100

  const ratioTone =
    ratioPercent < 5 ? 'success' : ratioPercent <= 10 ? 'warning' : 'danger'

  const ratioTextClass =
    ratioTone === 'success' ? 'text-success' : ratioTone === 'warning' ? 'text-warning' : 'text-danger'

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className="text-caption text-[var(--text-secondary)]">VO ratio</div>
            <div className={`tabular-nums text-heading-md font-bold ${ratioTextClass}`}>
              {formatPercent(ratioPercent, 1)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-caption text-[var(--text-secondary)]">Tổng VO</div>
            <div className="tabular-nums text-body-lg font-bold text-[var(--text-primary)]">
              {formatCurrency(totalVOValue)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
        {top.map((vo, idx) => {
          const tone = statusTone(vo.status)
          return (
            <div key={vo.id} className="flex flex-nowrap items-center gap-2 overflow-hidden">
              <div className="w-6 shrink-0 text-caption font-mono text-[var(--text-tertiary)]">
                {idx + 1}.
              </div>
              <div className="min-w-0 flex-1 truncate text-caption">
                {vo.title}
              </div>
              <div className="w-28 shrink-0 text-right font-mono text-caption tabular-nums text-[var(--text-tertiary)]">
                +{formatCurrency(vo.value)}
              </div>
              <span
                className={[
                  'inline-flex shrink-0 items-center rounded-full border px-2 py-1 text-caption whitespace-nowrap',
                  tone.bg,
                  tone.text,
                  tone.border,
                ].join(' ')}
              >
                {vo.status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

