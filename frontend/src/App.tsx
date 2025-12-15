import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DriverDashboard from './features/driver/DriverDashboard.tsx';
import UserLogin from './pages/UserLogin';
import DriverSignup from './pages/DriverSignup';
import DriverLogin from './pages/DriverLogin';
import PartnerLoginSignUP from './pages/PartnerLoginSignUP';
import VerificationPage from './pages/VerificationPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<HomePage />} />

        {/* User authentication (login + signup tabs on same page) */}
        <Route path="/user/login" element={<UserLogin />} />

        {/* Driver / partner area */}
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/signup" element={<DriverSignup />} />
        <Route path="/driver/verification" element={<VerificationPage />} />
        <Route path="/partner" element={<PartnerLoginSignUP />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;