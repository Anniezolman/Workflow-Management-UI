import NodeEditModal from '@/components/modals/NodeEditModal'
import { NodeComponentProps, TerminalNodeData, WorkflowNodeData } from '@/types/workflow'
import { CheckCircle2, ChevronDown, ChevronRight, Edit2 } from 'lucide-react'
import React, { useState } from 'react'
import { Handle, Position } from 'reactflow'

const TerminalNode: React.FC<NodeComponentProps> = ({ data, id, selected }) => {
    const [collapsed, setCollapsed] = useState(data.collapsed || false)
    const [editModalOpen, setEditModalOpen] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateNodeData = (field: keyof TerminalNodeData, value: any) => {
        data.onUpdate?.(id, { ...data, [field]: value })
    }

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setEditModalOpen(true)
    }

    const handleModalSave = (formData: WorkflowNodeData) => {
        data.onUpdate?.(id, { ...formData, collapsed })
    }

    return (
        <>
            <div
                className={`px-4 py-3 rounded-lg border-2 border-slate-500 bg-white shadow-lg min-w-[200px] transition-all ${selected ? "ring-2 ring-slate-400 ring-offset-2 shadow-xl" : ""
                    }`}
            >
                <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-500 !border-2 !border-white" />

                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <CheckCircle2 className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        <span className="font-semibold text-gray-800 truncate">{data.label}</span>
                    </div>
                    <button onClick={handleEditClick} className="p-1 hover:bg-gray-100 rounded flex-shrink-0" title="Edit node">
                        <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => {
                            setCollapsed(!collapsed)
                            updateNodeData("collapsed", !collapsed)
                        }}
                        className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>

                {!collapsed && (
                    <>
                        <p className="text-xs text-gray-600 mb-2">{data.description}</p>
                        <div className="text-xs">
                            <label className="text-gray-500 block mb-1">Output Type:</label>
                            <span className="text-gray-700">{(data as TerminalNodeData).output || "email"}</span>
                        </div>
                    </>
                )}
            </div>
            <NodeEditModal
                node={{ type: "terminal", data, id }}
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleModalSave}
            />
        </>
    )
}

export default TerminalNode
