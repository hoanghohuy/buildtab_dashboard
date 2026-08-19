import type { ReactElement } from 'react'

import { formatCurrency } from '@/shared/utils/formatCurrency'
import { formatPercent } from '@/shared/utils/formatPercent'
import type { TStatusLevel } from '@/shared/types/common.types'

import type { IPackagePayment, IFinanceDashboard } from '../types/finance.types'

export interface IPackagePaymentTableWidgetProps {
  data: IFinanceDashboard['packagePayments']
}

const STATUS_TONE_CLASS_MAP: Record<
  TStatusLevel,
  { bgClass: string; textClass: string; borderClass: string }
> = {
  good: { bgClass: 'bg-success/15', textClass: 'text-success', borderClass: 'border-success/40' },
  normal: { bgClass: 'bg-white/[0.06]', textClass: 'text-[var(--text-tertiary)]', borderClass: 'border-white/[0.14]' },
  warning: { bgClass: 'bg-warning/15', textClass: 'text-warning', borderClass: 'border-warning/40' },
  danger: { bgClass: 'bg-danger/15', textClass: 'text-danger', borderClass: 'border-danger/40' },
  critical: {
    bgClass: 'bg-danger/25',
    textClass: 'text-danger',
    borderClass: 'border-danger/60',
  },
}

function statusToTone(status: TStatusLevel): { bgClass: string; textClass: string; borderClass: string } {
  return STATUS_TONE_CLASS_MAP[status]
}

function getAdvanceBadgeTone(contractValue: number, advanceRemaining: number): 'normal' | 'danger' {
  if (contractValue <= 0) return 'normal'
  const ratio = (advanceRemaining / contractValue) * 100
  return ratio > 15 ? 'danger' : 'normal'
}

function truncate(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value
  return `${value.slice(0, maxChars - 1)}...`
}

function sortTopPackages(items: IPackagePayment[]): IPackagePayment[] {
  return [...items].sort((a, b) => b.contractValue - a.contractValue)
}

/**
 * W3.4 — Top 6 gói thầu: bảng giá trị & thanh toán (layout dạng “table-like”, tối giản).
 * Tránh overflow bằng cách giới hạn nội dung mỗi dòng và dùng `truncate`.
 */
export function PackagePaymentTableWidget({
  data,
}: IPackagePaymentTableWidgetProps): ReactElement {
  const top = sortTopPackages(data).slice(0, 6)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 pb-2 text-caption text-[var(--text-secondary)]">
        <div className="w-16 font-mono">Mã</div>
        <div className="min-w-0 flex-1">Gói</div>
        <div className="w-32">Đơn vị</div>
        <div className="w-24 text-right font-mono">HĐ</div>
        <div className="w-28 text-right font-mono">NT/TT</div>
        <div className="w-24 text-right font-mono">Tạm ứng</div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
        {top.map((row) => {
          const tone = statusToTone(row.status)
          const advanceTone = getAdvanceBadgeTone(row.contractValue, row.advanceRemaining)
          return (
            <div
              key={row.packageId}
              className="flex flex-nowrap items-center gap-2 overflow-hidden text-caption"
            >
              <div className="w-16 truncate font-mono tabular-nums">{row.packageCode}</div>
              <div className="min-w-0 flex-1 truncate">{truncate(row.packageName, 26)}</div>
              <div className="w-32 truncate text-[var(--text-tertiary)]">{row.contractorName}</div>
              <div className="w-24 text-right font-mono tabular-nums text-[var(--text-primary)]">
                {formatCurrency(row.contractValue)}
              </div>
              <div className="w-28 text-right font-mono tabular-nums text-[var(--text-tertiary)]">
                {formatPercent(row.certifiedPercent, 0)}/{formatPercent(row.paidPercent, 0)}
              </div>
              <div className="w-24 text-right font-mono tabular-nums">
                <span
                  className={[
                    'inline-flex items-center justify-end rounded-full border px-2 py-0.5',
                    advanceTone === 'danger'
                      ? 'border-danger/40 bg-danger/15 text-danger'
                      : 'border-white/[0.14] bg-white/[0.06] text-[var(--text-tertiary)]',
                  ].join(' ')}
                >
                  {formatCurrency(row.advanceRemaining)}
                </span>
              </div>

              <div className="ml-1 shrink-0">
                <span
                  className={[
                    'inline-flex items-center rounded-full border px-2 py-1',
                    tone.bgClass,
                    tone.textClass,
                    tone.borderClass,
                    'whitespace-nowrap',
                  ].join(' ')}
                >
                  {row.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

