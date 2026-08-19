import type { ReactElement } from 'react';

import { GlassCard } from '@/shared/components/glass/GlassCard';

import type { ICluster } from '../types/orgChart.types';

export interface IClusterRailProps {
  clusters: ICluster[];
  selectedClusterId: string;
  onSelectCluster: (clusterId: string) => void;
  clusterHealthById: Map<string, { worstUnitHealthScore: number; warningCount: number }>;
}

function scoreToTone(score: number): { textClass: string; dotClass: string } {
  if (score < 70) return { textClass: 'text-danger', dotClass: 'bg-danger' };
  if (score < 85) return { textClass: 'text-warning', dotClass: 'bg-warning' };
  return { textClass: 'text-accent', dotClass: 'bg-accent' };
}

/**
 * Danh sách cụm dự án (Cluster Rail) dạng master selector.
 */
export function ClusterRail({
  clusters,
  selectedClusterId,
  onSelectCluster,
  clusterHealthById,
}: IClusterRailProps): ReactElement {
  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-hidden">
      {clusters.map((cluster) => {
        const snapshot = clusterHealthById.get(cluster.id);
        const worstHealthScore = snapshot?.worstUnitHealthScore ?? 100;
        const warningCount = snapshot?.warningCount ?? 0;

        const tone = scoreToTone(worstHealthScore);
        const isSelected = cluster.id === selectedClusterId;

        return (
          <button
            key={cluster.id}
            type="button"
            onClick={() => onSelectCluster(cluster.id)}
            className={[
              'relative w-full text-left',
              'rounded-2xl border p-3 transition-colors',
              isSelected ? 'border-white/30 bg-white/10' : 'border-white/[0.08] bg-white/5 hover:bg-white/8',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-body-md font-semibold text-[var(--text-primary)]">
                  {cluster.name}
                </div>
                <div className="mt-1 flex items-center gap-2 text-caption text-[var(--text-secondary)]">
                  <span className="tabular-nums">{cluster.unitCount} đơn vị</span>
                  <span className={`inline-flex items-center gap-1 ${tone.textClass}`}>
                    <span className={`h-2 w-2 rounded-full ${tone.dotClass}`} aria-hidden="true" />
                    <span className="tabular-nums">{worstHealthScore}</span>
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                {cluster.hasAlert ? (
                  <span className="rounded-[10px] bg-danger/20 px-2 py-1 text-caption text-danger">Alert</span>
                ) : (
                  <span className="rounded-[10px] bg-white/5 px-2 py-1 text-caption text-[var(--text-tertiary)]">OK</span>
                )}
                {warningCount > 0 ? (
                  <span className="tabular-nums rounded-[10px] bg-warning/20 px-2 py-1 text-caption text-warning">
                    {warningCount} cảnh báo
                  </span>
                ) : null}
              </div>
            </div>

            {isSelected ? (
              <div className="pointer-events-none absolute -inset-px rounded-2xl border border-accent/40" />
            ) : null}
          </button>
        );
      })}

      <div className="mt-auto">
        <GlassCard className="flex h-full flex-col justify-center p-3">
          <div className="text-caption text-[var(--text-secondary)]">Chọn 1 cụm để xem cây tổ chức 4 cấp</div>
        </GlassCard>
      </div>
    </div>
  );
}

