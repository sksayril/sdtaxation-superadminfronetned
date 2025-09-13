import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Company from './pages/Company';
import CRM from './pages/CRM';
import ERP from './pages/ERP';
import HRM from './pages/HRM';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import GST from './pages/GST';
import TDS from './pages/TDS';
import ITR from './pages/ITR';
import Profile from './pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/company" element={
            <ProtectedRoute>
              <Company />
            </ProtectedRoute>
          } />
          <Route path="/crm" element={
            <ProtectedRoute>
              <CRM />
            </ProtectedRoute>
          } />
          <Route path="/erp" element={
            <ProtectedRoute>
              <ERP />
            </ProtectedRoute>
          } />
          <Route path="/hrm" element={
            <ProtectedRoute>
              <HRM />
            </ProtectedRoute>
          } />
          <Route path="/payroll" element={
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/gst" element={
            <ProtectedRoute>
              <GST />
            </ProtectedRoute>
          } />
          <Route path="/tds" element={
            <ProtectedRoute>
              <TDS />
            </ProtectedRoute>
          } />
          <Route path="/itr" element={
            <ProtectedRoute>
              <ITR />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;