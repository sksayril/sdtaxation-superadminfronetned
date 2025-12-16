import { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, Building2, Package, Calendar } from 'lucide-react';
import { AssignSubscriptionRequest, Company, SubscriptionPlan } from '../services/api';

interface AssignSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subscriptionData: AssignSubscriptionRequest) => Promise<void>;
  companies: Company[];
  plans: SubscriptionPlan[];
  loading?: boolean;
}

export default function AssignSubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
  companies,
  plans,
  loading = false
}: AssignSubscriptionModalProps) {
  const [formData, setFormData] = useState<AssignSubscriptionRequest>({
    company: '',
    plan: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    autoRenew: false,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        company: '',
        plan: '',
        startDate: today,
        endDate: '',
        autoRenew: false,
        notes: ''
      });
      setErrors({});
      setSelectedPlan(null);
    }
  }, [isOpen]);

  // Update end date when plan or start date changes
  useEffect(() => {
    if (selectedPlan && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + selectedPlan.duration);
      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [selectedPlan, formData.startDate]);

  // Update selected plan when plan dropdown changes
  useEffect(() => {
    if (formData.plan) {
      const plan = plans.find(p => p._id === formData.plan);
      setSelectedPlan(plan || null);
    } else {
      setSelectedPlan(null);
    }
  }, [formData.plan, plans]);

  const handleInputChange = (field: keyof AssignSubscriptionRequest, value: any) => {
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

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData.plan.trim()) {
      newErrors.plan = 'Subscription plan is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
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
    
    if (!validateForm()) {
      return;
    }

    try {
      // Convert dates to ISO format
      const subscriptionData: AssignSubscriptionRequest = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: new Date(formData.endDate).toISOString()
      };
      await onSubmit(subscriptionData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <CreditCard className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Assign Subscription</h3>
                <p className="text-purple-100 text-sm">Assign a subscription plan to a company</p>
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
          {/* Company Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="inline mr-2" size={16} />
              Company *
            </label>
            <select
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.company ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.company_name} - {company.company_email}
                </option>
              ))}
            </select>
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company}</p>
            )}
          </div>

          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Package className="inline mr-2" size={16} />
              Subscription Plan *
            </label>
            <select
              value={formData.plan}
              onChange={(e) => handleInputChange('plan', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.plan ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">Select Plan</option>
              {plans.filter(plan => plan.isActive).map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.planName} - {plan.currency || 'INR'} {plan.price.toLocaleString()} ({plan.duration} months)
                </option>
              ))}
            </select>
            {errors.plan && (
              <p className="mt-1 text-sm text-red-600">{errors.plan}</p>
            )}
            {selectedPlan && (
              <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Plan Details:</span> {selectedPlan.description || 'No description'}
                </p>
                {selectedPlan.features && selectedPlan.features.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Features: {selectedPlan.features.slice(0, 3).join(', ')}
                    {selectedPlan.features.length > 3 && ` +${selectedPlan.features.length - 3} more`}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline mr-2" size={16} />
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                }`}
                min={formData.startDate}
                disabled={loading}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Auto Renew */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoRenew"
              checked={formData.autoRenew}
              onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
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
              className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  <span>Assign Subscription</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

