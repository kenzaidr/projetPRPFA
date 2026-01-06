import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DriverDashboard from './features/driver/DriverDashboard.tsx';
import UserLogin from './pages/UserLogin';
import DriverSignup from './pages/DriverSignup';
import DriverLogin from './pages/DriverLogin';
import PartnerLoginSignUP from './pages/PartnerLoginSignUP';
import VerificationPage from './pages/VerificationPage';
import Restaurant from './features/restaurant/src/pages/Food.tsx';
import Ride from './features/driver/driveCustumor.tsx';
import RideBooking from './features/ride/ride.tsx';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/signup" element={<DriverSignup />} />
        <Route path="/driver/verification" element={<VerificationPage />} />
        <Route path="/partner" element={<PartnerLoginSignUP />} />
        <Route path="/ride" element={<Ride />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/ride/booking" element={<RideBooking />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;