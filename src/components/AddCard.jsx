import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import './AddCard.css';

export default function AddCard({ columnId }) {
  const { addCard } = useKanban();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addCard(columnId, title.trim(), description.trim(), priority);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <form className="add-card-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Título do card"
          className="add-card-input"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          className="add-card-textarea"
          rows={2}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="add-card-priority"
        >
          <option value="low">Baixa Prioridade</option>
          <option value="medium">Média Prioridade</option>
          <option value="high">Alta Prioridade</option>
        </select>
        <div className="add-card-actions">
          <button type="submit" className="btn-add">
            Adicionar
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setTitle('');
              setDescription('');
              setPriority('medium');
              setIsAdding(false);
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <button className="add-card-btn" onClick={() => setIsAdding(true)}>
      + Adicionar Card
    </button>
  );
}
