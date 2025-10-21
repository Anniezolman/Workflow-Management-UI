import { WorkflowEdge, WorkflowHistory, WorkflowNode } from '@/types/workflow'
import { useCallback, useRef, useState } from 'react'

export const useWorkflowHistory = () => {
    const [history, setHistory] = useState<WorkflowHistory[]>([])
    const [historyIndex, setHistoryIndex] = useState(0)
    const historyIndexRef = useRef(0)

    const saveToHistory = useCallback((newNodes: WorkflowNode[], newEdges: WorkflowEdge[]) => {
        setHistory((prevHistory) => {
            const newHistory = prevHistory.slice(0, historyIndexRef.current + 1)
            newHistory.push({ nodes: newNodes, edges: newEdges })
            return newHistory
        })
        setHistoryIndex((prevIndex) => {
            const newIndex = prevIndex + 1
            historyIndexRef.current = newIndex
            return newIndex
        })
    }, [])

    const undo = useCallback((setNodes: (nodes: WorkflowNode[]) => void, setEdges: (edges: WorkflowEdge[]) => void) => {
        setHistory((currentHistory) => {
            if (historyIndexRef.current > 0) {
                const newIndex = historyIndexRef.current - 1
                setNodes(currentHistory[newIndex].nodes)
                setEdges(currentHistory[newIndex].edges)
                setHistoryIndex(newIndex)
                historyIndexRef.current = newIndex
            }
            return currentHistory
        })
    }, [])

    const redo = useCallback((setNodes: (nodes: WorkflowNode[]) => void, setEdges: (edges: WorkflowEdge[]) => void) => {
        setHistory((currentHistory) => {
            if (historyIndexRef.current < currentHistory.length - 1) {
                const newIndex = historyIndexRef.current + 1
                setNodes(currentHistory[newIndex].nodes)
                setEdges(currentHistory[newIndex].edges)
                setHistoryIndex(newIndex)
                historyIndexRef.current = newIndex
            }
            return currentHistory
        })
    }, [])

    const initializeHistory = useCallback((initialNodes: WorkflowNode[], initialEdges: WorkflowEdge[]) => {
        setHistory([{ nodes: initialNodes, edges: initialEdges }])
        setHistoryIndex(0)
        historyIndexRef.current = 0
    }, [])

    return {
        history,
        historyIndex,
        saveToHistory,
        undo,
        redo,
        initializeHistory,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
    }
}