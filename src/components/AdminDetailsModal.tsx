import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Building2, Shield, Calendar, Clock, UserCheck, Briefcase, Globe, Key, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Admin } from '../services/api';

interface AdminDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: Admin | null;
}

export default function AdminDetailsModal({ isOpen, onClose, admin }: AdminDetailsModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showOriginalPassword, setShowOriginalPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedOriginalPassword, setCopiedOriginalPassword] = useState(false);

  if (!isOpen || !admin) return null;

  // Copy password to clipboard
  const copyToClipboard = async (text: string, type: 'password' | 'originalPassword') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'password') {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      } else {
        setCopiedOriginalPassword(true);
        setTimeout(() => setCopiedOriginalPassword(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl max-h-[90vh] sm:max-h-[95vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <UserCheck className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">
                  Admin Details
                </h3>
                <p className="text-purple-100 text-xs sm:text-sm">
                  {admin.fullname}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 group"
            >
              <X size={20} className="text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Admin Profile Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-purple-100">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-md">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  {admin.fullname}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  @{admin.username}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                    admin.status === 'active' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {admin.status}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Role: {admin.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <User className="text-blue-600" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-400 flex-shrink-0" size={16} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-semibold text-sm text-gray-900 truncate">{admin.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-400 flex-shrink-0" size={16} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-semibold text-sm text-gray-900">{admin.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Key className="text-gray-400 flex-shrink-0" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Current Password</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono text-xs text-gray-900 truncate">
                        {showPassword ? admin.password : '••••••••'}
                      </p>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(admin.password, 'password')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        title="Copy password"
                      >
                        {copiedPassword ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Key className="text-gray-400 flex-shrink-0" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Original Password</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono text-xs text-gray-900 truncate">
                        {showOriginalPassword ? admin.originalPassword : '••••••••'}
                      </p>
                      <button
                        onClick={() => setShowOriginalPassword(!showOriginalPassword)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        title={showOriginalPassword ? 'Hide password' : 'Show password'}
                      >
                        {showOriginalPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(admin.originalPassword, 'originalPassword')}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        title="Copy password"
                      >
                        {copiedOriginalPassword ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Security Notice */}
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="text-yellow-600 mt-0.5 flex-shrink-0" size={14} />
                  <div>
                    <p className="text-xs text-yellow-800 font-medium">Security Notice</p>
                    <p className="text-xs text-yellow-700">
                      Passwords are for administrative purposes only.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Briefcase className="text-green-600" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Work Information</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="text-gray-400 flex-shrink-0" size={16} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="font-semibold text-sm text-gray-900">{admin.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Briefcase className="text-gray-400 flex-shrink-0" size={16} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-semibold text-sm text-gray-900">{admin.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-400 flex-shrink-0" size={16} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Admin Area</p>
                    <p className="font-semibold text-sm text-gray-900">{admin.adminArea}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <Building2 className="text-orange-600" size={16} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Company Information</h4>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
              {admin.company ? (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Building2 className="text-orange-600" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {admin.company.company_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {admin.company.company_email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Building2 className="text-orange-600" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-400 italic truncate">
                      No company assigned
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
              <div className="p-1.5 bg-indigo-100 rounded-lg">
                <Clock className="text-indigo-600" size={16} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Activity Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-400 flex-shrink-0" size={16} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Last Login</p>
                  <p className="font-semibold text-sm text-gray-900">{formatDate(admin.lastLogin)}</p>
                  <p className="text-xs text-gray-400">{formatRelativeTime(admin.lastLogin)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="text-gray-400 flex-shrink-0" size={16} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Account Created</p>
                  <p className="font-semibold text-sm text-gray-900">{formatDate(admin.createdAt)}</p>
                  <p className="text-xs text-gray-400">{formatRelativeTime(admin.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <Globe className="text-gray-600" size={16} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">System Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Admin ID</p>
                  <p className="font-mono text-xs text-gray-700 truncate">{admin._id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-semibold text-sm text-gray-900">{formatDate(admin.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
