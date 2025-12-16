import { X, AlertTriangle, Building2, Trash2, Loader2 } from 'lucide-react';
import { Company } from '../services/api';

interface DeleteCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (companyId: string) => Promise<void>;
  company: Company | null;
  loading?: boolean;
}

export default function DeleteCompanyModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  company, 
  loading = false 
}: DeleteCompanyModalProps) {
  if (!isOpen || !company) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm(company._id);
    } catch (error) {
      console.error('Delete confirmation error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Company
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <Building2 className="text-red-600" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Are you sure you want to delete this company?
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Company Name:</span>
                    <p className="text-gray-900 font-medium">{company.company_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{company.company_email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{company.company_phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Address:</span>
                    <p className="text-gray-900">
                      {company.company_address.street}, {company.company_address.city}, {company.company_address.state}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="text-red-500 mt-0.5" size={16} />
                  <div>
                    <h5 className="text-sm font-medium text-red-800">Warning</h5>
                    <p className="text-sm text-red-700 mt-1">
                      This action cannot be undone. All company data including address, contact information, and associated records will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Company</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
