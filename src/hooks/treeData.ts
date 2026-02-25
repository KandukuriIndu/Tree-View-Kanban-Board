import { TreeNode } from '../types';

export const initialTreeData: TreeNode[] = [
  {
    id: 'node-1',
    label: 'Design System',
    hasChildren: true,
    children: undefined, // lazy loaded
  },
  {
    id: 'node-2',
    label: 'Frontend',
    hasChildren: true,
    children: undefined,
  },
  {
    id: 'node-3',
    label: 'Backend',
    hasChildren: true,
    children: undefined,
  },
  {
    id: 'node-4',
    label: 'Documentation',
    hasChildren: false,
    children: [],
  },
];

const mockChildrenMap: Record<string, TreeNode[]> = {
  'node-1': [
    { id: 'node-1-1', label: 'Colors', hasChildren: true, children: undefined },
    { id: 'node-1-2', label: 'Typography', hasChildren: false, children: [] },
    { id: 'node-1-3', label: 'Components', hasChildren: true, children: undefined },
  ],
  'node-2': [
    { id: 'node-2-1', label: 'React', hasChildren: true, children: undefined },
    { id: 'node-2-2', label: 'TypeScript', hasChildren: false, children: [] },
    { id: 'node-2-3', label: 'Vite', hasChildren: false, children: [] },
  ],
  'node-3': [
    { id: 'node-3-1', label: 'Node.js', hasChildren: false, children: [] },
    { id: 'node-3-2', label: 'Database', hasChildren: true, children: undefined },
  ],
  'node-1-1': [
    { id: 'node-1-1-1', label: 'Primary', hasChildren: false, children: [] },
    { id: 'node-1-1-2', label: 'Secondary', hasChildren: false, children: [] },
    { id: 'node-1-1-3', label: 'Neutral', hasChildren: false, children: [] },
  ],
  'node-1-3': [
    { id: 'node-1-3-1', label: 'Buttons', hasChildren: false, children: [] },
    { id: 'node-1-3-2', label: 'Inputs', hasChildren: false, children: [] },
    { id: 'node-1-3-3', label: 'Cards', hasChildren: false, children: [] },
  ],
  'node-2-1': [
    { id: 'node-2-1-1', label: 'Hooks', hasChildren: false, children: [] },
    { id: 'node-2-1-2', label: 'Context', hasChildren: false, children: [] },
  ],
  'node-3-2': [
    { id: 'node-3-2-1', label: 'PostgreSQL', hasChildren: false, children: [] },
    { id: 'node-3-2-2', label: 'Redis', hasChildren: false, children: [] },
  ],
};

// Simulates an API call with a delay
export async function fetchChildren(nodeId: string): Promise<TreeNode[]> {
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));
  return mockChildrenMap[nodeId] ?? [];
}
