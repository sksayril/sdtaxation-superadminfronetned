import { useState, useEffect } from 'react';
import { X, Building2, Loader2 } from 'lucide-react';
import { apiService, type CreateDepartmentRequest } from '../services/api';
import { toast } from '../utils/toast';

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  loading?: boolean;
}

export default function CreateDepartmentModal({
  isOpen,
  onClose,
  onSuccess,
  loading = false
}: CreateDepartmentModalProps) {
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    department_name: '',
    description: '',
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        department_name: '',
        description: '',
        status: 'active'
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof CreateDepartmentRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.department_name.trim()) {
      newErrors.department_name = 'Department name is required';
    } else if (formData.department_name.trim().length < 2) {
      newErrors.department_name = 'Department name must be at least 2 characters';
    } else if (formData.department_name.trim().length > 100) {
      newErrors.department_name = 'Department name must not exceed 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
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
      setCreating(true);
      const response = await apiService.createDepartment({
        department_name: formData.department_name.trim(),
        description: formData.description?.trim() || undefined,
        status: formData.status || 'active'
      });

      if (response.success) {
        toast.success(
          `Department "${response.data.department_name}" created successfully!`,
          '✅ Department Created'
        );
        onSuccess();
        onClose();
      } else {
        toast.error(
          response.message || 'Failed to create department',
          '❌ Creation Failed'
        );
      }
    } catch (error: any) {
      console.error('Error creating department:', error);
      toast.error(
        error?.message || 'Failed to create department. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Building2 className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Create New Department</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
              disabled={creating || loading}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Department Name *
              </label>
              <input
                type="text"
                value={formData.department_name}
                onChange={(e) => handleInputChange('department_name', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 ${
                  errors.department_name ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Enter department name"
                disabled={creating || loading}
                maxLength={100}
              />
              {errors.department_name && (
                <p className="text-red-500 text-sm mt-1">{errors.department_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Enter department description"
                disabled={creating || loading}
                rows={3}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {formData.description?.length || 0}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 appearance-none bg-white cursor-pointer"
                disabled={creating || loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200"
              disabled={creating || loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={creating || loading}
            >
              {creating || loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Building2 size={18} />
                  <span>Create Department</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
