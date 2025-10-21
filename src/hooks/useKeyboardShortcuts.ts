import { KeyboardShortcutsProps } from '@/types/workflow'
import { useEffect } from 'react'

export const useKeyboardShortcuts = ({
    onUndo,
    onRedo,
    onCopy,
    selectedNodesCount,
}: KeyboardShortcutsProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault()
                onUndo()
            }
            // Ctrl+Shift+Z or Ctrl+Y for redo
            if ((e.ctrlKey || e.metaKey) && ((e.key === "z" && e.shiftKey) || e.key === "y")) {
                e.preventDefault()
                onRedo()
            }
            // Ctrl+D for duplicate
            if ((e.ctrlKey || e.metaKey) && e.key === "d") {
                e.preventDefault()
                if (selectedNodesCount > 0) {
                    onCopy()
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onUndo, onRedo, onCopy, selectedNodesCount])
}