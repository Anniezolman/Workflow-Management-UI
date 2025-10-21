/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import WorkflowCanvasComponent from "@/components/canvas/WorkflowCanvasComponent"
import EdgeDeleteDialog from "@/components/dialogs/EdgeDeleteDialog"
import EdgeWithDelete from "@/components/edges/EdgeWithDelete"
import WorkflowHeader from "@/components/layout/WorkflowHeader"
import ActionNode from "@/components/nodes/ActionNode"
import DecisionNode from "@/components/nodes/DecisionNode"
import StartNode from "@/components/nodes/StartNode"
import TerminalNode from "@/components/nodes/TerminalNode"
import WorkflowToolbar from "@/components/toolbar/WorkflowToolbar"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useWorkflowHistory } from "@/hooks/useWorkflowHistory"
import { useWorkflowOperations } from "@/hooks/useWorkflowOperations"
import { useWorkflowProject } from "@/hooks/useWorkflowProject"
import {
  NodeType,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  OnSelectionChange,
  ReactFlowEdge,
  ReactFlowNode,
  WorkflowCanvasProps,
} from "@/types/workflow"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { addEdge, useEdgesState, useNodesState } from "reactflow"

const nodeTypes = {
  start: StartNode,
  action: ActionNode,
  decision: DecisionNode,
  terminal: TerminalNode,
}

