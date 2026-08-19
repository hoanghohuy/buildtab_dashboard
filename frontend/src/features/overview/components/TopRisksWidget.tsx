import type { ReactElement } from 'react';
import { useMemo } from 'react';

import { HeatmapChart } from '@/shared/components/charts/HeatmapChart';

import type { IRiskItem } from '@/features/overview/types/overview.types';

export interface ITopRisksWidgetProps {
  topRisks: IRiskItem[];
  riskMatrix: number[][];
}

function truncateText(value: string, maxLen: number): string {
  if (value.length <= maxLen) return value;
  return `${value.slice(0, maxLen)}…`;
}

function getRiskDotClass(status: IRiskItem['status']): string {
  if (status === 'good') return 'bg-success';
  if (status === 'normal') return 'bg-accent';
  if (status === 'warning') return 'bg-warning';
  return 'bg-danger';
}

function getScoreBadgeClass(score: number): string {
  if (score >= 16) return 'bg-danger/20 text-danger border-danger/40';
  if (score >= 12) return 'bg-warning/20 text-warning border-warning/40';
  return 'bg-accent/15 text-accent border-accent/35';
}

/**
 * Widget W1.6 — Top rủi ro + mini ma trận rủi ro 5×5.
 */
export function TopRisksWidget({ topRisks, riskMatrix }: ITopRisksWidgetProps): ReactElement {
  const matrixMax = useMemo(() => {
    const flat = riskMatrix.flat();
    return Math.max(...flat, 1);
  }, [riskMatrix]);

  const heatmapData = {
    xLabels: ['1', '2', '3', '4', '5'],
    yLabels: ['5', '4', '3', '2', '1'],
    values: [...riskMatrix].reverse(),
    min: 0,
    max: matrixMax,
  };

  return (
    <div className="flex h-full min-h-0 w-full gap-3 overflow-hidden">
      <div className="flex w-[58%] min-w-0 flex-col justify-between gap-1 overflow-hidden">
        {topRisks.slice(0, 5).map((risk) => (
          <div key={risk.riskId} className="flex min-h-0 items-start gap-2 overflow-hidden py-0.5">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${getRiskDotClass(risk.status)}`} />
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center gap-2 overflow-hidden">
                <span
                  className={[
                    'shrink-0 rounded-md border px-1.5 py-0.5 text-caption font-semibold tabular-nums',
                    getScoreBadgeClass(risk.score),
                  ].join(' ')}
                >
                  {risk.score}
                </span>
                <div className="truncate text-body-md font-medium text-[var(--text-primary)]">
                  {truncateText(risk.title, 22)}
                </div>
              </div>

              <div className="mt-0.5 truncate text-caption text-[var(--text-secondary)] tabular-nums">
                {risk.category} · P{risk.probability}×I{risk.impact} · {truncateText(risk.owner, 16)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-[42%] min-w-0 flex-col overflow-hidden">
        <div className="mb-1 shrink-0 text-center text-caption text-[var(--text-tertiary)]">
          Ma trận P×I
        </div>
        <div className="chart-fill min-h-0 flex-1">
          <HeatmapChart data={heatmapData} height="100%" compact />
        </div>
      </div>
    </div>
  );
}
