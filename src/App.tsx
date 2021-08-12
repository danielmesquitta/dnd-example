import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DnDContainer } from './components/DnD';

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DnDContainer />
    </DndProvider>
  );
};

export default App;