const WorkflowBuilder: React.FC<WorkflowCanvasProps> = ({ projectId }) => {
  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([])
  const [selectedNodes, setSelectedNodes] = useState<ReactFlowNode[]>([])
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [edgeToDelete, setEdgeToDelete] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialLoadRef = useRef(true)

  // Custom hooks
  const {
    nodes: projectNodes,
    setNodes: setProjectNodes,
    edges: projectEdges,
    setEdges: setProjectEdges,
    isLoading,
    projectName,
    addNode: addProjectNode,
    updateNodeData,
    deleteNodes,
    copyNodes,
  } = useWorkflowProject(projectId)

  const {
    saveToHistory,
    undo,
    redo,
    initializeHistory,
    canUndo,
    canRedo,
  } = useWorkflowHistory()

  const {
    createEdge,
    updateEdgeLabels,
    exportWorkflow,
    importWorkflow,
  } = useWorkflowOperations()

  // Initial sync only - load project data once
  useEffect(() => {
    if (!isLoading && isInitialLoadRef.current) {
      setNodes(projectNodes as any)
      setEdges(projectEdges as any)
      isInitialLoadRef.current = false
    }
  }, [isLoading, projectNodes, projectEdges, setNodes, setEdges])

  // Reset initial load flag when project changes
  useEffect(() => {
    isInitialLoadRef.current = true
  }, [projectId])

  // Initialize history when project loads
  useEffect(() => {
    if (!isLoading && projectNodes.length > 0 && isInitialLoadRef.current === false) {
      initializeHistory(projectNodes, projectEdges)
    }
  }, [isLoading, projectNodes, projectEdges, initializeHistory])

  const debouncedSaveToProject = useCallback((currentNodes: any[], currentEdges: any[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const nodesCopy = currentNodes.map(node => ({
        id: node.id,
        type: node.type,
        position: { ...node.position },
        data: { ...node.data },
        hidden: node.hidden,
      }))
      const edgesCopy = currentEdges.map(edge => ({ ...edge }))
      
      setProjectNodes(nodesCopy)
      setProjectEdges(edgesCopy)
      saveToHistory(nodesCopy, edgesCopy)
    }, 300)
  }, [setProjectNodes, setProjectEdges, saveToHistory])

  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    onNodesChange(changes)
    const hasPositionChange = changes.some(change => change.type === 'position' && change.dragging)
    if (!hasPositionChange || changes.some(change => change.type === 'position' && !change.dragging)) {
      requestAnimationFrame(() => {
        setNodes((currentNodes) => {
          if (currentNodes.length > 0) {
            debouncedSaveToProject(currentNodes as any, edges as any)
          }
          return currentNodes
        })
      })
    }
  }, [onNodesChange, debouncedSaveToProject, edges, setNodes])

  const handleEdgesChange: OnEdgesChange = useCallback((changes) => {
    onEdgesChange(changes)
  
    requestAnimationFrame(() => {
      setEdges((currentEdges) => {
        if (currentEdges.length > 0) {
          debouncedSaveToProject(nodes as any, currentEdges as any)
        }
        return currentEdges
      })
    })
  }, [onEdgesChange, debouncedSaveToProject, nodes, setEdges])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }, [])

  // Node operations
  const addNode = useCallback((type: NodeType) => {
    const newNode = addProjectNode(type, cursorPos)
    setNodes((prevNodes) => [...prevNodes, newNode] as any)
    setProjectNodes((prevNodes) => [...prevNodes, newNode])
  }, [addProjectNode, cursorPos, setNodes, setProjectNodes])

  const copySelectedNodes = useCallback(() => {
    if (selectedNodes.length === 0) return
    const newNodes = copyNodes(selectedNodes as any)
    setNodes((prevNodes) => [...prevNodes, ...newNodes] as any)
    setProjectNodes((prevNodes) => [...prevNodes, ...newNodes])
  }, [selectedNodes, copyNodes, setNodes, setProjectNodes])

  const deleteSelectedNodes = useCallback(() => {
    const selectedIds = selectedNodes.map((n) => n.id)
    deleteNodes(selectedIds)
    setNodes((prevNodes) => prevNodes.filter((n) => !selectedIds.includes(n.id)))
    setProjectNodes((prevNodes) => prevNodes.filter((n) => !selectedIds.includes(n.id)))
    setSelectedNodes([])
  }, [selectedNodes, deleteNodes, setNodes, setProjectNodes])

  // Edge operations
  const handleConnect: OnConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((n) => n.id === params.source) as any
      const newEdge = createEdge(params, sourceNode)

      const updated = addEdge(newEdge, edges)
      setEdges(updated as any)
      setProjectEdges(updated as any)
      saveToHistory(nodes as any, updated as any)
    },
    [nodes, edges, createEdge, setEdges, setProjectEdges, saveToHistory],
  )

  const deleteEdge = useCallback((edgeId: string) => {
    setEdgeToDelete(edgeId)
    setSelectedEdgeId(null)
  }, [])

  const confirmDeleteEdge = useCallback(() => {
    if (edgeToDelete) {
      const updated = edges.filter((e) => e.id !== edgeToDelete)
      setEdges(updated as any)
      setProjectEdges(updated as any)
      saveToHistory(nodes as any, updated as any)
      setEdgeToDelete(null)
    }
  }, [edgeToDelete, edges, nodes, setEdges, setProjectEdges, saveToHistory])

  // Update edge labels dynamically when decision node labels change
  const edgesWithUpdatedLabels = useMemo(() => {
    const { edges: updatedEdges } = updateEdgeLabels(edges as any, nodes as any)
    return updatedEdges
  }, [edges, nodes, updateEdgeLabels])

  // Event handlers
  const handleSelectionChange: OnSelectionChange = useCallback(({ nodes: selectedNodes }) => {
    setSelectedNodes(selectedNodes as ReactFlowNode[])
  }, [])

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    // Clear any pending saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    undo((newNodes: any) => {
      setNodes(newNodes)
      setProjectNodes(newNodes)
    }, (newEdges: any) => {
      setEdges(newEdges)
      setProjectEdges(newEdges)
    })
  }, [undo, setNodes, setEdges, setProjectNodes, setProjectEdges])

  const handleRedo = useCallback(() => {
    // Clear any pending saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    redo((newNodes: any) => {
      setNodes(newNodes)
      setProjectNodes(newNodes)
    }, (newEdges: any) => {
      setEdges(newEdges)
      setProjectEdges(newEdges)
    })
  }, [redo, setNodes, setEdges, setProjectNodes, setProjectEdges])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onCopy: copySelectedNodes,
    selectedNodesCount: selectedNodes.length,
  })

  // Export/Import functions
  const handleExport = useCallback(() => {
    exportWorkflow(nodes as any, edges as any)
  }, [exportWorkflow, nodes, edges])

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    importWorkflow(event, (newNodes, newEdges) => {
      setNodes(newNodes as any)
      setEdges(newEdges as any)
      setProjectNodes(newNodes as any)
      setProjectEdges(newEdges as any)
      saveToHistory(newNodes as any, newEdges as any)
    })
  }, [importWorkflow, setNodes, setEdges, setProjectNodes, setProjectEdges, saveToHistory])

  const handleBackToHome = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }, [])

  // Add onUpdate to all nodes
  const nodesWithUpdate = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onUpdate: updateNodeData,
      },
    }))
  }, [nodes, updateNodeData])

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <WorkflowHeader
        projectName={projectName}
        onBackToHome={handleBackToHome}
      />

      <WorkflowToolbar
        onAddNode={addNode}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCopy={copySelectedNodes}
        onDelete={deleteSelectedNodes}
        onImport={handleImport}
        onExport={handleExport}
        selectedNodesCount={selectedNodes.length}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <WorkflowCanvasComponent
        nodes={nodesWithUpdate as any}
        edges={edgesWithUpdatedLabels.map((edge) => ({
          ...edge,
          data: { onDelete: deleteEdge },
        })) as any}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onSelectionChange={handleSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={{
          default: (props: any) => (
            <EdgeWithDelete {...props} isSelected={selectedEdgeId === props.id} onSelectEdge={setSelectedEdgeId} />
          ),
        }}
        onCanvasMouseMove={handleCanvasMouseMove}
      />

      <EdgeDeleteDialog
        isOpen={edgeToDelete !== null}
        onClose={() => setEdgeToDelete(null)}
        onConfirm={confirmDeleteEdge}
      />
    </div>
  )
}

export default WorkflowBuilder