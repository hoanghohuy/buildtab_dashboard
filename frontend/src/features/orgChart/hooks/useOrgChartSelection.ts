import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppSelector } from '@/app/hooks';

import type {
  ICluster,
  IOrgChartDashboard,
  IOrgNode,
  IOrgUnitWithContacts,
} from '../types/orgChart.types';

interface IOrgChartSelectionKpis {
  unitCount: number;
  warningCount: number;
}

interface IClusterHealthSnapshot {
  cluster: ICluster;
  worstUnitHealthScore: number;
  warningCount: number;
}

function getUnitHealthScore(unit: IOrgUnitWithContacts): number {
  return typeof unit.healthScore === 'number' ? unit.healthScore : 100;
}

function computeUnitWarning(unit: IOrgUnitWithContacts): boolean {
  // Mock hiện dùng healthBand: good/excellent/watch => watch coi là "cảnh báo"
  return unit.healthBand === 'watch';
}

function getClusterWorstHealthScore(clusterNode: IOrgNode): number {
  const units = clusterNode.roles.flatMap((r) => r.units);
  if (units.length === 0) return 100;
  return Math.min(...units.map(getUnitHealthScore));
}

function getClusterWarningCount(clusterNode: IOrgNode): number {
  const units = clusterNode.roles.flatMap((r) => r.units);
  return units.filter(computeUnitWarning).length;
}

function pickLowestHealthUnit(units: IOrgUnitWithContacts[]): IOrgUnitWithContacts | null {
  if (units.length === 0) return null;
  return [...units].sort((a, b) => getUnitHealthScore(a) - getUnitHealthScore(b))[0] ?? null;
}

function getUnitsInCluster(clusterNode: IOrgNode): IOrgUnitWithContacts[] {
  return clusterNode.roles.flatMap((r) => r.units);
}

function selectKioskCluster(
  clusters: ICluster[],
  clusterNodes: IOrgNode[],
): IClusterHealthSnapshot | null {
  if (clusters.length === 0) return null;

  const clusterNodeById = new Map<string, IOrgNode>();
  for (const node of clusterNodes) clusterNodeById.set(node.cluster.id, node);

  const snapshots: IClusterHealthSnapshot[] = clusters
    .map((cluster) => {
      const node = clusterNodeById.get(cluster.id);
      if (!node) return null;
      return {
        cluster,
        worstUnitHealthScore: getClusterWorstHealthScore(node),
        warningCount: getClusterWarningCount(node),
      };
    })
    .filter((v): v is IClusterHealthSnapshot => v !== null);

  if (snapshots.length === 0) return null;

  const withAlerts = snapshots.filter((s) => s.cluster.hasAlert);
  const candidates = withAlerts.length > 0 ? withAlerts : snapshots;

  return [...candidates].sort((a, b) => {
    if (a.worstUnitHealthScore !== b.worstUnitHealthScore) {
      return a.worstUnitHealthScore - b.worstUnitHealthScore;
    }
    // Tie-break: warningCount càng cao càng ưu tiên (để "cảnh báo" rõ hơn trên kiosk)
    if (a.warningCount !== b.warningCount) return b.warningCount - a.warningCount;
    return a.cluster.id.localeCompare(b.cluster.id);
  })[0] ?? null;
}

/**
 * Gom logic chọn cluster/unit cho Org Chart (bao gồm kiosk auto-pick).
 */
export function useOrgChartSelection(orgChart: IOrgChartDashboard) {
  const isKioskMode = useAppSelector((s) => s.kiosk.isKioskMode);

  const clusterNodesById = useMemo(() => {
    const map = new Map<string, IOrgNode>();
    for (const node of orgChart.orgTree) map.set(node.cluster.id, node);
    return map;
  }, [orgChart.orgTree]);

  const [selectedClusterId, setSelectedClusterId] = useState<string>(() => orgChart.clusters[0]?.id ?? '');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const kioskClusterSnapshot = useMemo(
    () => selectKioskCluster(orgChart.clusters, orgChart.orgTree),
    [orgChart.clusters, orgChart.orgTree],
  );

  useEffect(() => {
    if (!isKioskMode) return;
    if (!kioskClusterSnapshot) return;
    if (!kioskClusterSnapshot.cluster.id) return;
    setSelectedClusterId(kioskClusterSnapshot.cluster.id);
  }, [isKioskMode, kioskClusterSnapshot]);

  const selectedClusterNode = clusterNodesById.get(selectedClusterId) ?? null;

  const clusterUnits = useMemo<IOrgUnitWithContacts[]>(() => {
    if (!selectedClusterNode) return [];
    return getUnitsInCluster(selectedClusterNode);
  }, [selectedClusterNode]);

  const selectedUnit = useMemo<IOrgUnitWithContacts | null>(() => {
    if (!selectedClusterNode) return null;
    if (!selectedUnitId) return null;
    return clusterUnits.find((u) => u.id === selectedUnitId) ?? null;
  }, [clusterUnits, selectedClusterNode, selectedUnitId]);

  const kpis = useMemo<IOrgChartSelectionKpis>(() => {
    if (!selectedClusterNode) return { unitCount: 0, warningCount: 0 };
    return {
      unitCount: getUnitsInCluster(selectedClusterNode).length,
      warningCount: getClusterWarningCount(selectedClusterNode),
    };
  }, [selectedClusterNode]);

  // Khi cluster đổi (hoặc unit chưa hợp lệ), tự chọn unit có sức khỏe thấp nhất.
  useEffect(() => {
    if (!selectedClusterNode) return;
    if (selectedUnitId && clusterUnits.some((u) => u.id === selectedUnitId)) return;

    const worst = pickLowestHealthUnit(clusterUnits);
    setSelectedUnitId(worst?.id ?? null);
  }, [clusterUnits, selectedClusterId, selectedClusterNode, selectedUnitId]);

  const clusterHealthById = useMemo(() => {
    const map = new Map<string, { worstUnitHealthScore: number; warningCount: number }>();
    for (const node of orgChart.orgTree) {
      map.set(node.cluster.id, {
        worstUnitHealthScore: getClusterWorstHealthScore(node),
        warningCount: getClusterWarningCount(node),
      });
    }
    return map;
  }, [orgChart.orgTree]);

  const selectCluster = useCallback(
    (clusterId: string) => {
      setSelectedClusterId(clusterId);
      // Unit sẽ được auto-pick ở useEffect phía dưới
      setSelectedUnitId(null);
    },
    [setSelectedClusterId],
  );

  const selectUnit = useCallback((unitId: string) => {
    setSelectedUnitId(unitId);
  }, []);

  return {
    isKioskMode,
    clusters: orgChart.clusters,
    selectedClusterId,
    selectedClusterNode,
    selectCluster,
    selectedUnitId,
    selectedUnit,
    selectUnit,
    kpis,
    clusterHealthById,
  };
}

