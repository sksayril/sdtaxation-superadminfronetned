import { useEffect } from 'react';
import { X, Building2, Mail, Phone, MapPin, Globe, Calendar, User, Loader2, FileText, Briefcase, Receipt, Shield, Award, Users, CreditCard, Building } from 'lucide-react';
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
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Company Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                <p className="text-gray-600 dark:text-gray-400">Loading company details...</p>
              </div>
            </div>
          ) : company ? (
            <div className="space-y-6">
              {/* Company Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Building2 className="mr-2" size={20} />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{company.company_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Mail className="mr-1" size={14} />
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white">{company.company_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Phone className="mr-1" size={14} />
                      Phone Number
                    </label>
                    <p className="text-gray-900 dark:text-white">{company.company_phone}</p>
                  </div>
                  {company.company_website && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <Globe className="mr-1" size={14} />
                        Website
                      </label>
                      <a 
                        href={company.company_website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                      >
                        {company.company_website}
                      </a>
                    </div>
                  )}
                  {company.gstNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <FileText className="mr-1" size={14} />
                        GST Number
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">{company.gstNumber}</p>
                    </div>
                  )}
                  {company.fiscalYear && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <Calendar className="mr-1" size={14} />
                        Finalcial Year
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">{company.fiscalYear}</p>
                    </div>
                  )}
                  {company.industry && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <Briefcase className="mr-1" size={14} />
                        Industry
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">{company.industry}</p>
                    </div>
                  )}
                  {company.industries && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <Briefcase className="mr-1" size={14} />
                        Industries
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">{company.industries}</p>
                    </div>
                  )}
                  {company.constitution_of_business && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <Building className="mr-1" size={14} />
                        Constitution of Business
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">{company.constitution_of_business}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Receipt className="mr-1" size={14} />
                      TDS Applicable
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.tdsApplicable 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {company.tdsApplicable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {company.tdsApplicable && company.tdsNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <Receipt className="mr-1" size={14} />
                        TDS Number
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">{company.tdsNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional & Compliance Information */}
              {(company.professional || company.epf || company.pf || company.esic) && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Shield className="mr-2" size={20} />
                    Professional & Compliance Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <Award className="mr-1" size={14} />
                        Professional
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.professional 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {company.professional ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {company.professional && company.professionalNumber && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Award className="mr-1" size={14} />
                          Professional Number
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium">{company.professionalNumber}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <Users className="mr-1" size={14} />
                        EPF
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.epf 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {company.epf ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {company.epf && company.epfNumber && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Users className="mr-1" size={14} />
                          EPF Number
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium">{company.epfNumber}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <CreditCard className="mr-1" size={14} />
                        PF
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.pf 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {company.pf ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {company.pf && company.pfNumber && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <CreditCard className="mr-1" size={14} />
                          PF Number
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium">{company.pfNumber}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                        <Shield className="mr-1" size={14} />
                        ESIC
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.esic 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {company.esic ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {company.esic && company.esicNumber && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Shield className="mr-1" size={14} />
                          ESIC Number
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium">{company.esicNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="mr-2" size={20} />
                  Address Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Street Address
                    </label>
                    <p className="text-gray-900 dark:text-white">{company.company_address.street}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <p className="text-gray-900 dark:text-white">{company.company_address.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State
                      </label>
                      <p className="text-gray-900 dark:text-white">{company.company_address.state}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ZIP Code
                      </label>
                      <p className="text-gray-900 dark:text-white">{company.company_address.zipCode}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Country
                    </label>
                    <p className="text-gray-900 dark:text-white">{company.company_address.country}</p>
                  </div>
                </div>
              </div>

              {/* Company Metadata */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Company Metadata
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created Date
                    </label>
                    <p className="text-gray-900 dark:text-white">{formatDate(company.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-900 dark:text-white">{formatDate(company.updatedAt)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <User className="mr-1" size={14} />
                      Created By
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="text-blue-600 dark:text-blue-300" size={16} />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{company.created_by.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{company.created_by.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Logo Section */}
              {company.company_logo && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Company Logo
                  </h4>
                  <div className="flex justify-center">
                    <img 
                      src={company.company_logo} 
                      alt={`${company.company_name} logo`}
                      className="max-w-32 max-h-32 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={48} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Company Data</h3>
              <p className="text-gray-600 dark:text-gray-400">Unable to load company details.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
