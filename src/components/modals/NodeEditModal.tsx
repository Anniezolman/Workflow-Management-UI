import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Rocket, Database, GitBranch, CheckCircle2 } from 'lucide-react'
import { NodeEditModalProps, StartNodeData, ActionNodeData, DecisionNodeData, TerminalNodeData, WorkflowNodeData } from '@/types/workflow'

const NodeEditModal: React.FC<NodeEditModalProps> = ({ node, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<WorkflowNodeData>(node?.data || {} as WorkflowNodeData)
  const [nodeId, setNodeId] = useState(node?.id)

  useEffect(() => {
    if (isOpen && node?.id !== nodeId) {
      setFormData(node?.data || {} as WorkflowNodeData)
      setNodeId(node?.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, node?.id, nodeId])

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  if (!node) return null

  const getNodeIcon = () => {
    switch (node.type) {
      case "start":
        return <Rocket className="w-5 h-5 text-emerald-600" />
      case "action":
        return <Database className="w-5 h-5 text-sky-600" />
      case "decision":
        return <GitBranch className="w-5 h-5 text-amber-600" />
      case "terminal":
        return <CheckCircle2 className="w-5 h-5 text-slate-600" />
      default:
        return null
    }
  }

  const renderFields = () => {
    switch (node.type) {
      case "start":
        const startData = formData as StartNodeData
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Label</label>
              <input
                type="text"
                value={startData.label || ""}
                onChange={(e) => setFormData({ ...startData, label: e.target.value } as StartNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Start Node"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={startData.description || ""}
                onChange={(e) => setFormData({ ...startData, description: e.target.value } as StartNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Add description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Trigger Type</label>
              <Select
                value={startData.trigger || "webhook"}
                onValueChange={(value: 'webhook' | 'schedule' | 'manual' | 'event') => setFormData({ ...startData, trigger: value } as StartNodeData)}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "action":
        const actionData = formData as ActionNodeData
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Label</label>
              <input
                type="text"
                value={actionData.label || ""}
                onChange={(e) => setFormData({ ...actionData, label: e.target.value } as ActionNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Action Node"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={actionData.description || ""}
                onChange={(e) => setFormData({ ...actionData, description: e.target.value } as ActionNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                placeholder="Add description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Action Type</label>
              <Select
                value={actionData.actionType || "enrichment"}
                onValueChange={(value: 'enrichment' | 'person' | 'ai' | 'api' | 'transform') => setFormData({ ...actionData, actionType: value } as ActionNodeData)}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enrichment">Account Enrichment</SelectItem>
                  <SelectItem value="person">Person Enrichment</SelectItem>
                  <SelectItem value="ai">AI Agent</SelectItem>
                  <SelectItem value="api">API Call</SelectItem>
                  <SelectItem value="transform">Transform Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Endpoint</label>
              <input
                type="text"
                value={actionData.endpoint || ""}
                onChange={(e) => setFormData({ ...actionData, endpoint: e.target.value } as ActionNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                placeholder="/api/endpoint"
              />
            </div>
          </>
        )
      case "decision":
        const decisionData = formData as DecisionNodeData
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Label</label>
              <input
                type="text"
                value={decisionData.label || ""}
                onChange={(e) => setFormData({ ...decisionData, label: e.target.value } as DecisionNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Decision Node"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={decisionData.description || ""}
                onChange={(e) => setFormData({ ...decisionData, description: e.target.value } as DecisionNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                placeholder="Add description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Condition</label>
              <input
                type="text"
                value={decisionData.condition || ""}
                onChange={(e) => setFormData({ ...decisionData, condition: e.target.value } as DecisionNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                placeholder="e.g., score > 80"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">True Label</label>
                <input
                  type="text"
                  value={decisionData.trueLabel || ""}
                  onChange={(e) => setFormData({ ...decisionData, trueLabel: e.target.value } as DecisionNodeData)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Yes"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">False Label</label>
                <input
                  type="text"
                  value={decisionData.falseLabel || ""}
                  onChange={(e) => setFormData({ ...decisionData, falseLabel: e.target.value } as DecisionNodeData)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="No"
                />
              </div>
            </div>
          </>
        )
      case "terminal":
        const terminalData = formData as TerminalNodeData
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Label</label>
              <input
                type="text"
                value={terminalData.label || ""}
                onChange={(e) => setFormData({ ...terminalData, label: e.target.value } as TerminalNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Terminal Node"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={terminalData.description || ""}
                onChange={(e) => setFormData({ ...terminalData, description: e.target.value } as TerminalNodeData)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                placeholder="Add description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Output Type</label>
              <Select
                value={terminalData.output || "email"}
                onValueChange={(value: 'email' | 'slack' | 'crm' | 'webhook') => setFormData({ ...terminalData, output: value } as TerminalNodeData)}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="crm">CRM Update</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getNodeIcon()}
            <DialogTitle className="text-lg font-bold text-gray-900">
              Edit {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node
            </DialogTitle>
          </div>
          <Separator className="mt-3" />
        </DialogHeader>
        <div className="py-4 max-h-96 overflow-y-auto px-1 space-y-4">{renderFields()}</div>
        <DialogFooter className="pt-4 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Save Changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NodeEditModal
