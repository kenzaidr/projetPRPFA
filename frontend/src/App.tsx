import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DriverDashboard from './features/driver/DriverDashboard.tsx';
import Ride from './features/driver/driveCustumor.jsx';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/ride" element={<Ride />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;