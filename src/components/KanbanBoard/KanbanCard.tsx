import React, { useState, useRef, useEffect } from 'react';
import { KanbanCard as KanbanCardType } from '../../types';

interface KanbanCardProps {
  card: KanbanCardType;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (card: KanbanCardType) => void;
}

const KanbanCardComponent: React.FC<KanbanCardProps> = ({ card, onUpdate, onDelete, onDragStart }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  const commitEdit = () => {
    if (editValue.trim()) onUpdate(card.id, editValue.trim());
    else setEditValue(card.title);
    setEditing(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(card.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  return (
    <div
      className="kanban-card"
      draggable={!editing}
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(card);
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      {editing ? (
        <textarea
          ref={textareaRef}
          className="kanban-card-edit"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
            if (e.key === 'Escape') { setEditValue(card.title); setEditing(false); }
          }}
          rows={2}
        />
      ) : (
        <>
          <div className="kanban-card-content">
            <p className="kanban-card-title" onDoubleClick={() => setEditing(true)} title="Double-click to edit">
              {card.title}
            </p>
            {card.description && (
              <p className="kanban-card-desc">{card.description}</p>
            )}
          </div>
          <div className="kanban-card-actions">
            <button
              className="kanban-card-btn edit"
              onClick={() => setEditing(true)}
              title="Edit"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M8 1.5l1.5 1.5L3.5 9H2V7.5L8 1.5z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className={`kanban-card-btn delete ${confirmDelete ? 'confirm' : ''}`}
              onClick={handleDeleteClick}
              title={confirmDelete ? 'Confirm delete' : 'Delete card'}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default KanbanCardComponent;
