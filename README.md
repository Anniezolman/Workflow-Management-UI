This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Development Server
The project uses Next.js 15.5.6 with Turbopack for faster builds. Access the development server at `http://localhost:3000`.

## Architecture Overview

This is a **visual workflow builder** built with Next.js, React, and ReactFlow. Users can create, edit, and manage workflow diagrams with different node types and connections.

### Core Architecture Components

**ReactFlow Integration**: The app is built around ReactFlow for the visual canvas, providing drag-and-drop workflow creation with custom node types and edge handling.

**State Management Pattern**: Uses a custom hook-based architecture with local state management:
- `useWorkflowProject` - Project persistence and CRUD operations
- `useWorkflowHistory` - Undo/redo functionality with history management
- `useWorkflowOperations` - Edge creation, labeling, and import/export
- `useKeyboardShortcuts` - Keyboard navigation and shortcuts

**Storage Strategy**: Client-side storage using localStorage through `ProjectStorage.ts`. All workflow projects are persisted locally with no server backend.

### Node System Architecture

**Four Node Types**:
- `StartNode` - Workflow triggers (webhook, schedule, manual, event)
- `ActionNode` - Processing steps (enrichment, person, ai, api, transform)
- `DecisionNode` - Conditional branching with true/false paths
- `TerminalNode` - Output destinations (email, slack, crm, webhook)

**Node Data Structure**: Each node extends `BaseNodeData` with type-specific properties. All nodes support:
- Label and description editing
- Collapsible states
- Real-time updates via `onUpdate` callback

**Edge System**: Custom edge components with:
- Dynamic labeling based on source node (especially decision nodes)
- Color-coded paths (green for true, red for false)
- Delete confirmation dialogs
- Animated connections

### Component Structure

**Layout Components**:
- `WorkflowHeader` - Project navigation and title
- `WorkflowToolbar` - Node creation, undo/redo, import/export tools
- `WorkflowCanvasComponent` - Main ReactFlow canvas wrapper

**UI Framework**: Uses shadcn/ui components with Tailwind CSS and Radix UI primitives. Component configuration in `components.json` with New York style variant.

### Key Development Patterns

**TypeScript Integration**: Comprehensive type definitions in `src/types/workflow.ts` with type guards for runtime safety.

**Constants Architecture**: All hardcoded values (colors, node types, button configurations, etc.) are centralized in `src/config/constants.ts` with proper TypeScript typing. Constants are named with CAPITAL_LETTERS for easy identification.

**Hook Composition**: Complex state management split into focused custom hooks that compose together in the main `WorkflowCanvas` component.

**Map-Based Rendering**: UI components use `.map()` functions with constant arrays to reduce code duplication and make changes easier to maintain (e.g., WorkflowToolbar buttons).

**Event Handling**: Canvas mouse tracking for node positioning, keyboard shortcuts for power user workflows, and real-time edge label updates.

**Import/Export**: JSON-based workflow serialization for sharing and backup functionality.

## File Organization

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── canvas/            # ReactFlow canvas wrapper
│   ├── dialogs/           # Confirmation dialogs
│   ├── edges/             # Custom edge components
│   ├── layout/            # Page layout components
│   ├── modals/            # Edit modals for nodes
│   ├── nodes/             # Four node type implementations
│   ├── toolbar/           # Canvas toolbar
│   └── ui/                # shadcn/ui components
├── config/                # Application constants
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and storage
└── types/                 # TypeScript definitions
```

## Constants and Configuration

**Location**: `src/config/constants.ts`

**Key Constants**:
- `NODE_TYPES` - Array of available node types
- `NODE_COLORS` - Color mapping for each node type
- `EDGE_COLORS` - Color mapping for edge states
- `NODE_TOOLBAR_BUTTONS` - Toolbar button configurations with icons and styles
- `NODE_DEFAULTS` - Default data for new nodes
- `EDGE_STYLES` - Style objects for different edge types

**Naming Convention**: All constant arrays and objects use CAPITAL_LETTERS naming.

## Working with ReactFlow

When modifying the workflow canvas:
- Node types are registered in `WorkflowCanvas.tsx` nodeTypes object
- Edge creation logic is in `useWorkflowOperations.ts`
- Canvas positioning uses cursor tracking in `handleCanvasMouseMove`
- All ReactFlow state is synced with project storage
- Colors and styles should be imported from constants, not hardcoded