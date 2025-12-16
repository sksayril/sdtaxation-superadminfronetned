import { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, Calendar } from 'lucide-react';
import { CompanySubscription, UpdateSubscriptionRequest } from '../services/api';

interface EditCompanySubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subscriptionId: string, subscriptionData: UpdateSubscriptionRequest) => Promise<void>;
  subscription: CompanySubscription | null;
  loading?: boolean;
}

export default function EditCompanySubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
  subscription,
  loading = false
}: EditCompanySubscriptionModalProps) {
  const [formData, setFormData] = useState<UpdateSubscriptionRequest>({
    endDate: '',
    status: 'active',
    autoRenew: false,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or subscription changes
  useEffect(() => {
    if (isOpen && subscription) {
      setFormData({
        endDate: subscription.endDate ? new Date(subscription.endDate).toISOString().split('T')[0] : '',
        status: subscription.status || 'active',
        autoRenew: subscription.autoRenew || false,
        notes: subscription.notes || ''
      });
      setErrors({});
    }
  }, [isOpen, subscription]);

  const handleInputChange = (field: keyof UpdateSubscriptionRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.endDate && subscription?.startDate) {
      const start = new Date(subscription.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscription) return;
    
    if (!validateForm()) {
      return;
    }

    try {
      const updateData: UpdateSubscriptionRequest = {
        ...formData,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      };
      await onSubmit(subscription._id, updateData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <CreditCard className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Edit Subscription</h3>
                <p className="text-blue-100 text-sm">{subscription.company.company_name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
              disabled={loading}
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subscription Info (Read-only) */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Company:</span>
              <span className="text-sm font-semibold text-gray-900">{subscription.company.company_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Plan:</span>
              <span className="text-sm font-semibold text-gray-900">{subscription.plan.planName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Start Date:</span>
              <span className="text-sm font-semibold text-gray-900">
                {new Date(subscription.startDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.endDate ? 'border-red-300' : 'border-gray-300'
              }`}
              min={subscription.startDate ? new Date(subscription.startDate).toISOString().split('T')[0] : undefined}
              disabled={loading}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Auto Renew */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoRenew"
              checked={formData.autoRenew}
              onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="autoRenew" className="text-sm font-semibold text-gray-700">
              Auto Renew Subscription
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.notes ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Additional notes about this subscription..."
              rows={3}
              disabled={loading}
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.notes?.length || 0}/500 characters
            </p>
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  <span>Update Subscription</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

