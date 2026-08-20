import type { ReactElement, MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useMemo } from "react";

import dagre from "dagre";
import {
  Handle,
  ReactFlow,
  Position,
  SelectionMode,
  type Edge,
  type Node,
  type NodeProps,
} from "@reactflow/core";

import "@reactflow/core/dist/style.css";

import type {
  IOrgRole,
  IOrgNode,
  IOrgUnitWithContacts,
  IContact,
} from "../types/orgChart.types";

type TOrgChartNodeKind = "cluster" | "role" | "unit" | "contact";

type IClusterFlowNodeData = {
  kind: "cluster";
  clusterId: string;
  label: string;
  hasAlert: boolean;
};

type IRoleFlowNodeData = {
  kind: "role";
  role: IOrgRole;
  label: string;
};

type IUnitFlowNodeData = {
  kind: "unit";
  unitId: string;
  label: string;
  healthScore: number;
  healthBand: string;
};

type IContactFlowNodeData = {
  kind: "contact";
  contactId: string;
  unitId: string;
  label: string;
  title: string;
};

type IOrgChartFlowNodeData =
  | IClusterFlowNodeData
  | IRoleFlowNodeData
  | IUnitFlowNodeData
  | IContactFlowNodeData;

export interface IOrgTreeCanvasProps {
  selectedClusterNode: IOrgNode | null;
  selectedUnitId: string | null;
  onSelectUnit: (unitId: string) => void;
}

const NODE_SIZE_BY_KIND: Record<
  TOrgChartNodeKind,
  { width: number; height: number }
> = {
  cluster: { width: 270, height: 78 },
  role: { width: 220, height: 60 },
  unit: { width: 240, height: 66 },
  contact: { width: 220, height: 54 },
};

const ROLE_LABELS_VI: Record<IOrgRole, string> = {
  investor: "Chủ đầu tư",
  supervisor: "Giám sát",
  designer: "Thiết kế",
  reviewer: "Thẩm tra",
  contractor: "Nhà thầu",
  landAcquisition: "Quỹ đất/GPMB",
  other: "Khác",
};

function getHealthTone(score: number): { textClass: string; barClass: string } {
  if (score < 70) return { textClass: "text-danger", barClass: "bg-danger" };
  if (score < 85) return { textClass: "text-warning", barClass: "bg-warning" };
  return { textClass: "text-accent", barClass: "bg-accent" };
}

function getUnitHealth(unit: IOrgUnitWithContacts): {
  score: number;
  band: string;
} {
  const score = typeof unit.healthScore === "number" ? unit.healthScore : 100;
  const band = unit.healthBand ?? "good";
  return { score, band };
}

function getContactLabel(contact: IContact): string {
  // Ưu tiên ngắn gọn cho node; hiển thị full ở detail panel.
  return contact.name.length > 16
    ? `${contact.name.slice(0, 14)}…`
    : contact.name;
}

