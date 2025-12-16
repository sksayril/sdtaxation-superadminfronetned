import { useState, useEffect } from 'react';
import { X, UserCheck, Mail, Phone, MapPin, Building2, Loader2, Eye, EyeOff, User, Shield, Briefcase } from 'lucide-react';
import { CreateAdminRequest, Company } from '../services/api';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (adminData: CreateAdminRequest) => Promise<void>;
  companies: Company[];
  loading?: boolean;
}

export default function CreateAdminModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  companies,
  loading = false 
}: CreateAdminModalProps) {
  const [formData, setFormData] = useState<CreateAdminRequest>({
    fullname: '',
    username: '',
    email: '',
    role: 'Admin',
    password: '',
    originalPassword: '',
    phone: '',
    department: '',
    adminArea: '',
    company: companies.length > 0 ? companies[0]._id : ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullname: '',
        username: '',
        email: '',
        role: 'Admin',
        password: '',
        originalPassword: '',
        phone: '',
        department: '',
        adminArea: '',
        company: companies.length > 0 ? companies[0]._id : ''
      });
      setErrors({});
    }
  }, [isOpen, companies]);

  const handleInputChange = (field: keyof CreateAdminRequest, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Automatically set originalPassword to the same value as password
      if (field === 'password') {
        newData.originalPassword = value;
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.adminArea.trim()) {
      newErrors.adminArea = 'Admin area is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <UserCheck className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  Create New Admin
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  Add a new administrator to your system
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 group"
              disabled={loading}
            >
              <X size={24} className="text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="text-blue-600" size={20} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Personal Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => handleInputChange('fullname', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 ${
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
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Mail className="inline mr-2" size={16} />
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 ${
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
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 ${
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

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 ${
                    errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter secure password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="text-green-600" size={20} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Work Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Shield className="inline mr-2" size={16} />
                  Department *
                </label>
                <div className="relative">
                  <select
                    value={formData.department}
                    onChange={(e) => {
                      const deptValue = e.target.value;
                      handleInputChange('department', deptValue);
                      // Also set role to the same value
                      handleInputChange('role', deptValue);
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 appearance-none bg-white cursor-pointer ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <MapPin className="inline mr-2" size={16} />
                  Admin Area *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.adminArea}
                    onChange={(e) => handleInputChange('adminArea', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 ${
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
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 ${
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
          <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-transparent rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Creating Admin...</span>
                </>
              ) : (
                <>
                  <UserCheck size={18} />
                  <span>Create Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
