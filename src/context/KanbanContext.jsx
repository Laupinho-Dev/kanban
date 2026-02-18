import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const KanbanContext = createContext();

const defaultData = {
  columns: [
    { id: 'col-1', title: 'A Fazer', cards: [] },
    { id: 'col-2', title: 'Em Progresso', cards: [] },
    { id: 'col-3', title: 'Concluído', cards: [] },
  ],
};

export function KanbanProvider({ children }) {
  const [boardData, setBoardData] = useState(() => {
    const saved = localStorage.getItem('kanban-board');
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem('kanban-board', JSON.stringify(boardData));
  }, [boardData]);

  const addColumn = (title) => {
    const newColumn = {
      id: `col-${uuidv4()}`,
      title,
      cards: [],
    };
    setBoardData((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));
  };

  const updateColumn = (columnId, title) => {
    setBoardData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, title } : col
      ),
    }));
  };

  const deleteColumn = (columnId) => {
    setBoardData((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
    }));
  };

  const addCard = (columnId, title, description = '', priority = 'medium') => {
    const newCard = {
      id: `card-${uuidv4()}`,
      title,
      description,
      priority,
      createdAt: new Date().toISOString(),
    };
    setBoardData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      ),
    }));
  };

  const updateCard = (columnId, cardId, updates) => {
    setBoardData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            }
          : col
      ),
    }));
  };

  const deleteCard = (columnId, cardId) => {
    setBoardData((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
          : col
      ),
    }));
  };

  const moveCard = (sourceColumnId, destColumnId, sourceIndex, destIndex) => {
    setBoardData((prev) => {
      const sourceColumn = prev.columns.find((c) => c.id === sourceColumnId);
      const card = sourceColumn.cards[sourceIndex];

      const newColumns = prev.columns.map((col) => {
        if (col.id === sourceColumnId && col.id === destColumnId) {
          const newCards = [...col.cards];
          newCards.splice(sourceIndex, 1);
          newCards.splice(destIndex, 0, card);
          return { ...col, cards: newCards };
        }
        if (col.id === sourceColumnId) {
          return { ...col, cards: col.cards.filter((_, i) => i !== sourceIndex) };
        }
        if (col.id === destColumnId) {
          const newCards = [...col.cards];
          newCards.splice(destIndex, 0, card);
          return { ...col, cards: newCards };
        }
        return col;
      });

      return { ...prev, columns: newColumns };
    });
  };

  const resetBoard = () => {
    setBoardData(defaultData);
  };

  return (
    <KanbanContext.Provider
      value={{
        boardData,
        addColumn,
        updateColumn,
        deleteColumn,
        addCard,
        updateCard,
        deleteCard,
        moveCard,
        resetBoard,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
