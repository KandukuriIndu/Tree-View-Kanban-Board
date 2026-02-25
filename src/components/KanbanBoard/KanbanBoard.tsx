import React, { useState, useCallback, useEffect, useRef } from 'react';
import { KanbanCard, KanbanColumn, ColumnId } from '../../types';
import { initialKanbanData, genCardId, loadFromStorage, saveToStorage, STORAGE_KEY } from './kanbanData';
import KanbanColumnComponent from './KanbanColumn';
import './KanbanBoard.css';

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(() => loadFromStorage());
  const [draggingCard, setDraggingCard] = useState<KanbanCard | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save to localStorage whenever columns change
  useEffect(() => {
    saveToStorage(columns);
    setSaved(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(false), 1500);
  }, [columns]);

  const handleAddCard = useCallback((columnId: string, title: string, description?: string) => {
    const newCard: KanbanCard = {
      id: genCardId(),
      title,
      description,
      columnId: columnId as ColumnId,
    };
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      )
    );
  }, []);

  const handleUpdateCard = useCallback((cardId: string, title: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === cardId ? { ...card, title } : card
        ),
      }))
    );
  }, []);

  const handleDeleteCard = useCallback((cardId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }))
    );
  }, []);

  const handleDrop = useCallback(
    (targetColumnId: string, targetCardId?: string) => {
      if (!draggingCard) return;
      if (draggingCard.columnId === targetColumnId && !targetCardId) {
        setDraggingCard(null);
        setDragOverColumnId(null);
        return;
      }

      setColumns((prev) => {
        const cardToMove = draggingCard;
        const withoutCard = prev.map((col) => ({
          ...col,
          cards: col.cards.filter((c) => c.id !== cardToMove.id),
        }));

        return withoutCard.map((col) => {
          if (col.id !== targetColumnId) return col;
          const updatedCard = { ...cardToMove, columnId: targetColumnId as ColumnId };
          if (!targetCardId) {
            return { ...col, cards: [...col.cards, updatedCard] };
          }
          const idx = col.cards.findIndex((c) => c.id === targetCardId);
          const cards = [...col.cards];
          cards.splice(idx, 0, updatedCard);
          return { ...col, cards };
        });
      });

      setDraggingCard(null);
      setDragOverColumnId(null);
    },
    [draggingCard]
  );

  const handleReset = () => {
    if (window.confirm('Reset board to default cards? All your changes will be lost.')) {
      localStorage.removeItem(STORAGE_KEY);
      setColumns(initialKanbanData);
    }
  };

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h2 className="kanban-title">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginRight: 8 }}>
            <rect x="1" y="1" width="4" height="16" rx="1.5" fill="#5b52f0" opacity="0.9"/>
            <rect x="7" y="1" width="4" height="11" rx="1.5" fill="#d97706" opacity="0.9"/>
            <rect x="13" y="1" width="4" height="7" rx="1.5" fill="#16a34a" opacity="0.9"/>
          </svg>
          Kanban Board
        </h2>
        <div className="kanban-header-right">
          <div className="kanban-stats">
            <span>{totalCards} cards</span>
            <span className="kanban-stat-sep">·</span>
            <span>{columns.length} columns</span>
          </div>
          <div className={`kanban-save-badge ${saved ? 'visible' : ''}`}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Saved
          </div>
          <button className="kanban-reset-btn" onClick={handleReset} title="Reset board">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11 6.5A4.5 4.5 0 1 1 6.5 2a4.5 4.5 0 0 1 3.18 1.32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M9 1.5l.68 1.82L11 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reset
          </button>
        </div>
      </div>

      <div className="kanban-hint">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
          <rect x="1" y="8" width="2.5" height="3" rx="0.5" fill="#5b52f0" opacity="0.7"/>
          <rect x="4.75" y="5" width="2.5" height="6" rx="0.5" fill="#d97706" opacity="0.7"/>
          <rect x="8.5" y="2" width="2.5" height="9" rx="0.5" fill="#16a34a" opacity="0.7"/>
        </svg>
        Drag cards between columns · Double-click to edit · <strong>+</strong> to add · Changes auto-saved to localStorage
      </div>

      <div
        className="kanban-board"
        onDragEnd={() => { setDraggingCard(null); setDragOverColumnId(null); }}
      >
        {columns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            onAddCard={handleAddCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
            onDragStart={setDraggingCard}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverColumnId(column.id);
            }}
            onDrop={handleDrop}
            isDragOver={dragOverColumnId === column.id}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
