import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export default function LogoutConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName 
}: LogoutConfirmationProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="text-orange-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Logout
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            {userName 
              ? `Are you sure you want to logout, ${userName}?`
              : 'Are you sure you want to logout?'
            }
          </p>
          <p className="text-sm text-gray-500">
            You will need to sign in again to access your account.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
