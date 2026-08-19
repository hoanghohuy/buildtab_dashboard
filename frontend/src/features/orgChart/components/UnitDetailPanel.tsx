import type { ReactElement } from 'react';

import { GlassCard } from '@/shared/components/glass/GlassCard';

import type { IOrgNode, IOrgRole, IOrgUnitWithContacts } from '../types/orgChart.types';

export interface IUnitDetailPanelProps {
  selectedClusterNode: IOrgNode | null;
  selectedUnit: IOrgUnitWithContacts | null;
}

const ROLE_LABELS_VI: Record<IOrgRole, string> = {
  investor: 'Chủ đầu tư',
  supervisor: 'Giám sát',
  designer: 'Thiết kế',
  reviewer: 'Thẩm tra',
  contractor: 'Nhà thầu',
  landAcquisition: 'Quỹ đất/GPMB',
  other: 'Khác',
};

function getHealthTone(score: number): { textClass: string; bgClass: string } {
  if (score < 70) return { textClass: 'text-danger', bgClass: 'bg-danger/15' };
  if (score < 85) return { textClass: 'text-warning', bgClass: 'bg-warning/15' };
  return { textClass: 'text-accent', bgClass: 'bg-accent/15' };
}

/**
 * Panel hiển thị unit info + sức khỏe (mock).
 */
export function UnitDetailPanel({
  selectedClusterNode,
  selectedUnit,
}: IUnitDetailPanelProps): ReactElement {
  if (!selectedClusterNode || !selectedUnit) {
    return (
      <div className="flex h-full w-full items-center justify-center text-body-md text-[var(--text-tertiary)]">
        Chọn một unit để xem chi tiết
      </div>
    );
  }

  const healthScore = typeof selectedUnit.healthScore === 'number' ? selectedUnit.healthScore : 100;
  const healthBand = selectedUnit.healthBand ?? 'good';
  const tone = getHealthTone(healthScore);

  const roleLabel = ROLE_LABELS_VI[selectedUnit.role];
  const contacts = selectedUnit.contacts;
  const topContacts = contacts.slice(0, 2);

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden">
      <GlassCard className="flex h-full w-full flex-col gap-3 p-4">
        <div className="min-w-0">
          <div className="text-caption text-[var(--text-secondary)]">Cụm</div>
          <div className="truncate text-body-md font-semibold text-[var(--text-primary)]">
            {selectedClusterNode.cluster.name}
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-caption text-[var(--text-secondary)]">Vai trò</div>
          <div className="truncate text-body-md font-semibold text-[var(--text-primary)]">{roleLabel}</div>
        </div>

        <div className="min-w-0">
          <div className="text-caption text-[var(--text-secondary)]">Đơn vị</div>
          <div className="truncate text-body-lg font-semibold text-[var(--text-primary)]">
            {selectedUnit.name}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className={`rounded-full px-2 py-1 text-caption ${tone.bgClass} ${tone.textClass}`}>
              Health {healthScore} • {healthBand}
            </span>
          </div>
        </div>

        <div className="mt-1">
          <div className="text-caption text-[var(--text-secondary)]">Mock sức khỏe</div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <div className={`h-full w-full rounded-full ${tone.bgClass}`} />
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-caption text-[var(--text-secondary)]">Đầu mối liên hệ</div>
          <div className="mt-2 flex flex-col gap-2">
            {topContacts.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-white/[0.10] bg-white/[0.03] p-3"
              >
                <div className="truncate text-body-md font-semibold text-[var(--text-primary)]">{c.name}</div>
                <div className="truncate text-caption text-[var(--text-secondary)]">{c.title}</div>
                <div className="mt-1 text-caption text-[var(--text-tertiary)] truncate">
                  {c.phone}
                </div>
              </div>
            ))}
          </div>
        </div>

        {contacts.length > 2 ? (
          <div className="text-caption text-[var(--text-tertiary)] tabular-nums">
            +{contacts.length - 2} liên hệ khác
          </div>
        ) : null}
      </GlassCard>
    </div>
  );
}

