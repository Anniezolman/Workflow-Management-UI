import NodeEditModal from '@/components/modals/NodeEditModal'
import { DecisionNodeData, NodeComponentProps, WorkflowNodeData } from '@/types/workflow'
import { ChevronDown, ChevronRight, Edit2, GitBranch } from 'lucide-react'
import React, { useState } from 'react'
import { Handle, Position } from 'reactflow'

const DecisionNode: React.FC<NodeComponentProps> = ({ data, id, selected }) => {
    const [collapsed, setCollapsed] = useState(data.collapsed || false)
    const [editModalOpen, setEditModalOpen] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateNodeData = (field: keyof DecisionNodeData, value: any) => {
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
                className={`px-4 py-3 rounded-lg border-2 border-amber-500 bg-white shadow-lg min-w-[240px] transition-all ${selected ? "ring-2 ring-amber-400 ring-offset-2 shadow-xl" : ""
                    }`}
            >
                <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-amber-500 !border-2 !border-white" />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="true"
                    style={{ top: "35%" }}
                    className="w-3 h-3 !bg-green-500 !border-2 !border-white"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="false"
                    style={{ top: "65%" }}
                    className="w-3 h-3 !bg-red-500 !border-2 !border-white"
                />

                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <GitBranch className="w-5 h-5 text-amber-600 flex-shrink-0" />
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
                        <div className="space-y-2 text-xs">
                            <div>
                                <label className="text-gray-500 block mb-1">Condition:</label>
                                <span className="text-gray-700 font-mono">{(data as DecisionNodeData).condition || "N/A"}</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-gray-500 block mb-1">True Label:</label>
                                    <span className="text-gray-700">{(data as DecisionNodeData).trueLabel || "Yes"}</span>
                                </div>
                                <div className="flex-1">
                                    <label className="text-gray-500 block mb-1">False Label:</label>
                                    <span className="text-gray-700">{(data as DecisionNodeData).falseLabel || "No"}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <NodeEditModal
                node={{ type: "decision", data, id }}
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleModalSave}
            />
        </>
    )
}

export default DecisionNode
