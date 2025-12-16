import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export default function NotificationDemo() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleSuccess = () => {
    showSuccess(
      'Company created successfully!',
      '🎉 Success!',
      4000
    );
  };

  const handleError = () => {
    showError(
      'Failed to create company. Please try again.',
      '❌ Creation Failed',
      6000
    );
  };

  const handleWarning = () => {
    showWarning(
      'Please check your internet connection.',
      '⚠️ Network Warning',
      5000
    );
  };

  const handleInfo = () => {
    showInfo(
      'Your session will expire in 5 minutes.',
      'ℹ️ Session Info',
      7000
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Demo</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleSuccess}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle size={16} />
          <span>Success</span>
        </button>
        
        <button
          onClick={handleError}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <XCircle size={16} />
          <span>Error</span>
        </button>
        
        <button
          onClick={handleWarning}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <AlertTriangle size={16} />
          <span>Warning</span>
        </button>
        
        <button
          onClick={handleInfo}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Info size={16} />
          <span>Info</span>
        </button>
      </div>
    </div>
  );
}
