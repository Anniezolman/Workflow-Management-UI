import React from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { WorkflowCanvasComponentProps } from '@/types/workflow'
import { NODE_COLORS } from '@/config/constants'

const WorkflowCanvasComponent: React.FC<WorkflowCanvasComponentProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectionChange,
  nodeTypes,
  edgeTypes,
  onCanvasMouseMove,
}) => {
  return (
    <div className="flex-1 relative" onMouseMove={onCanvasMouseMove}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-gray-50"
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            return NODE_COLORS[node.type as keyof typeof NODE_COLORS] || NODE_COLORS.default
          }}
        />
        <Panel position="top-right" className="bg-white rounded-lg shadow-md p-3 m-4">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="font-semibold mb-2">Quick Tips:</div>
            <div>• Click text to edit inline</div>
            <div>• Drag handles to connect</div>
            <div>• Click edges to delete</div>
            {/* <div>• Ctrl+Z / Ctrl+Shift+Z to undo/redo</div> */}
            <div>• Ctrl+D to duplicate selected</div>
            <div>• Shift+Click for multi-select</div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default WorkflowCanvasComponent
