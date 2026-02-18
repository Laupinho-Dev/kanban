import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import './Card.css';

const priorityColors = {
  low: { bg: '#dcfce7', text: '#166534', label: 'Baixa' },
  medium: { bg: '#fef9c3', text: '#854d0e', label: 'Média' },
  high: { bg: '#fee2e2', text: '#991b1b', label: 'Alta' },
};

export default function Card({ card, columnId, isOverlay = false }) {
  const { deleteCard, updateCard } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: card.title,
    description: card.description || '',
    priority: card.priority || 'medium',
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { card },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editData.title.trim()) {
      updateCard(columnId, card.id, editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: card.title,
      description: card.description || '',
      priority: card.priority || 'medium',
    });
    setIsEditing(false);
  };

  const priority = priorityColors[card.priority] || priorityColors.medium;

  if (isOverlay) {
    return (
      <div className="card card-overlay" style={{ transform: 'rotate(3deg)' }}>
        <div className="card-priority" style={{ backgroundColor: priority.bg, color: priority.text }}>
          {priority.label}
        </div>
        <h4 className="card-title">{card.title}</h4>
        {card.description && <p className="card-description">{card.description}</p>}
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="card card-editing" ref={setNodeRef} style={style}>
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="card-title-input"
          placeholder="Título"
        />
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="card-description-input"
          placeholder="Descrição (opcional)"
          rows={3}
        />
        <select
          value={editData.priority}
          onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
          className="card-priority-select"
        >
          <option value="low">Baixa Prioridade</option>
          <option value="medium">Média Prioridade</option>
          <option value="high">Alta Prioridade</option>
        </select>
        <div className="card-edit-actions">
          <button className="btn-save" onClick={handleSave}>
            Salvar
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card ${isDragging ? 'card-dragging' : ''}`}
      {...attributes}
    >
      <div className="card-header" {...listeners}>
        <div className="card-priority" style={{ backgroundColor: priority.bg, color: priority.text }}>
          {priority.label}
        </div>
        <div className="card-actions">
          <button className="edit-card-btn" onClick={() => setIsEditing(true)} title="Editar">
            ✏️
          </button>
          <button className="delete-card-btn" onClick={() => deleteCard(columnId, card.id)} title="Excluir">
            🗑️
          </button>
        </div>
      </div>
      <h4 className="card-title">{card.title}</h4>
      {card.description && <p className="card-description">{card.description}</p>}
      <div className="card-footer">
        <span className="card-date">
          {new Date(card.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
