import React, { useState, useCallback } from 'react';
import { TreeNode as TreeNodeType } from '../../types';
import { initialTreeData } from '../../hooks/treeData';
import TreeNodeComponent from './TreeNode';
import './TreeView.css';

let idCounter = 1000;
function genId() { return `node-custom-${++idCounter}`; }

function updateNodeInTree(
  nodes: TreeNodeType[],
  id: string,
  updates: Partial<TreeNodeType>
): TreeNodeType[] {
  return nodes.map((node) => {
    if (node.id === id) return { ...node, ...updates };
    if (node.children) {
      return { ...node, children: updateNodeInTree(node.children, id, updates) };
    }
    return node;
  });
}

function deleteNodeFromTree(nodes: TreeNodeType[], id: string): TreeNodeType[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: node.children ? deleteNodeFromTree(node.children, id) : node.children,
    }));
}

function addChildToTree(
  nodes: TreeNodeType[],
  parentId: string,
  newNode: TreeNodeType
): TreeNodeType[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      const children = [...(node.children ?? []), newNode];
      return { ...node, children, hasChildren: true };
    }
    if (node.children) {
      return { ...node, children: addChildToTree(node.children, parentId, newNode) };
    }
    return node;
  });
}

function moveNode(
  nodes: TreeNodeType[],
  draggedId: string,
  targetId: string
): TreeNodeType[] {
  // find dragged node
  let dragged: TreeNodeType | null = null;
  function findAndRemove(arr: TreeNodeType[]): TreeNodeType[] {
    return arr
      .filter((n) => {
        if (n.id === draggedId) { dragged = n; return false; }
        return true;
      })
      .map((n) => ({ ...n, children: n.children ? findAndRemove(n.children) : n.children }));
  }
  let result = findAndRemove(nodes);
  if (!dragged) return nodes;
  const d = dragged as TreeNodeType;

  function insertAfter(arr: TreeNodeType[]): TreeNodeType[] {
    const idx = arr.findIndex((n) => n.id === targetId);
    if (idx !== -1) {
      const updated = [...arr];
      updated.splice(idx + 1, 0, d);
      return updated;
    }
    return arr.map((n) => ({ ...n, children: n.children ? insertAfter(n.children) : n.children }));
  }
  return insertAfter(result);
}

const TreeView: React.FC = () => {
  const [nodes, setNodes] = useState<TreeNodeType[]>(initialTreeData);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [addingRoot, setAddingRoot] = useState(false);
  const [rootName, setRootName] = useState('');

  const handleUpdate = useCallback((id: string, updates: Partial<TreeNodeType>) => {
    setNodes((prev) => updateNodeInTree(prev, id, updates));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNodes((prev) => deleteNodeFromTree(prev, id));
  }, []);

  const handleAddChild = useCallback((parentId: string, label: string) => {
    const newNode: TreeNodeType = { id: genId(), label, hasChildren: false, children: [] };
    setNodes((prev) => addChildToTree(prev, parentId, newNode));
  }, []);

  const handleDrop = useCallback((draggedId: string, targetId: string) => {
    setNodes((prev) => moveNode(prev, draggedId, targetId));
  }, []);

  const handleAddRoot = () => {
    if (rootName.trim()) {
      setNodes((prev) => [...prev, { id: genId(), label: rootName.trim(), hasChildren: false, children: [] }]);
      setRootName('');
      setAddingRoot(false);
    }
  };

  return (
    <div className="treeview-container">
      <div className="treeview-header">
        <h2 className="treeview-title">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginRight: 8 }}>
            <rect x="1" y="1" width="5" height="5" rx="1.5" stroke="var(--accent)" strokeWidth="1.5"/>
            <rect x="7" y="7" width="5" height="5" rx="1.5" stroke="var(--green)" strokeWidth="1.5"/>
            <rect x="7" y="1" width="5" height="5" rx="1.5" stroke="var(--cyan)" strokeWidth="1.5"/>
            <path d="M6 3.5h1M6 9.5h1M8.5 6v1" stroke="var(--text-muted)" strokeWidth="1.2"/>
          </svg>
          Tree View
        </h2>
        <button className="treeview-add-root-btn" onClick={() => setAddingRoot(true)}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Add Root
        </button>
      </div>

      <div className="treeview-hint">
        <span>💡</span> Double-click label to edit · Drag to reorder · Click <strong>+</strong> to add children
      </div>

      {addingRoot && (
        <div className="tree-add-root-row">
          <input
            autoFocus
            placeholder="Root node name..."
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddRoot();
              if (e.key === 'Escape') { setAddingRoot(false); setRootName(''); }
            }}
          />
          <button className="tree-confirm-btn" onClick={handleAddRoot}>Add</button>
          <button className="tree-cancel-btn" onClick={() => { setAddingRoot(false); setRootName(''); }}>Cancel</button>
        </div>
      )}

      <div className="treeview-body">
        {nodes.length === 0 ? (
          <div className="treeview-empty">No nodes yet. Add a root node to get started.</div>
        ) : (
          nodes.map((node) => (
            <TreeNodeComponent
              key={node.id}
              node={node}
              depth={0}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAddChild={handleAddChild}
              draggingId={draggingId}
              dragOverId={dragOverId}
              setDraggingId={setDraggingId}
              setDragOverId={setDragOverId}
              onDrop={handleDrop}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TreeView;
