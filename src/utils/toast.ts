// Enhanced toast utility with notification system
let notificationContext: any = null;

// Function to set the notification context (called from App.tsx)
export const setNotificationContext = (context: any) => {
  notificationContext = context;
};

export const toast = {
  success: (message: string, title: string = 'Success!') => {
    console.log('✅ Success:', message);
    if (notificationContext) {
      notificationContext.showSuccess(title, message);
    } else {
      // Fallback to alert if context not available
      alert(`✅ ${title}: ${message}`);
    }
  },
  error: (message: string, title: string = 'Error!') => {
    console.error('❌ Error:', message);
    if (notificationContext) {
      notificationContext.showError(title, message);
    } else {
      // Fallback to alert if context not available
      alert(`❌ ${title}: ${message}`);
    }
  },
  warning: (message: string, title: string = 'Warning!') => {
    console.warn('⚠️ Warning:', message);
    if (notificationContext) {
      notificationContext.showWarning(title, message);
    } else {
      // Fallback to alert if context not available
      alert(`⚠️ ${title}: ${message}`);
    }
  },
  info: (message: string, title: string = 'Info') => {
    console.info('ℹ️ Info:', message);
    if (notificationContext) {
      notificationContext.showInfo(title, message);
    } else {
      // Fallback to alert if context not available
      alert(`ℹ️ ${title}: ${message}`);
    }
  }
};
