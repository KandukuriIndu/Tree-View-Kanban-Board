// Tree View Types
export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  isLoading?: boolean;
  hasChildren?: boolean; // for lazy loading - indicates children exist but not loaded
}

// Kanban Types
export type ColumnId = 'todo' | 'inprogress' | 'done';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
}

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  color: string;
  cards: KanbanCard[];
}
