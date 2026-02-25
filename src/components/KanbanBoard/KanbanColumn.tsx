import React, { useState } from 'react';
import { KanbanColumn as KanbanColumnType, KanbanCard as KanbanCardType } from '../../types';
import KanbanCardComponent from './KanbanCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onAddCard: (columnId: string, title: string) => void;
  onUpdateCard: (cardId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDragStart: (card: KanbanCardType) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (columnId: string, targetCardId?: string) => void;
  isDragOver: boolean;
}

const KanbanColumnComponent: React.FC<KanbanColumnProps> = ({
  column, onAddCard, onUpdateCard, onDeleteCard,
  onDragStart, onDragOver, onDrop, isDragOver
}) => {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAddCard(column.id, newTitle.trim());
      setNewTitle('');
      setAdding(false);
    }
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDrop={(e) => { e.preventDefault(); onDrop(column.id); }}
    >
      <div className="kanban-column-header" style={{ borderTopColor: column.color }}>
        <div className="kanban-column-title-row">
          <h3 className="kanban-column-title" style={{ color: column.color }}>
            {column.title}
          </h3>
          <span className="kanban-column-count" style={{ background: column.color + '22', color: column.color }}>
            {column.cards.length}
          </span>
        </div>
        <button
          className="kanban-add-card-btn"
          onClick={() => setAdding(true)}
          title="Add card"
          style={{ color: column.color }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="kanban-column-body">
        {adding && (
          <div className="kanban-add-card-form">
            <textarea
              ref={inputRef}
              className="kanban-card-edit"
              placeholder="Card title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(); }
                if (e.key === 'Escape') { setAdding(false); setNewTitle(''); }
              }}
              rows={2}
            />
            <div className="kanban-add-card-actions">
              <button className="kanban-confirm-btn" onClick={handleAdd} style={{ background: column.color }}>
                Add Card
              </button>
              <button className="kanban-cancel-btn" onClick={() => { setAdding(false); setNewTitle(''); }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {column.cards.map((card) => (
          <div
            key={card.id}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDrop(column.id, card.id); }}
          >
            <KanbanCardComponent
              card={card}
              onUpdate={onUpdateCard}
              onDelete={onDeleteCard}
              onDragStart={onDragStart}
            />
          </div>
        ))}

        {column.cards.length === 0 && !adding && (
          <div className="kanban-empty-col">
            <span>Drop cards here</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumnComponent;
