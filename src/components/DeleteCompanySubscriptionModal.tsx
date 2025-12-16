import { useState } from 'react';
import { X, AlertTriangle, Trash2, Loader2, CreditCard, Building2, Package } from 'lucide-react';
import { CompanySubscription } from '../services/api';

interface DeleteCompanySubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (subscriptionId: string) => Promise<void>;
  subscription: CompanySubscription | null;
  loading?: boolean;
}

export default function DeleteCompanySubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  subscription,
  loading = false
}: DeleteCompanySubscriptionModalProps) {
  const [confirmText, setConfirmText] = useState('');

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  const handleConfirm = async () => {
    if (!subscription) return;
    
    if (confirmText.toLowerCase() !== 'delete') {
      return;
    }

    try {
      await onConfirm(subscription._id);
      setConfirmText('');
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  if (!isOpen || !subscription) return null;

  const isConfirmValid = confirmText.toLowerCase() === 'delete';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Delete Subscription</h3>
                <p className="text-red-100 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
              disabled={loading}
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  Warning: Permanent Deletion
                </h4>
                <p className="text-sm text-red-700">
                  You are about to permanently delete this company subscription. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Subscription to be deleted:</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Building2 className="text-gray-400" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm font-semibold text-gray-900">{subscription.company.company_name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Package className="text-gray-400" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Plan</p>
                  <p className="text-sm font-semibold text-gray-900">{subscription.plan.planName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CreditCard className="text-gray-400" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{subscription.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Type <span className="text-red-600 font-bold">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 ${
                confirmText && !isConfirmValid 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              disabled={loading}
            />
            {confirmText && !isConfirmValid && (
              <p className="text-red-500 text-sm flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                Please type "DELETE" exactly to confirm
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isConfirmValid || loading}
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Delete Subscription</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

