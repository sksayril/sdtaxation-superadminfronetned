import { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface TokenExpiredModalProps {
  isOpen: boolean;
  onRedirect: () => void;
}

export default function TokenExpiredModal({ isOpen, onRedirect }: TokenExpiredModalProps) {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (isOpen) {
      // Countdown from 2 to 0
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onRedirect();
            // Use window.location for redirect since we're outside Router context
            window.location.href = '/login';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCountdown(2);
    }
  }, [isOpen, onRedirect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Session Expired</h3>
              <p className="text-red-100 text-sm">Your session has expired</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  Authentication Required
                </h4>
                <p className="text-sm text-red-700">
                  Your login session has expired for security reasons. Please log in again to continue.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Clock className="text-gray-400" size={16} />
            <span>Redirecting to login page in {countdown} second{countdown !== 1 ? 's' : ''}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

