import { EdgeWithDeleteProps } from '@/types/workflow'
import { Trash2 } from 'lucide-react'
import React from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow'

const EdgeWithDelete: React.FC<EdgeWithDeleteProps> = ({
    id,
    data,
    markerEnd,
    style,
    label,
    labelBgStyle,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    isSelected,
    onSelectEdge,
}) => {
    const onDelete = data?.onDelete

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    return (
        <>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd as any} style={style} />
            {label && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: "absolute",
                            background: labelBgStyle?.fill || "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                            pointerEvents: "all",
                            transform: `translate(-50%, -50%)`,
                            left: `${labelX}px`,
                            top: `${labelY}px`,
                        }}
                        className="nodrag nopan"
                    >
                        {label}
                    </div>
                </EdgeLabelRenderer>
            )}
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        pointerEvents: "all",
                        left: `${labelX}px`,
                        top: `${labelY}px`,
                        transform: `translate(-50%, -50%)`,
                        width: "60px",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                    className="nodrag nopan"
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelectEdge?.(isSelected ? null : id)
                    }}
                >
                    {isSelected && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete?.(id)
                            }}
                            style={{
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                fontWeight: "bold",
                                transition: "all 0.2s",
                            }}
                            title="Delete edge"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    )
}

export default EdgeWithDelete
