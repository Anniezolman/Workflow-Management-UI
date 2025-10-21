/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, Edge, EdgeChange, Node, NodeChange, OnSelectionChangeFunc } from 'reactflow'

export type NodeType = 'start' | 'action' | 'decision' | 'terminal'

export interface BaseNodeData {
    label: string
    description: string
    collapsed?: boolean
    onUpdate?: (nodeId: string, newData: WorkflowNodeData) => void
}

export interface StartNodeData extends BaseNodeData {
    trigger: 'webhook' | 'schedule' | 'manual' | 'event'
}

export interface ActionNodeData extends BaseNodeData {
    actionType: 'enrichment' | 'person' | 'ai' | 'api' | 'transform'
    endpoint?: string
}

export interface DecisionNodeData extends BaseNodeData {
    condition: string
    trueLabel: string
    falseLabel: string
}

export interface TerminalNodeData extends BaseNodeData {
    output: 'email' | 'slack' | 'crm' | 'webhook'
}

export type WorkflowNodeData = StartNodeData | ActionNodeData | DecisionNodeData | TerminalNodeData

export interface WorkflowNode extends Node<WorkflowNodeData> {
    type: NodeType
}

export interface WorkflowEdge {
    id: string
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null
    animated?: boolean
    label?: string
    labelStyle?: React.CSSProperties
    labelBgStyle?: React.CSSProperties
    markerEnd?: any
    style?: React.CSSProperties
    data?: {
        onDelete?: (edgeId: string) => void
    }
}

// ReactFlow specific types
export type ReactFlowNode = Node<WorkflowNodeData>
export type ReactFlowEdge = Edge<any>
export type NodeChanges = NodeChange[]
export type EdgeChanges = EdgeChange[]
export type WorkflowConnection = Connection

// Type guards for better type safety
export const isWorkflowNode = (node: Node): node is WorkflowNode => {
    return node.type === 'start' || node.type === 'action' || node.type === 'decision' || node.type === 'terminal'
}

export const isWorkflowEdge = (edge: any): edge is WorkflowEdge => {
    return true // All edges are workflow edges in our case
}

// Event handler types
export type OnNodesChange = (changes: NodeChanges) => void
export type OnEdgesChange = (changes: EdgeChanges) => void
export type OnConnect = (connection: WorkflowConnection) => void
export type OnSelectionChange = OnSelectionChangeFunc

// Component prop types
export interface WorkflowCanvasProps {
    projectId?: string
}

export interface WorkflowToolbarProps {
    onAddNode: (type: NodeType) => void
    onUndo: () => void
    onRedo: () => void
    onCopy: () => void
    onDelete: () => void
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
    onExport: () => void
    selectedNodesCount: number
    canUndo: boolean
    canRedo: boolean
}

export interface WorkflowCanvasComponentProps {
    nodes: ReactFlowNode[]
    edges: ReactFlowEdge[]
    onNodesChange: OnNodesChange
    onEdgesChange: OnEdgesChange
    onConnect: OnConnect
    onSelectionChange: OnSelectionChange
    nodeTypes: Record<string, React.ComponentType<any>>
    edgeTypes: Record<string, React.ComponentType<any>>
    onCanvasMouseMove: (e: React.MouseEvent) => void
}

export interface KeyboardShortcutsProps {
    onUndo: () => void
    onRedo: () => void
    onCopy: () => void
    selectedNodesCount: number
}

export interface WorkflowHistory {
    nodes: WorkflowNode[]
    edges: WorkflowEdge[]
}

export interface Project {
    id: string
    name: string
    nodes: WorkflowNode[]
    edges: WorkflowEdge[]
    createdAt: Date
    updatedAt: Date
}

export interface NodeEditModalProps {
    node: {
        type: NodeType
        data: WorkflowNodeData
        id: string
    }
    isOpen: boolean
    onClose: () => void
    onSave: (formData: WorkflowNodeData) => void
}

export interface EdgeWithDeleteProps {
    id: string
    data?: {
        onDelete?: (edgeId: string) => void
    }
    source: string
    target: string
    markerEnd?: string | {
        type: string
        color: string
    }
    style?: React.CSSProperties
    label?: string
    labelStyle?: React.CSSProperties
    labelBgStyle?: React.CSSProperties
    sourceX: number
    sourceY: number
    targetX: number
    targetY: number
    sourcePosition: any
    targetPosition: any
    isSelected?: boolean
    onSelectEdge?: (edgeId: string | null) => void
}

export interface WorkflowBuilderProps {
    projectId?: string
}

export interface NodeComponentProps {
    data: WorkflowNodeData
    id: string
    selected: boolean
}

export interface NodeDefaults {
    start: Partial<StartNodeData>
    action: Partial<ActionNodeData>
    decision: Partial<DecisionNodeData>
    terminal: Partial<TerminalNodeData>
}
