import { CheckCircle2, Copy, Database, Download, GitBranch, Rocket, RotateCcw, RotateCw, Trash2, Upload } from 'lucide-react'
import { NodeType } from '@/types/workflow'

// Node Types
export const NODE_TYPES: NodeType[] = ['start', 'action', 'decision', 'terminal'] as const

// Colors
export const NODE_COLORS = {
  start: '#10b981',    // emerald-500
  action: '#0ea5e9',   // sky-500
  decision: '#f59e0b', // amber-500
  terminal: '#64748b', // slate-500
  default: '#94a3b8',  // slate-400
} as const

export const EDGE_COLORS = {
  default: '#0ea5e9',  // sky-500
  true: '#10b981',     // emerald-500 
  false: '#ef4444',    // red-500
} as const

// Toolbar Button Configurations
export const NODE_TOOLBAR_BUTTONS = [
  {
    type: 'start' as NodeType,
    label: 'Start',
    icon: Rocket,
    className: 'px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md flex items-center gap-2 text-sm font-medium transition-colors',
  },
  {
    type: 'action' as NodeType,
    label: 'Action', 
    icon: Database,
    className: 'px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-md flex items-center gap-2 text-sm font-medium transition-colors',
  },
  {
    type: 'decision' as NodeType,
    label: 'Decision',
    icon: GitBranch, 
    className: 'px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-md flex items-center gap-2 text-sm font-medium transition-colors',
  },
  {
    type: 'terminal' as NodeType,
    label: 'Terminal',
    icon: CheckCircle2,
    className: 'px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md flex items-center gap-2 text-sm font-medium transition-colors',
  },
] as const

export const HISTORY_TOOLBAR_BUTTONS = [
  {
    action: 'undo' as const,
    label: 'Undo',
    icon: RotateCcw,
    title: 'Undo (Ctrl+Z)',
  },
  {
    action: 'redo' as const,
    label: 'Redo',
    icon: RotateCw,
    title: 'Redo (Ctrl+Shift+Z)',
  },
] as const

export const SELECTION_TOOLBAR_BUTTONS = [
  {
    action: 'copy' as const,
    label: 'Copy',
    icon: Copy,
    title: 'Duplicate (Ctrl+D)',
    className: 'px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 text-sm font-medium transition-colors',
  },
  {
    action: 'delete' as const,
    label: 'Delete',
    icon: Trash2,
    title: 'Delete selected nodes',
    className: 'px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md flex items-center gap-2 text-sm font-medium transition-colors',
  },
] as const

export const IMPORT_EXPORT_TOOLBAR_BUTTONS = [
  {
    action: 'import' as const,
    label: 'Import',
    icon: Upload,
  },
  {
    action: 'export' as const,
    label: 'Export', 
    icon: Download,
  },
] as const

// Template Icons
export const TEMPLATE_ICONS = {
  Rocket: Rocket,
  Database: Database,
  GitBranch: GitBranch,
} as const

// Node Defaults
export const NODE_DEFAULTS = {
  start: {
    label: 'New Start',
    description: 'Trigger point',
    trigger: 'webhook' as const,
  },
  action: {
    label: 'New Action',
    description: 'Process data',
    actionType: 'enrichment' as const,
    collapsed: false,
  },
  decision: {
    label: 'New Decision',
    description: 'Conditional branch',
    condition: 'value > 0',
    trueLabel: 'Yes',
    falseLabel: 'No',
    collapsed: false,
  },
  terminal: {
    label: 'New Terminal',
    description: 'End point',
    output: 'email' as const,
  },
} as const

// Edge Styles
export const EDGE_STYLES = {
  default: {
    stroke: EDGE_COLORS.default,
    strokeWidth: 2,
  },
  true: {
    stroke: EDGE_COLORS.true,
    strokeWidth: 2,
  },
  false: {
    stroke: EDGE_COLORS.false,
    strokeWidth: 2,
  },
}

export const EDGE_LABEL_STYLES = {
  true: {
    fill: EDGE_COLORS.true,
    fontWeight: 600,
    fontSize: 12,
  },
  false: {
    fill: EDGE_COLORS.false,
    fontWeight: 600,
    fontSize: 12,
  },
}

export const EDGE_LABEL_BG_STYLES = {
  true: {
    fill: '#d1fae5', // emerald-100
    fillOpacity: 0.9,
  },
  false: {
    fill: '#fee2e2', // red-100
    fillOpacity: 0.9,
  },
}
