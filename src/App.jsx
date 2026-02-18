import Board from './components/Board';
import { KanbanProvider } from './context/KanbanContext';

function App() {
  return (
    <KanbanProvider>
      <Board />
    </KanbanProvider>
  );
}

export default App;
