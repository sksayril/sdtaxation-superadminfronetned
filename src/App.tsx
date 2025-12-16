import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import NotificationContainer from './components/NotificationContainer';
import { setNotificationContext } from './utils/toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Company from './pages/Company';
import AdminManagement from './pages/AdminManagement';
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
import SubscriptionPlans from './pages/SubscriptionPlans';
import CompanySubscriptions from './pages/CompanySubscriptions';
import { Loader2 } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="text-center">
        <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
  const { notifications, closeNotification, showSuccess, showError, showWarning, showInfo } = useNotification();

  // Set the notification context for the toast utility
  useEffect(() => {
    setNotificationContext({ 
      showSuccess,
      showError,
      showWarning,
      showInfo
    });
  }, [showSuccess, showError, showWarning, showInfo]);

  return (
    <>
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
          <Route path="/admin-management" element={
            <ProtectedRoute>
              <AdminManagement />
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
          <Route path="/subscription-plans" element={
            <ProtectedRoute>
              <SubscriptionPlans />
            </ProtectedRoute>
          } />
          <Route path="/company-subscriptions" element={
            <ProtectedRoute>
              <CompanySubscriptions />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <NotificationContainer 
        notifications={notifications} 
        onClose={closeNotification} 
      />
    </>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;