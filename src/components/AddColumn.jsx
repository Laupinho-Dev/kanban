import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import './AddColumn.css';

export default function AddColumn() {
  const { addColumn } = useKanban();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addColumn(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setTitle('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <form className="add-column-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nome da coluna"
          className="add-column-input"
          autoFocus
        />
        <div className="add-column-actions">
          <button type="submit" className="btn-add">
            Adicionar
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setTitle('');
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
    <button className="add-column-btn" onClick={() => setIsAdding(true)}>
      + Adicionar Coluna
    </button>
  );
}
