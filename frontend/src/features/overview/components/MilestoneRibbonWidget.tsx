import type { ReactElement } from 'react';

import { AlertTriangle, Check, X } from 'lucide-react';

import { formatCountdown, formatDate } from '@/shared/utils/formatDate';

import type { IMilestone } from '@/features/overview/types/overview.types';

export interface IMilestoneRibbonWidgetProps {
  milestones: IMilestone[];
}

function truncateText(value: string, maxLen: number): string {
  if (value.length <= maxLen) return value;
  return `${value.slice(0, maxLen)}…`;
}

type TMilestoneMarker = 'completed' | 'inProgress' | 'future';

interface IMilestoneMarkerView {
  marker: TMilestoneMarker;
  circleClass: string;
  icon: ReactElement | null;
  caption: string | null;
  dateLabel: string;
}

function getMilestoneMarker(m: IMilestone): IMilestoneMarkerView {
  const progress = m.progressPercent ?? 0;
  const dateLabel = m.actualDate ? formatDate(m.actualDate) : formatDate(m.plannedDate);

  if (progress >= 100) {
    if (m.status === 'warning') {
      return {
        marker: 'completed',
        circleClass: 'border-warning/60 bg-warning/15 text-warning',
        icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
        caption: m.delayDays ? `+${m.delayDays}d` : null,
        dateLabel,
      };
    }

    if (m.status === 'danger' || m.status === 'critical') {
      return {
        marker: 'completed',
        circleClass: 'border-danger/60 bg-danger/15 text-danger',
        icon: <X className="h-4 w-4" aria-hidden="true" />,
        caption: m.delayDays ? `+${m.delayDays}d` : null,
        dateLabel,
      };
    }

    return {
      marker: 'completed',
      circleClass: 'border-success/60 bg-success/15 text-success',
      icon: <Check className="h-4 w-4" aria-hidden="true" />,
      caption: null,
      dateLabel,
    };
  }

  if (progress > 0) {
    return {
      marker: 'inProgress',
      circleClass: 'border-accent/60 bg-accent/10 text-accent',
      icon: <span className="text-caption font-semibold tabular-nums">{Math.round(progress)}%</span>,
      caption: null,
      dateLabel,
    };
  }

  return {
    marker: 'future',
    circleClass: 'border-neutral/60 bg-transparent text-[var(--text-tertiary)]',
    icon: null,
    caption: formatCountdown(m.plannedDate),
    dateLabel,
  };
}

/**
 * Widget W1.8 — Dải mốc tiến độ (horizontal milestone ribbon).
 */
export function MilestoneRibbonWidget({ milestones }: IMilestoneRibbonWidgetProps): ReactElement {
  const items = milestones.slice(0, 7);

  return (
    <div className="relative flex h-full min-h-0 w-full items-center overflow-hidden px-1">
      {/* Timeline track */}
      <div className="absolute left-4 right-4 top-[36%] h-0.5 bg-white/[0.18]" aria-hidden="true" />

      <div className="relative z-10 flex w-full items-start justify-between gap-0.5">
        {items.map((m) => {
          const marker = getMilestoneMarker(m);

          return (
            <div key={m.id} className="flex min-w-0 flex-1 flex-col items-center">
              <div className="mb-0.5 h-1.5 w-px bg-white/[0.25]" aria-hidden="true" />

              <div
                className={[
                  'relative flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-[0_0_8px_rgba(0,0,0,0.35)]',
                  marker.circleClass,
                ].join(' ')}
              >
                {marker.icon}
              </div>

              <div className="mt-0.5 min-w-0 text-center">
                <div className="truncate text-[13px] font-medium leading-snug text-[var(--text-primary)]">
                  {truncateText(m.name, 16)}
                </div>
                <div className="truncate text-[12px] font-medium leading-none tabular-nums text-[var(--text-tertiary)]">
                  {marker.dateLabel}
                </div>
                {marker.caption && (
                  <div className="tabular-nums text-[11px] leading-none text-warning">{marker.caption}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