function createNodesAndEdgesForCluster(
  selectedClusterNode: IOrgNode,
  selectedUnitId: string | null,
) {
  const clusterNodeId = `cluster:${selectedClusterNode.cluster.id}`;

  const nodes: Node<IOrgChartFlowNodeData>[] = [];
  const edges: Edge[] = [];

  nodes.push({
    id: clusterNodeId,
    type: "cluster",
    position: { x: 0, y: 0 },
    data: {
      kind: "cluster",
      clusterId: selectedClusterNode.cluster.id,
      label: selectedClusterNode.cluster.name,
      hasAlert: selectedClusterNode.cluster.hasAlert,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
    selectable: false,
  });

  let edgeIdx = 0;

  for (const roleGroup of selectedClusterNode.roles) {
    const roleKey = `${selectedClusterNode.cluster.id}:${roleGroup.role}`;
    const roleNodeId = `role:${roleKey}`;

    nodes.push({
      id: roleNodeId,
      type: "role",
      position: { x: 0, y: 0 },
      data: {
        kind: "role",
        role: roleGroup.role,
        label: ROLE_LABELS_VI[roleGroup.role],
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      draggable: false,
      selectable: false,
    });

    edges.push({
      id: `e:${clusterNodeId}->${roleNodeId}-${edgeIdx++}`,
      source: clusterNodeId,
      target: roleNodeId,
      sourceHandle: "out",
      targetHandle: "in",
      animated: false,
    });

    for (const unit of roleGroup.units) {
      const unitNodeId = `unit:${unit.id}`;
      const { score, band } = getUnitHealth(unit);
      const isSelected = unit.id === selectedUnitId;

      nodes.push({
        id: unitNodeId,
        type: "unit",
        position: { x: 0, y: 0 },
        selected: isSelected,
        data: {
          kind: "unit",
          unitId: unit.id,
          label: unit.shortName,
          healthScore: score,
          healthBand: band,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
        selectable: true,
      });

      edges.push({
        id: `e:${roleNodeId}->${unitNodeId}-${edgeIdx++}`,
        source: roleNodeId,
        target: unitNodeId,
        sourceHandle: "out",
        targetHandle: "in",
        animated: false,
      });

      for (const contact of unit.contacts) {
        const contactNodeId = `contact:${contact.id}`;
        nodes.push({
          id: contactNodeId,
          type: "contact",
          position: { x: 0, y: 0 },
          selected: unit.id === selectedUnitId,
          data: {
            kind: "contact",
            contactId: contact.id,
            unitId: unit.id,
            label: getContactLabel(contact),
            title: contact.title,
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          draggable: false,
          selectable: true,
        });

        edges.push({
          id: `e:${unitNodeId}->${contactNodeId}-${edgeIdx++}`,
          source: unitNodeId,
          target: contactNodeId,
          sourceHandle: "out",
          targetHandle: "in",
          animated: false,
        });
      }
    }
  }

  return { nodes, edges };
}

function getLayoutedElements(
  nodes: Node<IOrgChartFlowNodeData>[],
  edges: Edge[],
) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR",
    nodesep: 42,
    ranksep: 56,
  });

  for (const node of nodes) {
    const kind = node.type as TOrgChartNodeKind;
    const dims = NODE_SIZE_BY_KIND[kind] ?? NODE_SIZE_BY_KIND.unit;
    g.setNode(node.id, { width: dims.width, height: dims.height });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const nextNodes = nodes.map((node) => {
    const nodeKind = node.type as TOrgChartNodeKind;
    const dims = NODE_SIZE_BY_KIND[nodeKind] ?? NODE_SIZE_BY_KIND.unit;
    const pos = g.node(node.id) as { x: number; y: number };
    const x = pos.x - dims.width / 2;
    const y = pos.y - dims.height / 2;
    return { ...node, position: { x, y } };
  });

  return { nodes: nextNodes, edges };
}

function ClusterNode({ data, selected }: NodeProps<IClusterFlowNodeData>) {
  const borderClass = data.hasAlert
    ? "border-danger/40 bg-danger/10"
    : "border-white/[0.10] bg-white/[0.05]";

  const isSelected = Boolean(selected);

  return (
    <div
      className={[
        "flex h-[78px] w-[270px] flex-col gap-1 rounded-xl border p-3",
        borderClass,
        isSelected ? "ring-2 ring-accent/50" : null,
      ].join(" ")}
    >
      <Handle type="target" position={Position.Left} id="in" />
      <Handle type="source" position={Position.Right} id="out" />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-body-md font-semibold text-[var(--text-primary)]">
            {data.label}
          </div>
        </div>
        {data.hasAlert ? (
          <div
            className="h-2.5 w-2.5 rounded-full bg-danger"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <div className="text-caption text-[var(--text-secondary)] tabular-nums">
        Cấp: Cụm
      </div>
    </div>
  );
}

function RoleNode({ data, selected }: NodeProps<IRoleFlowNodeData>) {
  return (
    <div
      className={[
        "flex h-[60px] w-[220px] flex-col gap-1 rounded-xl border border-white/[0.10] bg-white/[0.04] p-3",
        selected ? "ring-2 ring-accent/40" : null,
      ].join(" ")}
    >
      <Handle type="target" position={Position.Left} id="in" />
      <Handle type="source" position={Position.Right} id="out" />
      <div className="truncate text-body-md font-semibold text-[var(--text-primary)]">
        {data.label}
      </div>
      <div className="text-caption text-[var(--text-secondary)] tabular-nums">
        Cấp: Vai trò
      </div>
    </div>
  );
}

function UnitNode({ data, selected }: NodeProps<IUnitFlowNodeData>) {
  const tone = getHealthTone(data.healthScore);

  return (
    <div
      className={[
        "flex h-[66px] w-[240px] flex-col gap-2 rounded-xl border bg-white/[0.04] p-3",
        selected ? "ring-2 ring-accent/50" : "border-white/[0.10]",
      ].join(" ")}
    >
      <Handle type="target" position={Position.Left} id="in" />
      <Handle type="source" position={Position.Right} id="out" />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-body-md font-semibold text-[var(--text-primary)]">
            {data.label}
          </div>
          <div className={`text-caption tabular-nums ${tone.textClass}`}>
            Health: {data.healthScore} ({data.healthBand})
          </div>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
        <div className={`h-full w-full ${tone.barClass}`} />
      </div>
    </div>
  );
}

function ContactNode({ data }: NodeProps<IContactFlowNodeData>) {
  return (
    <div className="flex min-h-[54px] w-[220px] flex-col gap-1 rounded-xl border border-white/[0.10] bg-white/[0.03] p-3">
      <Handle type="target" position={Position.Left} id="in" />
      <div className="text-body-md truncate font-semibold text-[var(--text-primary)]">
        {data.label}
      </div>
      <div className="text-caption truncate text-[var(--text-secondary)]">
        {data.title}
      </div>
    </div>
  );
}

const nodeTypes = {
  cluster: ClusterNode,
  role: RoleNode,
  unit: UnitNode,
  contact: ContactNode,
};

/**
 * Canvas React Flow hiển thị 4 cấp: cụm → vai trò → đơn vị → đầu mối.
 */
export function OrgTreeCanvas({
  selectedClusterNode,
  selectedUnitId,
  onSelectUnit,
}: IOrgTreeCanvasProps): ReactElement {
  const { nodes, edges } = useMemo(() => {
    if (!selectedClusterNode)
      return {
        nodes: [] as Node<IOrgChartFlowNodeData>[],
        edges: [] as Edge[],
      };
    const { nodes: rawNodes, edges: rawEdges } = createNodesAndEdgesForCluster(
      selectedClusterNode,
      selectedUnitId,
    );
    return getLayoutedElements(rawNodes, rawEdges);
  }, [selectedClusterNode, selectedUnitId]);

  const onNodeClick = useCallback(
    (_event: ReactMouseEvent, node: Node<IOrgChartFlowNodeData>) => {
      if (node.data.kind === "unit") onSelectUnit(node.data.unitId);
      if (node.data.kind === "contact") onSelectUnit(node.data.unitId);
    },
    [onSelectUnit],
  );

  if (!selectedClusterNode) {
    return (
      <div className="flex h-full w-full items-center justify-center text-body-md text-[var(--text-tertiary)]">
        Chưa có cụm được chọn
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <ReactFlow
        key={selectedClusterNode.cluster.id}
        className="h-full w-full"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        zoomOnDoubleClick={false}
        selectionMode={SelectionMode.Full}
      />
    </div>
  );
}
