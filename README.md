# Frontend Developer Test — React + TypeScript

A fully functional implementation of both questions from the frontend developer assessment.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📦 Build

```bash
npm run build
```

---

## Question 1 — Tree View Component

### Features Implemented

| Feature | Status |
|---|---|
| Expand / Collapse Nodes | ✅ Animated chevron toggle |
| Add New Node | ✅ Inline text field for any parent |
| Add Root Node | ✅ Header button |
| Remove Node | ✅ With 3-second confirmation |
| Drag & Drop Reorder | ✅ HTML5 DnD — same level + cross-parent |
| Lazy Loading | ✅ Async `fetchChildren()` simulation with spinner |
| Inline Edit | ✅ Double-click label or edit icon |
| Clean UI | ✅ Dark themed, depth-colored avatars |

### Data Model

```ts
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];     // undefined = not yet loaded (lazy)
  isLoading?: boolean;
  hasChildren?: boolean;     // hint for lazy loading
}
```

### Key Design Decisions

- **Lazy Loading**: `children === undefined` signals "not yet fetched". On first expand, `fetchChildren(id)` is called (simulated 600–1000ms async delay), then the result is stored in state.
- **Drag & Drop**: Uses native HTML5 DnD API. Nodes reorder or reparent when dropped on a sibling/cousin.
- **State**: Single `nodes: TreeNode[]` state in parent `TreeView`, recursively updated via helper functions.

---

## Question 2 — Kanban Board Component

### Features Implemented

| Feature | Status |
|---|---|
| Three default columns (Todo/In Progress/Done) | ✅ |
| Add Card to any column | ✅ Inline textarea input |
| Delete Card | ✅ With 2.5s confirmation |
| Drag & Drop cards between columns | ✅ HTML5 DnD |
| Card order preserved per column | ✅ Insert at drop target position |
| Inline edit card title | ✅ Double-click or edit icon |
| Responsive layout | ✅ Stacks vertically on mobile |

### Data Model

```ts
interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
}

interface KanbanColumn {
  id: ColumnId;
  title: string;
  color: string;
  cards: KanbanCard[];
}
```

### Component Structure

```
KanbanBoard
├── KanbanColumn (Todo)
│   ├── KanbanCard
│   └── KanbanCard
├── KanbanColumn (In Progress)
│   └── KanbanCard
└── KanbanColumn (Done)
    └── KanbanCard
```

---

## Tech Stack

- **React 18** + **TypeScript 5**
- **Vite** (build tool)
- **HTML5 Drag and Drop API** (no external DnD library needed)
- **DM Sans** + **DM Mono** fonts (Google Fonts)
- CSS custom properties for theming

## Project Structure

```
src/
├── components/
│   ├── TreeView/
│   │   ├── TreeView.tsx     # Root component, state management
│   │   ├── TreeNode.tsx     # Recursive node component
│   │   └── TreeView.css
│   └── KanbanBoard/
│       ├── KanbanBoard.tsx  # Root component, DnD state
│       ├── KanbanColumn.tsx # Column component
│       ├── KanbanCard.tsx   # Card component
│       ├── KanbanBoard.css
│       └── kanbanData.ts    # Mock data
├── hooks/
│   └── treeData.ts          # Mock data + lazy loading simulation
├── types/
│   └── index.ts             # Shared TypeScript interfaces
├── App.tsx
├── App.css
└── index.css
```
