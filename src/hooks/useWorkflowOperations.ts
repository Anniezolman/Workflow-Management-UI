import { DecisionNodeData, ReactFlowEdge, ReactFlowNode, WorkflowNode } from '@/types/workflow'
import { EDGE_COLORS, EDGE_STYLES, EDGE_LABEL_STYLES, EDGE_LABEL_BG_STYLES } from '@/config/constants'
import { useCallback } from 'react'
import { MarkerType } from 'reactflow'

export const useWorkflowOperations = () => {
    const createEdge = useCallback((
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: any,
        sourceNode: WorkflowNode | undefined
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any => {
        let edgeLabel = ""
        let edgeStyle: { stroke: string; strokeWidth: number } = EDGE_STYLES.default
        let labelStyle: { fill?: string; fontWeight?: number; fontSize?: number } = {}
        let labelBgStyle: { fill?: string; fillOpacity?: number } = {}
        let markerEnd: { type: MarkerType; color: string } = { type: MarkerType.ArrowClosed, color: EDGE_COLORS.default }

        if (sourceNode?.type === "decision") {
            if (params.sourceHandle === "true") {
                edgeLabel = (sourceNode.data as DecisionNodeData).trueLabel || "Yes"
                edgeStyle = EDGE_STYLES.true
                labelStyle = EDGE_LABEL_STYLES.true
                labelBgStyle = EDGE_LABEL_BG_STYLES.true
                markerEnd = { type: MarkerType.ArrowClosed, color: EDGE_COLORS.true }
            } else if (params.sourceHandle === "false") {
                edgeLabel = (sourceNode.data as DecisionNodeData).falseLabel || "No"
                edgeStyle = EDGE_STYLES.false
                labelStyle = EDGE_LABEL_STYLES.false
                labelBgStyle = EDGE_LABEL_BG_STYLES.false
                markerEnd = { type: MarkerType.ArrowClosed, color: EDGE_COLORS.false }
            }
        }

        return {
            ...params,
            animated: true,
            style: edgeStyle,
            label: edgeLabel,
            labelStyle: labelStyle,
            labelBgStyle: labelBgStyle,
            markerEnd: markerEnd,
        }
    }, [])

    const updateEdgeLabels = useCallback((
        edges: ReactFlowEdge[],
        nodes: ReactFlowNode[]
    ): { edges: ReactFlowEdge[], hasChanges: boolean } => {
        let hasChanges = false
        const updatedEdges = edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source)
            if (sourceNode?.type === "decision") {
                let newLabel = edge.label
                if (edge.sourceHandle === "true") {
                    newLabel = (sourceNode.data as DecisionNodeData).trueLabel || "Yes"
                } else if (edge.sourceHandle === "false") {
                    newLabel = (sourceNode.data as DecisionNodeData).falseLabel || "No"
                }
                
                if (newLabel !== edge.label) {
                    hasChanges = true
                    return { ...edge, label: newLabel }
                }
            }
            return edge
        })
        
        return { edges: updatedEdges, hasChanges }
    }, [])

    const exportWorkflow = useCallback((nodes: ReactFlowNode[], edges: ReactFlowEdge[]) => {
        const workflow = { nodes, edges }
        const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "workflow.json"
        a.click()
        URL.revokeObjectURL(url)
    }, [])

    const importWorkflow = useCallback((
        event: React.ChangeEvent<HTMLInputElement>,
        onImport: (nodes: ReactFlowNode[], edges: ReactFlowEdge[]) => void
    ) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const workflow = JSON.parse(e.target?.result as string)
                const newNodes = workflow.nodes || []
                const newEdges = workflow.edges || []
                onImport(newNodes, newEdges)
            } catch {
                alert("Invalid workflow file")
            }
        }
        reader.readAsText(file)
    }, [])

    return {
        createEdge,
        updateEdgeLabels,
        exportWorkflow,
        importWorkflow,
    }
}