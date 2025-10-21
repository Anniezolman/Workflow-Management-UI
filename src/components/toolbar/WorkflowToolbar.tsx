import { WorkflowToolbarProps } from '@/types/workflow'
import { 
    NODE_TOOLBAR_BUTTONS, 
    HISTORY_TOOLBAR_BUTTONS,
    SELECTION_TOOLBAR_BUTTONS,
    IMPORT_EXPORT_TOOLBAR_BUTTONS 
} from '@/config/constants'
import React from 'react'

const WorkflowToolbar: React.FC<WorkflowToolbarProps> = ({
    onAddNode,
    onUndo,
    onRedo,
    onCopy,
    onDelete,
    onImport,
    onExport,
    selectedNodesCount,
    canUndo,
    canRedo,
}) => {
    const historyActions = {
        undo: onUndo,
        redo: onRedo,
    }

    const historyDisabled = {
        undo: !canUndo,
        redo: !canRedo,
    }

    const selectionActions = {
        copy: onCopy,
        delete: onDelete,
    }

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2 flex-wrap">
            {/* Node Creation Buttons */}
            {NODE_TOOLBAR_BUTTONS.map((button) => {
                const Icon = button.icon
                return (
                    <button
                        key={button.type}
                        onClick={() => onAddNode(button.type)}
                        className={button.className}
                    >
                        <Icon className="w-4 h-4" />
                        {button.label}
                    </button>
                )
            })}

            {/* <div className="w-px h-8 bg-gray-300 mx-2" /> */}

            {/* History Controls */}
            {/* {HISTORY_TOOLBAR_BUTTONS.map((button) => {
                const Icon = button.icon
                const action = historyActions[button.action]
                const disabled = historyDisabled[button.action]
                
                return (
                    <button
                        key={button.action}
                        onClick={action}
                        disabled={disabled}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                        title={button.title}
                    >
                        <Icon className="w-4 h-4" />
                        {button.label}
                    </button>
                )
            })} */}

            <div className="w-px h-8 bg-gray-300 mx-2" />

            {/* Selection Actions */}
            {selectedNodesCount > 0 && (
                <>
                    {SELECTION_TOOLBAR_BUTTONS.map((button) => {
                        const Icon = button.icon
                        const action = selectionActions[button.action]
                        
                        return (
                            <button
                                key={button.action}
                                onClick={action}
                                className={button.className}
                                title={button.title}
                            >
                                <Icon className="w-4 h-4" />
                                {button.label} ({selectedNodesCount})
                            </button>
                        )
                    })}
                </>
            )}

            <div className="flex-1" />

            {/* Import/Export */}
            {IMPORT_EXPORT_TOOLBAR_BUTTONS.map((button) => {
                const Icon = button.icon
                
                if (button.action === 'import') {
                    return (
                        <label
                            key={button.action}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors"
                        >
                            <Icon className="w-4 h-4" />
                            {button.label}
                            <input type="file" accept=".json" onChange={onImport} className="hidden" />
                        </label>
                    )
                }
                
                return (
                    <button
                        key={button.action}
                        onClick={button.action === 'export' ? onExport : undefined}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Icon className="w-4 h-4" />
                        {button.label}
                    </button>
                )
            })}
        </div>
    )
}

export default WorkflowToolbar