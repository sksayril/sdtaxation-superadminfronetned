import { useState, useEffect } from 'react';
import { X, Package, Loader2, Plus, Trash2 } from 'lucide-react';
import { CreateSubscriptionPlanRequest } from '../services/api';

interface CreateSubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: CreateSubscriptionPlanRequest) => Promise<void>;
  loading?: boolean;
}

export default function CreateSubscriptionPlanModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: CreateSubscriptionPlanModalProps) {
  const [formData, setFormData] = useState<CreateSubscriptionPlanRequest>({
    planName: '',
    description: '',
    price: 0,
    currency: 'INR',
    duration: 1,
    features: [],
    maxEmployees: null,
    maxAdmins: 1,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newFeature, setNewFeature] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        planName: '',
        description: '',
        price: 0,
        currency: 'INR',
        duration: 1,
        features: [],
        maxEmployees: null,
        maxAdmins: 1,
        isActive: true
      });
      setErrors({});
      setNewFeature('');
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof CreateSubscriptionPlanRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.planName.trim()) {
      newErrors.planName = 'Plan name is required';
    } else if (formData.planName.length < 2 || formData.planName.length > 100) {
      newErrors.planName = 'Plan name must be between 2 and 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.currency && formData.currency.length !== 3) {
      newErrors.currency = 'Currency must be 3 characters (e.g., INR, USD)';
    }

    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 month';
    }

    if (formData.maxEmployees !== null && formData.maxEmployees < 1) {
      newErrors.maxEmployees = 'Max employees must be at least 1 or null for unlimited';
    }

    if (formData.maxAdmins && formData.maxAdmins < 1) {
      newErrors.maxAdmins = 'Max admins must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Create Subscription Plan</h3>
                <p className="text-green-100 text-sm">Add a new subscription plan</p>
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
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => handleInputChange('planName', e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.planName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Premium Plan"
                  disabled={loading}
                />
                {errors.planName && (
                  <p className="mt-1 text-sm text-red-600">{errors.planName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.currency ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Plan description..."
                rows={3}
                disabled={loading}
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description?.length || 0}/500 characters
              </p>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Pricing & Duration
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="9999"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (months) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 1)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.duration ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="12"
                  min="1"
                  disabled={loading}
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Limits
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Employees (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  value={formData.maxEmployees || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange('maxEmployees', value === '' ? null : parseInt(value) || null);
                  }}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.maxEmployees ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Unlimited"
                  min="1"
                  disabled={loading}
                />
                {errors.maxEmployees && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxEmployees}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Admins *
                </label>
                <input
                  type="number"
                  value={formData.maxAdmins}
                  onChange={(e) => handleInputChange('maxAdmins', parseInt(e.target.value) || 1)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.maxAdmins ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="5"
                  min="1"
                  disabled={loading}
                />
                {errors.maxAdmins && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxAdmins}</p>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Features
            </h4>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add a feature..."
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                <Plus size={20} />
              </button>
            </div>

            {formData.features && formData.features.length > 0 && (
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              disabled={loading}
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
              Active Plan
            </label>
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
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Package size={16} />
                  <span>Create Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

