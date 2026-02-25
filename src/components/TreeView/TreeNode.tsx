import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TreeNode as TreeNodeType } from '../../types';
import { fetchChildren } from '../../hooks/treeData';
import './TreeView.css';

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  onUpdate: (id: string, updates: Partial<TreeNodeType>) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, label: string) => void;
  // DnD props
  draggingId: string | null;
  dragOverId: string | null;
  setDraggingId: (id: string | null) => void;
  setDragOverId: (id: string | null) => void;
  onDrop: (draggedId: string, targetId: string) => void;
}

const COLORS = ['#6c63ff', '#4ade80', '#f87171', '#fbbf24', '#22d3ee', '#fb923c'];
function colorForDepth(depth: number) {
  return COLORS[depth % COLORS.length];
}

function initials(label: string) {
  return label.trim().charAt(0).toUpperCase();
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node, depth, onUpdate, onDelete, onAddChild,
  draggingId, dragOverId, setDraggingId, setDragOverId, onDrop
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.label);
  const [addingChild, setAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editRef.current) editRef.current.focus();
  }, [editing]);

  useEffect(() => {
    if (addingChild && addRef.current) addRef.current.focus();
  }, [addingChild]);

  const handleToggle = useCallback(async () => {
    if (!expanded && node.hasChildren && node.children === undefined) {
      // lazy load
      onUpdate(node.id, { isLoading: true });
      const children = await fetchChildren(node.id);
      onUpdate(node.id, { children, isLoading: false });
    }
    setExpanded((e) => !e);
  }, [expanded, node, onUpdate]);

  const handleEditCommit = () => {
    if (editValue.trim()) onUpdate(node.id, { label: editValue.trim() });
    else setEditValue(node.label);
    setEditing(false);
  };

  const handleAddChild = () => {
    if (newChildName.trim()) {
      onAddChild(node.id, newChildName.trim());
      setNewChildName('');
      setAddingChild(false);
      if (!expanded) setExpanded(true);
    }
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(node.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const isDragging = draggingId === node.id;
  const isDragOver = dragOverId === node.id;
  const color = colorForDepth(depth);

  return (
    <div
      className={`tree-node-wrapper ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        setDraggingId(node.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={() => setDraggingId(null)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverId(node.id);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setDragOverId(null);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverId(null);
        if (draggingId && draggingId !== node.id) {
          onDrop(draggingId, node.id);
        }
      }}
    >
      <div className="tree-node" style={{ paddingLeft: depth * 24 }}>
        <div className="tree-node-inner">
          {/* Expand/collapse button */}
          <button
            className={`tree-expand-btn ${node.hasChildren === false && (!node.children || node.children.length === 0) ? 'leaf' : ''}`}
            onClick={handleToggle}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {node.isLoading ? (
              <span className="tree-spinner" />
            ) : (node.hasChildren || (node.children && node.children.length > 0)) ? (
              <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span className="tree-leaf-dot" />
            )}
          </button>

          {/* Avatar */}
          <div className="tree-avatar" style={{ background: color + '22', color }}>
            {initials(node.label)}
          </div>

          {/* Label */}
          {editing ? (
            <input
              ref={editRef}
              className="tree-edit-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditCommit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditCommit();
                if (e.key === 'Escape') { setEditValue(node.label); setEditing(false); }
              }}
            />
          ) : (
            <span
              className="tree-label"
              onDoubleClick={() => setEditing(true)}
              title="Double-click to edit"
            >
              {node.label}
            </span>
          )}

          {/* Actions */}
          <div className="tree-actions">
            <button
              className="tree-action-btn"
              onClick={() => setAddingChild(true)}
              title="Add child"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <button
              className="tree-action-btn"
              onClick={() => setEditing(true)}
              title="Edit"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M9.5 1.5l2 2L4 11H2v-2L9.5 1.5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className={`tree-action-btn delete-btn ${confirmDelete ? 'confirm' : ''}`}
              onClick={handleDeleteClick}
              title={confirmDelete ? 'Click again to confirm delete' : 'Delete node'}
            >
              {confirmDelete ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 2l9 9M11 2L2 11" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 3.5h9M5 3.5V2.5h3v1M5.5 6v4M7.5 6v4M3 3.5l.5 7h6l.5-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Add child input */}
        {addingChild && (
          <div className="tree-add-child" style={{ paddingLeft: (depth + 1) * 24 + 20 }}>
            <input
              ref={addRef}
              className="tree-edit-input"
              placeholder="Node name..."
              value={newChildName}
              onChange={(e) => setNewChildName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddChild();
                if (e.key === 'Escape') { setAddingChild(false); setNewChildName(''); }
              }}
            />
            <button className="tree-confirm-btn" onClick={handleAddChild}>Add</button>
            <button className="tree-cancel-btn" onClick={() => { setAddingChild(false); setNewChildName(''); }}>Cancel</button>
          </div>
        )}
      </div>

      {/* Children */}
      {expanded && node.children && node.children.length > 0 && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              depth={depth + 1}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
              draggingId={draggingId}
              dragOverId={dragOverId}
              setDraggingId={setDraggingId}
              setDragOverId={setDragOverId}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNodeComponent;
