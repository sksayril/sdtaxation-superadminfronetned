import { X, Building2, Mail, Phone, MapPin, Globe, Calendar, User, Loader2 } from 'lucide-react';
import { Company } from '../services/api';

interface CompanyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  loading?: boolean;
}

export default function CompanyDetailsModal({ 
  isOpen, 
  onClose, 
  company, 
  loading = false 
}: CompanyDetailsModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Company Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
                <p className="text-gray-600">Loading company details...</p>
              </div>
            </div>
          ) : company ? (
            <div className="space-y-6">
              {/* Company Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="mr-2" size={20} />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <p className="text-gray-900 font-medium">{company.company_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {company.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Mail className="mr-1" size={14} />
                      Email Address
                    </label>
                    <p className="text-gray-900">{company.company_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Phone className="mr-1" size={14} />
                      Phone Number
                    </label>
                    <p className="text-gray-900">{company.company_phone}</p>
                  </div>
                  {company.company_website && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Globe className="mr-1" size={14} />
                        Website
                      </label>
                      <a 
                        href={company.company_website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {company.company_website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="mr-2" size={20} />
                  Address Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <p className="text-gray-900">{company.company_address.street}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <p className="text-gray-900">{company.company_address.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <p className="text-gray-900">{company.company_address.state}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <p className="text-gray-900">{company.company_address.zipCode}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <p className="text-gray-900">{company.company_address.country}</p>
                  </div>
                </div>
              </div>

              {/* Company Metadata */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Company Metadata
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created Date
                    </label>
                    <p className="text-gray-900">{formatDate(company.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-900">{formatDate(company.updatedAt)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User className="mr-1" size={14} />
                      Created By
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{company.created_by.name}</p>
                        <p className="text-sm text-gray-500">{company.created_by.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Logo Section */}
              {company.company_logo && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Company Logo
                  </h4>
                  <div className="flex justify-center">
                    <img 
                      src={company.company_logo} 
                      alt={`${company.company_name} logo`}
                      className="max-w-32 max-h-32 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Data</h3>
              <p className="text-gray-600">Unable to load company details.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
