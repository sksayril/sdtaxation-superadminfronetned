import React from 'react';
import Notification, { NotificationData } from './Notification';

interface NotificationContainerProps {
  notifications: NotificationData[];
  onClose: (id: string) => void;
}

export default function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
