import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { DonationsPage } from './pages/DonationsPage';
import { NGOsPage } from './pages/NGOsPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { DeliveriesPage } from './pages/DeliveriesPage';
import { AIMatchingPage } from './pages/AIMatchingPage';
import { RescueSimulatorPage } from './pages/RescueSimulatorPage';
import { MapViewPage } from './pages/MapViewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard and Core Feature Pages */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/donations" element={<DonationsPage />} />
              <Route path="/ngos" element={<NGOsPage />} />
              <Route path="/volunteers" element={<VolunteersPage />} />
              <Route path="/deliveries" element={<DeliveriesPage />} />
              <Route path="/ai-matching" element={<AIMatchingPage />} />
              <Route path="/simulator" element={<RescueSimulatorPage />} />
              <Route path="/map" element={<MapViewPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
