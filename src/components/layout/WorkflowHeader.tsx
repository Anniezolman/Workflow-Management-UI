import React from 'react'

interface WorkflowHeaderProps {
  projectName: string
  onBackToHome: () => void
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({ projectName, onBackToHome }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{projectName}</h1>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Click any text to edit inline • Drag handles to connect nodes • Click edges to delete
        </p>
      </div>
    </div>
  )
}

export default WorkflowHeader
