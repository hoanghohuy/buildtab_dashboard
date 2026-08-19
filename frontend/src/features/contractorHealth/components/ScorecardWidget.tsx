import type { ReactElement } from 'react';

import type { IContractorHealthDashboard, THealthBand } from '../types/contractorHealth.types';
import { buildContractorScorecard } from '../utils/contractorHealthUtils';

export interface IScorecardWidgetProps {
  dashboard: IContractorHealthDashboard;
}

function getBandColor(band: THealthBand): string {
  // Tailwind arbitrary class (JIT cần chuỗi literal để build ra CSS).
  if (band === 'excellent' || band === 'good') return 'text-[#34D399]';
  if (band === 'watch') return 'text-[#FBBF24]';
  if (band === 'risk' || band === 'critical') return 'text-[#FB7185]';
  return 'text-[#64748B]';
}

function formatPoints(value: number): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value);
}

/**
 * Scorecard:
 * - Top 7 tốt nhất
 * - Top 7 xấu nhất
 * - Tổng điểm (sum theo totalScore)
 */
export function ScorecardWidget({ dashboard }: IScorecardWidgetProps): ReactElement {
  const { totalPoints, best, worst } = buildContractorScorecard(dashboard.contractors);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-start justify-between gap-3 pb-3">
        <div className="min-w-0">
          <div className="text-caption text-[var(--text-secondary)]">Tổng điểm</div>
          <div className="text-heading-md font-semibold tabular-nums text-[var(--text-primary)]">
            {formatPoints(totalPoints)}
          </div>
        </div>
        <div className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-caption text-[var(--text-secondary)]">
          Top 7 / Worst 7
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-2 gap-4">
          <div className="min-w-0 overflow-hidden">
            <div className="text-caption text-[var(--text-secondary)]">Tốt nhất</div>
            <ul className="mt-2 flex min-h-0 flex-col gap-1 overflow-hidden">
              {best.map((c, idx) => (
                <li
                  key={c.organizationId}
                  className="flex items-center justify-between gap-3 text-body-md text-[var(--text-primary)]"
                >
                  <span className="min-w-0 truncate">
                    {idx + 1}. {c.organizationName}
                  </span>
                  <span className={`tabular-nums ${getBandColor(c.band)}`}>
                    {formatPoints(c.totalScore)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 overflow-hidden">
            <div className="text-caption text-[var(--text-secondary)]">Nguy cơ cao nhất</div>
            <ul className="mt-2 flex min-h-0 flex-col gap-1 overflow-hidden">
              {worst.map((c, idx) => (
                <li
                  key={c.organizationId}
                  className="flex items-center justify-between gap-3 text-body-md text-[var(--text-primary)]"
                >
                  <span className="min-w-0 truncate">
                    {idx + 1}. {c.organizationName}
                  </span>
                  <span className={`tabular-nums ${getBandColor(c.band)}`}>
                    {formatPoints(c.totalScore)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

ScorecardWidget.displayName = 'ScorecardWidget';

