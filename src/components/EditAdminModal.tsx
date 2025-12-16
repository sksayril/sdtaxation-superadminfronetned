import { useState, useEffect } from 'react';
import { X, UserCheck, Mail, Phone, MapPin, Building2, Loader2, User, Shield, Briefcase } from 'lucide-react';
import { Admin, Company, UpdateAdminRequest } from '../services/api';

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (adminId: string, adminData: UpdateAdminRequest) => Promise<void>;
  admin: Admin | null;
  companies: Company[];
  loading?: boolean;
}

export default function EditAdminModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  admin,
  companies,
  loading = false 
}: EditAdminModalProps) {
  const [formData, setFormData] = useState<UpdateAdminRequest>({
    fullname: '',
    username: '',
    email: '',
    role: 'Admin',
    phone: '',
    department: '',
    adminArea: '',
    company: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or admin changes
  useEffect(() => {
    if (isOpen && admin) {
      const department = admin.department || '';
      setFormData({
        fullname: admin.fullname || '',
        username: admin.username || '',
        email: admin.email || '',
        role: department || admin.role || 'Admin', // Set role from department
        phone: admin.phone || '',
        department: department,
        adminArea: admin.adminArea || '',
        company: admin.company?._id || ''
      });
      setErrors({});
    }
  }, [isOpen, admin]);

  const handleInputChange = (field: keyof UpdateAdminRequest, value: string) => {
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

    if (!formData.fullname?.trim()) {
      newErrors.fullname = 'Full name is required';
    }

    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.department?.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.adminArea?.trim()) {
      newErrors.adminArea = 'Admin area is required';
    }

    if (!formData.company?.trim()) {
      newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!admin) return;
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(admin._id, formData);
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl sm:max-w-3xl lg:max-w-4xl w-full max-h-[90vh] sm:max-h-[95vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <UserCheck className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">
                  Edit Admin
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm">
                  {admin.fullname}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 group"
              disabled={loading}
            >
              <X size={20} className="text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <User className="text-blue-600" size={16} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.fullname || ''}
                    onChange={(e) => handleInputChange('fullname', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                      errors.fullname ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter full name"
                    disabled={loading}
                  />
                  {errors.fullname && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.fullname}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                      errors.username ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter username"
                    disabled={loading}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Mail className="inline mr-2" size={16} />
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="admin@company.com"
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Phone className="inline mr-2" size={16} />
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                      errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="+919812345678"
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Briefcase className="text-green-600" size={16} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Work Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Shield className="inline mr-2" size={16} />
                  Department *
                </label>
                <div className="relative">
                  <select
                    value={formData.department || ''}
                    onChange={(e) => {
                      const deptValue = e.target.value;
                      handleInputChange('department', deptValue);
                      // Also set role to the same value
                      handleInputChange('role', deptValue);
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 appearance-none bg-white cursor-pointer ${
                      errors.department ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select Department</option>
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Manager">Manager</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Finance">Finance</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Executive">Executive</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
                  </div>
                </div>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.department}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <MapPin className="inline mr-2" size={16} />
                  Admin Area *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.adminArea || ''}
                    onChange={(e) => handleInputChange('adminArea', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                      errors.adminArea ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Bangalore"
                    disabled={loading}
                  />
                  {errors.adminArea && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.adminArea}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Building2 className="inline mr-2" size={16} />
                  Company *
                </label>
                <div className="relative">
                  <select
                    value={formData.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                      errors.company ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <UserCheck size={16} />
                  <span>Update Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
