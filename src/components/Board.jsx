import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import Column from './Column';
import AddColumn from './AddColumn';
import Card from './Card';
import './Board.css';

export default function Board() {
  const { boardData, moveCard } = useKanban();
  const [activeCard, setActiveCard] = useState(null);

  function handleDragStart(event) {
    const { active } = event;
    setActiveCard(active.data.current?.card);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Encontrar coluna e índice de origem
    let sourceColumnId = null;
    let sourceIndex = -1;
    boardData.columns.forEach((col) => {
      const idx = col.cards.findIndex((card) => card.id === activeId);
      if (idx !== -1) {
        sourceColumnId = col.id;
        sourceIndex = idx;
      }
    });

    // Encontrar coluna e índice de destino
    let destColumnId = null;
    let destIndex = 0;

    if (overId.startsWith('col-')) {
      destColumnId = overId;
      const col = boardData.columns.find((c) => c.id === overId);
      destIndex = col?.cards.length || 0;
    } else {
      boardData.columns.forEach((col) => {
        const idx = col.cards.findIndex((card) => card.id === overId);
        if (idx !== -1) {
          destColumnId = col.id;
          destIndex = idx;
        }
      });
    }

    if (sourceColumnId && destColumnId && sourceIndex !== -1) {
      moveCard(sourceColumnId, destColumnId, sourceIndex, destIndex);
    }
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        <div className="board-header">
          <h1>📋 Kanban Board</h1>
          <p className="board-subtitle">Gerencie suas tarefas com estilo</p>
        </div>
        
        <div className="board-content">
          <SortableContext
            items={boardData.columns.map((col) => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="columns-container">
              {boardData.columns.map((column) => (
                <Column key={column.id} column={column} />
              ))}
              <AddColumn />
            </div>
          </SortableContext>
        </div>
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="card-overlay">
            <Card card={activeCard} columnId="" isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
