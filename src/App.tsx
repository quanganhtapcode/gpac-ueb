import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GroupProvider } from './context/GroupContext';
import StartScreen from './components/StartScreen';
import RoomScreen from './components/RoomScreen';
import SummaryScreen from './components/SummaryScreen';

const App: React.FC = () => {
  return (
    <GroupProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/room/:groupId" element={<RoomScreen />} />
            <Route path="/room/:groupId/summary" element={<SummaryScreen />} />
          </Routes>
        </div>
      </Router>
    </GroupProvider>
  );
};

export default App;
