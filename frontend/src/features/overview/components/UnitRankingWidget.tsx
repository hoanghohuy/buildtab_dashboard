import type { ReactElement } from 'react';

import { useMemo, useState } from 'react';

import { COLOR_TOKENS } from '@/shared/constants/COLOR_TOKENS';

import type { IUnitRanking } from '@/features/overview/types/overview.types';

export interface IUnitRankingWidgetProps {
  designerRanking: IUnitRanking[];
  contractorRanking: IUnitRanking[];
}

type TRankingSegment = 'designer' | 'contractor';

interface IRingProps {
  value: number;
  color: string;
}

function ProgressRing({ value, color }: IRingProps): ReactElement {
  const size = 32;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const clamped = Math.max(0, Math.min(100, value));
  const filled = (clamped / 100) * circumference;
  const dashOffset = circumference - filled;

  return (
    <div className="relative flex h-[32px] w-[32px] shrink-0 items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="relative text-[13px] font-semibold tabular-nums leading-none">{Math.round(clamped)}</span>
    </div>
  );
}

function getRingColor(submissionRate: number): string {
  if (submissionRate >= 90) return COLOR_TOKENS.success;
  if (submissionRate >= 80) return COLOR_TOKENS.accent;
  if (submissionRate >= 70) return COLOR_TOKENS.warning;
  return COLOR_TOKENS.danger;
}

function TrendText({ trend }: { trend: number }): ReactElement {
  if (trend === 0) {
    return <span className="text-caption text-[var(--text-tertiary)]">—</span>;
  }

  const isUp = trend > 0;
  const arrow = isUp ? '▲' : '▼';
  const textClass = isUp ? 'text-success' : 'text-danger';

  return (
    <span className={`text-caption tabular-nums ${textClass}`}>
      {arrow} {Math.abs(trend)}
    </span>
  );
}

function truncateName(name: string, maxLen: number): string {
  if (name.length <= maxLen) return name;
  return `${name.slice(0, maxLen)}…`;
}

/**
 * Widget W1.4 / W1.5 — Xếp hạng đơn vị (TVTK / Nhà thầu) + progress ring.
 */
export function UnitRankingWidget({
  designerRanking,
  contractorRanking,
}: IUnitRankingWidgetProps): ReactElement {
  const [segment, setSegment] = useState<TRankingSegment>('designer');

  const items = useMemo<IUnitRanking[]>(() => {
    const source = segment === 'designer' ? designerRanking : contractorRanking;
    return source.slice(0, 5);
  }, [contractorRanking, designerRanking, segment]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="flex shrink-0 gap-2 pb-2">
        <button
          type="button"
          className={[
            'flex-1 rounded-lg border px-2 py-1.5 text-caption transition-colors',
            segment === 'designer' ? 'border-white/30 bg-white/[0.10]' : 'border-white/15 bg-white/[0.03]',
          ].join(' ')}
          onClick={() => setSegment('designer')}
          aria-pressed={segment === 'designer'}
        >
          TVTK
        </button>
        <button
          type="button"
          className={[
            'flex-1 rounded-lg border px-2 py-1.5 text-caption transition-colors',
            segment === 'contractor' ? 'border-white/30 bg-white/[0.10]' : 'border-white/15 bg-white/[0.03]',
          ].join(' ')}
          onClick={() => setSegment('contractor')}
          aria-pressed={segment === 'contractor'}
        >
          Nhà thầu
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-0 overflow-hidden">
        {items.map((item) => {
          const ringColor = getRingColor(item.submissionRate);
          return (
            <div key={item.organizationId} className="flex min-h-0 items-center gap-1.5 overflow-hidden">
              <div
                className={[
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[13px] font-semibold tabular-nums leading-none',
                  item.rank === 1
                    ? 'bg-warning/15 border-warning/55 text-warning'
                    : item.rank === 2
                      ? 'bg-[#94A3B8]/15 border-[#94A3B8]/55 text-[#94A3B8]'
                      : item.rank === 3
                        ? 'bg-[#D97706]/15 border-[#D97706]/55 text-[#D97706]'
                        : 'bg-white/[0.06] border-white/[0.18] text-[var(--text-secondary)]',
                ].join(' ')}
              >
                {item.rank}
              </div>

              <ProgressRing value={item.submissionRate} color={ringColor} />

              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex min-w-0 items-center justify-between gap-1">
                  <div className="min-w-0 truncate text-caption font-medium leading-none">
                    {truncateName(item.organizationName, 18)}
                  </div>
                  <TrendText trend={item.trend} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
