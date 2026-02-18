import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import Card from './Card';
import AddCard from './AddCard';
import './Column.css';

export default function Column({ column }) {
  const { deleteColumn, updateColumn } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const { isOver } = useDroppable({ id: column.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTitleSubmit = () => {
    if (editTitle.trim()) {
      updateColumn(column.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`column ${isOver ? 'column-over' : ''} ${isDragging ? 'column-dragging' : ''}`}
    >
      <div className="column-header" {...attributes} {...listeners}>
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyDown}
            className="column-title-input"
            autoFocus
          />
        ) : (
          <h3
            className="column-title"
            onDoubleClick={() => setIsEditing(true)}
            title="Duplo clique para editar"
          >
            {column.title}
          </h3>
        )}
        <div className="column-actions">
          <span className="card-count">{column.cards.length}</span>
          <button
            className="delete-column-btn"
            onClick={() => deleteColumn(column.id)}
            title="Excluir coluna"
          >
            ×
          </button>
        </div>
      </div>

      <div className="column-content">
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="cards-container">
            {column.cards.map((card, index) => (
              <Card key={card.id} card={card} columnId={column.id} index={index} />
            ))}
          </div>
        </SortableContext>
        <AddCard columnId={column.id} />
      </div>
    </div>
  );
}
