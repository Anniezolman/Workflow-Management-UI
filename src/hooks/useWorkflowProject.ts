import { projectStorage } from '@/lib/ProjectStorage'
import { NodeDefaults, WorkflowEdge, WorkflowNode } from '@/types/workflow'
import { NODE_DEFAULTS, EDGE_COLORS } from '@/config/constants'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const useWorkflowProject = (projectId?: string) => {
    const [nodes, setNodes] = useState<WorkflowNode[]>([])
    const [edges, setEdges] = useState<WorkflowEdge[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [projectName, setProjectName] = useState("")
    const [nodeIdCounter, setNodeIdCounter] = useState(8)

    const getDefaultNodes = (): WorkflowNode[] => [
        {
            id: "1",
            type: "start",
            position: { x: 100, y: 100 },
            data: {
                label: "Start Workflow",
                description: "Webhook trigger",
                trigger: "webhook",
            },
        },
        {
            id: "2",
            type: "action",
            position: { x: 100, y: 280 },
            data: {
                label: "Fetch Lead Data",
                description: "Enrich account information",
                actionType: "enrichment",
                endpoint: "/api/enrich",
                collapsed: false,
            },
        },
        {
            id: "3",
            type: "decision",
            position: { x: 450, y: 220 },
            data: {
                label: "Check Lead Score",
                description: "Evaluate lead quality",
                condition: "score > 80",
                trueLabel: "Hot Lead",
                falseLabel: "Warm Lead",
                collapsed: false,
            },
        },
        {
            id: "4",
            type: "action",
            position: { x: 800, y: 120 },
            data: {
                label: "AI Personalization",
                description: "Generate personalized content",
                actionType: "ai",
                collapsed: false,
            },
        },
        {
            id: "5",
            type: "terminal",
            position: { x: 1100, y: 120 },
            data: {
                label: "Premium Outreach",
                description: "Send immediate email",
                output: "email",
            },
        },
        {
            id: "6",
            type: "action",
            position: { x: 800, y: 320 },
            data: {
                label: "Standard Queue",
                description: "Add to nurture sequence",
                actionType: "transform",
                collapsed: false,
            },
        },
        {
            id: "7",
            type: "terminal",
            position: { x: 1100, y: 320 },
            data: {
                label: "Standard Outreach",
                description: "Schedule follow-up",
                output: "email",
            },
        },
    ]

    const getDefaultEdges = (): WorkflowEdge[] => [
        {
            id: "e1-2",
            source: "1",
            target: "2",
            animated: true,
            style: { stroke: EDGE_COLORS.default, strokeWidth: 2 },
            markerEnd: { type: "arrowclosed", color: EDGE_COLORS.default },
        },
        {
            id: "e2-3",
            source: "2",
            target: "3",
            animated: true,
            style: { stroke: EDGE_COLORS.default, strokeWidth: 2 },
            markerEnd: { type: "arrowclosed", color: EDGE_COLORS.default },
        },
        {
            id: "e3-4",
            source: "3",
            target: "4",
            sourceHandle: "true",
            label: "Hot Lead",
            animated: true,
            style: { stroke: EDGE_COLORS.true, strokeWidth: 2 },
            labelStyle: { fill: EDGE_COLORS.true, fontWeight: 600, fontSize: 12 },
            labelBgStyle: { fill: "#d1fae5", fillOpacity: 0.9 },
            markerEnd: { type: "arrowclosed", color: EDGE_COLORS.true },
        },
        {
            id: "e4-5",
            source: "4",
            target: "5",
            animated: true,
            style: { stroke: EDGE_COLORS.default, strokeWidth: 2 },
            markerEnd: { type: "arrowclosed", color: EDGE_COLORS.default },
        },
        {
            id: "e3-6",
            source: "3",
            target: "6",
            sourceHandle: "false",
            label: "Warm Lead",
            animated: true,
            style: { stroke: EDGE_COLORS.false, strokeWidth: 2 },
            labelStyle: { fill: EDGE_COLORS.false, fontWeight: 600, fontSize: 12 },
            labelBgStyle: { fill: "#fee2e2", fillOpacity: 0.9 },
            markerEnd: { type: "arrowclosed", color: EDGE_COLORS.false },
        },
        {
            id: "e6-7",
            source: "6",
            target: "7",
            animated: true,
            style: { stroke: EDGE_COLORS.default, strokeWidth: 2 },
            markerEnd: { type: "arrowclosed", color: EDGE_COLORS.default },
        },
    ]

    const nodeDefaults: NodeDefaults = useMemo(() => NODE_DEFAULTS, [])

    const addNode = useCallback((type: 'start' | 'action' | 'decision' | 'terminal', cursorPos: { x: number; y: number }) => {
        const newId = String(nodeIdCounter)
        const newNode: WorkflowNode = {
            id: newId,
            type,
            position: {
                x: cursorPos.x - 100,
                y: cursorPos.y - 50,
            },
            data: nodeDefaults[type] as any,
        }

        setNodes((nds) => [...nds, newNode])
        setNodeIdCounter(nodeIdCounter + 1)
        return newNode
    }, [nodeIdCounter, nodeDefaults])

    const updateNodeData = useCallback((nodeId: string, newData: any) => {
        setNodes((currentNodes) => {
            return currentNodes.map((node) => {
                if (node.id === nodeId) {
                    return { 
                        ...node,
                        data: {
                            ...node.data,
                            ...newData
                        }
                    }
                }
                return node
            })
        })
    }, [])

    const deleteNodes = useCallback((nodeIds: string[]) => {
        setNodes((nds) => {
            const updated = nds.filter((n) => !nodeIds.includes(n.id))
            setEdges((eds) => {
                return eds.filter((e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target))
            })
            return updated
        })
    }, [])

   
    const copyNodes = useCallback((nodesToCopy: WorkflowNode[]) => {
        const newNodes = nodesToCopy.map((node, index) => {
            const newId = String(nodeIdCounter + index)
            return {
                id: newId,
                type: node.type,
                position: {
                    x: node.position.x + 50,
                    y: node.position.y + 50,
                },
                data: JSON.parse(JSON.stringify(node.data)), 
            }
        })

        setNodes((nds) => [...nds, ...newNodes])
        setNodeIdCounter(nodeIdCounter + nodesToCopy.length)
        return newNodes
    }, [nodeIdCounter])

    useEffect(() => {
        const defaultNodes = getDefaultNodes()
        const defaultEdges = getDefaultEdges()

        if (projectId) {
            const project = projectStorage.getProject(projectId)
            if (project) {
                setNodes(project.nodes || [])
                setEdges(project.edges || [])
                setProjectName(project.name)
            } else {
                setNodes(defaultNodes)
                setEdges(defaultEdges)
                setProjectName("New Workflow")
            }
        } else {
            setNodes(defaultNodes)
            setEdges(defaultEdges)
            setProjectName("New Workflow")
        }

        setIsLoading(false)
    }, [projectId])

    useEffect(() => {
        if (projectId && !isLoading) {
            projectStorage.updateProject(projectId, {
                nodes,
                edges,
                name: projectName,
            })
        }
    }, [nodes, edges, projectName, projectId, isLoading])

    return {
        nodes,
        setNodes,
        edges,
        setEdges,
        isLoading,
        projectName,
        setProjectName,
        nodeIdCounter,
        addNode,
        updateNodeData,
        deleteNodes,
        copyNodes,
        getDefaultNodes,
        getDefaultEdges,
    }
}