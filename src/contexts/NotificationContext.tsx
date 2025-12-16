import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NotificationData } from '../components/Notification';

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationData, 'id'>) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
  closeNotification: (id: string) => void;
  notifications: NotificationData[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = (notification: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationData = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // Default 5 seconds
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    showNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  };

  const showError = (title: string, message: string, duration?: number) => {
    showNotification({
      type: 'error',
      title,
      message,
      duration,
    });
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    showNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    showNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  };

  const closeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeNotification,
        notifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
