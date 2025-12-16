import { useState, useEffect, useRef } from 'react';
import { X, Building2, Mail, Phone, MapPin, Globe, Loader2 } from 'lucide-react';
import { Company, UpdateCompanyRequest, CompanyAddress } from '../services/api';
import { getPostOfficeByPincode, extractAddressFromPostOffice } from '../utils/pincodeApi';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyId: string, companyData: UpdateCompanyRequest) => Promise<void>;
  company: Company | null;
  loading?: boolean;
}

export default function EditCompanyModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  company,
  loading = false 
}: EditCompanyModalProps) {
  const [formData, setFormData] = useState<UpdateCompanyRequest>({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    },
    company_website: '',
    company_logo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const pincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-fill address when PIN code is entered
  useEffect(() => {
    const zipCode = formData.company_address.zipCode.trim();
    
    // Clear previous timeout
    if (pincodeTimeoutRef.current) {
      clearTimeout(pincodeTimeoutRef.current);
    }

    // Only fetch if PIN code is 6 digits and country is India
    if (zipCode.length === 6 && formData.company_address.country === 'India') {
      setPincodeLoading(true);
      
      // Debounce API call
      pincodeTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await getPostOfficeByPincode(zipCode);
          
          if (response.Status === 'Success' && response.PostOffice && response.PostOffice.length > 0) {
            // Use the first post office data
            const addressData = extractAddressFromPostOffice(response.PostOffice[0]);
            
            // Auto-fill address fields
            setFormData(prev => ({
              ...prev,
              company_address: {
                ...prev.company_address,
                city: addressData.city || prev.company_address.city,
                state: addressData.state || prev.company_address.state,
                country: addressData.country || prev.company_address.country
              }
            }));
            
            // Clear any previous errors
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors['address.city'];
              delete newErrors['address.state'];
              return newErrors;
            });
          } else {
            // PIN code not found, but don't show error - let user fill manually
            console.log('PIN code not found:', response.Message);
          }
        } catch (error) {
          console.error('Error fetching PIN code data:', error);
        } finally {
          setPincodeLoading(false);
        }
      }, 500); // 500ms debounce
    } else {
      setPincodeLoading(false);
    }

    // Cleanup timeout on unmount
    return () => {
      if (pincodeTimeoutRef.current) {
        clearTimeout(pincodeTimeoutRef.current);
      }
    };
  }, [formData.company_address.zipCode, formData.company_address.country]);

  // Pre-fill form when company data is available
  useEffect(() => {
    if (company && isOpen) {
      setFormData({
        company_name: company.company_name || '',
        company_email: company.company_email || '',
        company_phone: company.company_phone || '',
        company_address: {
          street: company.company_address?.street || '',
          city: company.company_address?.city || '',
          state: company.company_address?.state || '',
          country: company.company_address?.country || 'India',
          zipCode: company.company_address?.zipCode || ''
        },
        company_website: company.company_website || '',
        company_logo: company.company_logo || ''
      });
      setErrors({});
    }
  }, [company, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        company_address: {
          ...prev.company_address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData.company_email.trim()) {
      newErrors.company_email = 'Company email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email)) {
      newErrors.company_email = 'Please enter a valid email address';
    }

    if (!formData.company_phone.trim()) {
      newErrors.company_phone = 'Company phone is required';
    } else if (!/^\d{10}$/.test(formData.company_phone.replace(/\D/g, ''))) {
      newErrors.company_phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.company_address.street.trim()) {
      newErrors['address.street'] = 'Street address is required';
    }

    if (!formData.company_address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }

    if (!formData.company_address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    }

    if (!formData.company_address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company) return;
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(company._id, formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen) return null;

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
              Edit Company {company && `- ${company.company_name}`}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company Basic Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.company_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter company name"
                disabled={loading}
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline mr-1" size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.company_email}
                  onChange={(e) => handleInputChange('company_email', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.company_email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="contact@company.com"
                  disabled={loading}
                />
                {errors.company_email && (
                  <p className="mt-1 text-sm text-red-600">{errors.company_email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline mr-1" size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.company_phone}
                  onChange={(e) => handleInputChange('company_phone', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.company_phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="1234567890"
                  disabled={loading}
                />
                {errors.company_phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.company_phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline mr-1" size={16} />
                Website (Optional)
              </label>
              <input
                type="url"
                value={formData.company_website}
                onChange={(e) => handleInputChange('company_website', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.company.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <MapPin className="mr-2" size={20} />
              Address Information
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.company_address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors['address.street'] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="123 Main Street"
                disabled={loading}
              />
              {errors['address.street'] && (
                <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.company_address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors['address.city'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Mumbai"
                  disabled={loading}
                />
                {errors['address.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.company_address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors['address.state'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Maharashtra"
                  disabled={loading}
                />
                {errors['address.state'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  value={formData.company_address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code / ZIP Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.company_address.zipCode}
                    onChange={(e) => {
                      // Only allow numbers and limit to 6 digits
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('address.zipCode', value);
                    }}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors['address.zipCode'] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="400001"
                    disabled={loading}
                    maxLength={6}
                  />
                  {pincodeLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="animate-spin text-blue-600" size={18} />
                    </div>
                  )}
                </div>
                {formData.company_address.country === 'India' && formData.company_address.zipCode.length === 6 && !pincodeLoading && (
                  <p className="mt-1 text-xs text-blue-600">Address will be auto-filled</p>
                )}
                {errors['address.zipCode'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.zipCode']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Building2 size={16} />
                  <span>Update Company</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
