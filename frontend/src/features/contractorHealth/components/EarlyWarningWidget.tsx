import type { ReactElement } from 'react';

import { formatDate } from '@/shared/utils/formatDate';

import type { IContractorHealthDashboard } from '../types/contractorHealth.types';

export interface IEarlyWarningWidgetProps {
  dashboard: IContractorHealthDashboard;
}

function getSeverityClass(severity: string): string {
  if (severity === 'high') return 'border-[#FB7185]/30 bg-[#FB7185]/15 text-[#FB7185]';
  if (severity === 'medium') return 'border-[#FBBF24]/30 bg-[#FBBF24]/15 text-[#FBBF24]';
  return 'border-white/[0.12] bg-white/[0.04] text-[var(--text-secondary)]';
}

function getSeverityLabel(severity: string): string {
  if (severity === 'high') return 'Cao';
  if (severity === 'medium') return 'Trung bình';
  return 'Khác';
}

function formatDueDate(dueDate?: string): string | null {
  if (!dueDate) return null;
  return formatDate(dueDate);
}

/**
 * EarlyWarning: hiển thị tối đa 4 cảnh báo từ mock.
 */
export function EarlyWarningWidget({ dashboard }: IEarlyWarningWidgetProps): ReactElement {
  const warnings = dashboard.earlyWarnings.slice(0, 4);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0 pb-2">
        <p className="text-caption text-[var(--text-secondary)]">Danh sách cảnh báo sớm (≤ 4)</p>
      </div>

      <ul className="min-h-0 flex-1 space-y-2 overflow-hidden">
        {warnings.map((w) => {
          const due = formatDueDate(w.dueDate);
          return (
            <li
              key={w.warningId}
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={[
                    'inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-caption font-semibold',
                    getSeverityClass(w.severity),
                  ].join(' ')}
                >
                  {getSeverityLabel(w.severity)}
                </span>
                {due && (
                  <span className="shrink-0 text-caption text-[var(--text-tertiary)]">
                    Hạn: {due}
                  </span>
                )}
              </div>

              <div className="mt-2 min-w-0">
                <div className="truncate text-body-md font-semibold text-[var(--text-primary)]">
                  {w.title}
                </div>
                <div className="mt-1 text-caption text-[var(--text-secondary)]">{w.organizationName}</div>
                <div className="mt-2 text-caption text-[var(--text-tertiary)]">
                  {w.reasons.slice(0, 2).join(' • ')}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

EarlyWarningWidget.displayName = 'EarlyWarningWidget';

