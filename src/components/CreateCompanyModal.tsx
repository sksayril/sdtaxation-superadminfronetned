import React, { useState, useEffect, useRef } from 'react';
import { X, Building2, Mail, Phone, MapPin, Globe, Loader2, FileText, Calendar, Briefcase } from 'lucide-react';
import { CreateCompanyRequest } from '../services/api';
import { getPostOfficeByPincode, extractAddressFromPostOffice } from '../utils/pincodeApi';

const INDUSTRIES = [
  'Agriculture',
  'Manufacturing',
  'Construction',
  'Retail Trade',
  'Wholesale Trade',
  'Transportation & Logistics',
  'Education',
  'Healthcare',
  'Finance & Insurance',
  'Information Technology & Services',
  'Professional & Business Services',
  'Hospitality & Tourism'
];

const CONSTITUTION_OF_BUSINESS = [
  'Select',
  'Foreign Company',
  'Foreign Limited Liability Partnership',
  'Government Department',
  'Hindu Undivided Family',
  'Limited Liability Partnership',
  'Local Authority',
  'Others',
  'Partnership',
  'Private Limited Company',
  'Proprietorship',
  'Public Limited Company',
  'Public Sector Undertaking',
  'Society/ Club/ Trust/ AOP',
  'Statutory Body',
  'Unlimited Company'
];

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyData: CreateCompanyRequest) => Promise<void>;
  loading?: boolean;
}

export default function CreateCompanyModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}: CreateCompanyModalProps) {
  const [formData, setFormData] = useState<CreateCompanyRequest>({
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
    gstNumber: '',
    fiscalYear: '',
    industry: '',
    industries: '',
    constitution_of_business: ''
  });
  
  const [fiscalStartYear, setFiscalStartYear] = useState<string>('');
  const [fiscalEndYear, setFiscalEndYear] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isTdsApplicable, setIsTdsApplicable] = useState<boolean>(false);
  const [isProfessional, setIsProfessional] = useState<boolean>(false);
  const [isEpf, setIsEpf] = useState<boolean>(false);
  const [isPf, setIsPf] = useState<boolean>(false);
  const [isEsic, setIsEsic] = useState<boolean>(false);
  const [tdsNumber, setTdsNumber] = useState<string>('');
  const [professionalNumber, setProfessionalNumber] = useState<string>('');
  const [epfNumber, setEpfNumber] = useState<string>('');
  const [pfNumber, setPfNumber] = useState<string>('');
  const [esicNumber, setEsicNumber] = useState<string>('');

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
    
    // If industry is changed to "Education", disable GST
    if (field === 'industry' && value === 'Education') {
      setIsActive(false);
      setFormData(prev => ({
        ...prev,
        gstNumber: ''
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.gstNumber;
        return newErrors;
      });
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFiscalYearChange = (startYear: string, endYear: string) => {
    setFiscalStartYear(startYear);
    setFiscalEndYear(endYear);
    
    if (startYear && endYear) {
      // Validate that end year is start year + 1
      const start = parseInt(startYear);
      const end = parseInt(endYear);
      
      if (end !== start + 1) {
        setErrors(prev => ({ ...prev, fiscalYear: 'End year must be start year + 1 (e.g., 2024-2025)' }));
        setFormData(prev => ({ ...prev, fiscalYear: '' }));
      } else {
        setFormData(prev => ({ ...prev, fiscalYear: `${startYear}-${endYear}` }));
        if (errors.fiscalYear) {
          setErrors(prev => ({ ...prev, fiscalYear: '' }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, fiscalYear: '' }));
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

    // Validate GST number format if provided and active (15 characters, alphanumeric)
    // GST is not allowed for Education industry
    if (formData.industry === 'Education' && isActive) {
      newErrors.gstNumber = 'GST is not applicable for Education industry';
    } else if (isActive && formData.gstNumber && formData.gstNumber.trim()) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(formData.gstNumber.trim().toUpperCase())) {
        newErrors.gstNumber = 'Please enter a valid GST number (15 characters, alphanumeric)';
      }
    }

    // Validate fiscal year format if provided (YYYY-YYYY)
    if (formData.fiscalYear && formData.fiscalYear.trim()) {
      const fiscalRegex = /^\d{4}-\d{4}$/;
      if (!fiscalRegex.test(formData.fiscalYear.trim())) {
        newErrors.fiscalYear = 'Please enter fiscal year in format YYYY-YYYY (e.g., 2024-2025)';
      } else {
        const [start, end] = formData.fiscalYear.split('-').map(Number);
        if (end !== start + 1) {
          newErrors.fiscalYear = 'End year must be start year + 1 (e.g., 2024-2025)';
        }
      }
    }

    // Validate constitution of business if provided (max 500 characters)
    if (formData.constitution_of_business && formData.constitution_of_business.trim()) {
      if (formData.constitution_of_business.trim().length > 500) {
        newErrors.constitution_of_business = 'Constitution of business must not exceed 500 characters';
      }
    }

    // Validate TDS Number (required if TDS Applicable is true)
    if (isTdsApplicable && !tdsNumber.trim()) {
      newErrors.tdsNumber = 'TDS Number is required when TDS Applicable is enabled';
    }

    // Validate Professional Number (required if Professional is true)
    if (isProfessional && !professionalNumber.trim()) {
      newErrors.professionalNumber = 'Professional Number is required when Professional is enabled';
    }

    // Validate EPF Number (required if EPF is true)
    if (isEpf && !epfNumber.trim()) {
      newErrors.epfNumber = 'EPF Number is required when EPF is enabled';
    }

    // Validate PF Number (required if PF is true)
    if (isPf && !pfNumber.trim()) {
      newErrors.pfNumber = 'PF Number is required when PF is enabled';
    }

    // Validate ESIC Number (required if ESIC is true)
    if (isEsic && !esicNumber.trim()) {
      newErrors.esicNumber = 'ESIC Number is required when ESIC is enabled';
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
      const submitData: CreateCompanyRequest = {
        ...formData,
        tdsApplicable: isTdsApplicable,
        tdsNumber: isTdsApplicable ? tdsNumber : undefined,
        professional: isProfessional,
        professionalNumber: isProfessional ? professionalNumber : undefined,
        epf: isEpf,
        epfNumber: isEpf ? epfNumber : undefined,
        pf: isPf,
        pfNumber: isPf ? pfNumber : undefined,
        esic: isEsic,
        esicNumber: isEsic ? esicNumber : undefined,
      };
      
      await onSubmit(submitData);
      // Reset form on success
      setFormData({
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
        gstNumber: '',
        fiscalYear: '',
        industry: '',
        industries: '',
        constitution_of_business: ''
      });
      setFiscalStartYear('');
      setFiscalEndYear('');
      setIsActive(false);
      setIsTdsApplicable(false);
      setIsProfessional(false);
      setIsEpf(false);
      setIsPf(false);
      setIsEsic(false);
      setTdsNumber('');
      setProfessionalNumber('');
      setEpfNumber('');
      setPfNumber('');
      setEsicNumber('');
      setErrors({});
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
              Create New Company
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Active
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsActive(!isActive);
                    if (isActive) {
                      // Clear GST number when deactivating
                      setFormData(prev => ({ ...prev, gstNumber: '' }));
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.gstNumber;
                        return newErrors;
                      });
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isActive ? 'bg-green-600' : 'bg-gray-300'
                  } ${formData.industry === 'Education' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading || formData.industry === 'Education'}
                  title={formData.industry === 'Education' ? 'GST is not applicable for Education industry' : ''}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                <b>If GST applicable</b>
                {formData.industry === 'Education' && (
                  <span className="text-red-500 ml-2">(Not applicable for Education industry)</span>
                )}
              </p>
              {isActive && formData.industry !== 'Education' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline mr-1" size={16} />
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.gstNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="15-digit GST number"
                    maxLength={15}
                    disabled={loading}
                  />
                  {errors.gstNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.gstNumber}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  TDS Applicable
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsTdsApplicable(!isTdsApplicable);
                    if (isTdsApplicable) {
                      setTdsNumber('');
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.tdsNumber;
                        return newErrors;
                      });
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isTdsApplicable ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isTdsApplicable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                <b>If TDS (Tax Deducted at Source) is applicable for this company</b>
              </p>
              {isTdsApplicable && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TDS Number *
                  </label>
                  <input
                    type="text"
                    value={tdsNumber}
                    onChange={(e) => {
                      setTdsNumber(e.target.value);
                      if (errors.tdsNumber) {
                        setErrors(prev => ({ ...prev, tdsNumber: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.tdsNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter TDS Number"
                    disabled={loading}
                  />
                  {errors.tdsNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.tdsNumber}</p>
                  )}
                </div>
              )}
            </div>

            {/* Professional Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Professional
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfessional(!isProfessional);
                    if (isProfessional) {
                      setProfessionalNumber('');
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.professionalNumber;
                        return newErrors;
                      });
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isProfessional ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isProfessional ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {isProfessional && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Number *
                  </label>
                  <input
                    type="text"
                    value={professionalNumber}
                    onChange={(e) => {
                      setProfessionalNumber(e.target.value);
                      if (errors.professionalNumber) {
                        setErrors(prev => ({ ...prev, professionalNumber: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.professionalNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter Professional Number"
                    disabled={loading}
                  />
                  {errors.professionalNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.professionalNumber}</p>
                  )}
                </div>
              )}
            </div>

            {/* EPF Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  EPF
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsEpf(!isEpf);
                    if (isEpf) {
                      setEpfNumber('');
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.epfNumber;
                        return newErrors;
                      });
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isEpf ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEpf ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {isEpf && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EPF Number *
                  </label>
                  <input
                    type="text"
                    value={epfNumber}
                    onChange={(e) => {
                      setEpfNumber(e.target.value);
                      if (errors.epfNumber) {
                        setErrors(prev => ({ ...prev, epfNumber: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.epfNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter EPF Number"
                    disabled={loading}
                  />
                  {errors.epfNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.epfNumber}</p>
                  )}
                </div>
              )}
            </div>

            {/* PF Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  PF
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsPf(!isPf);
                    if (isPf) {
                      setPfNumber('');
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.pfNumber;
                        return newErrors;
                      });
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isPf ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPf ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {isPf && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PF Number *
                  </label>
                  <input
                    type="text"
                    value={pfNumber}
                    onChange={(e) => {
                      setPfNumber(e.target.value);
                      if (errors.pfNumber) {
                        setErrors(prev => ({ ...prev, pfNumber: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.pfNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter PF Number"
                    disabled={loading}
                  />
                  {errors.pfNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.pfNumber}</p>
                  )}
                </div>
              )}
            </div>

            {/* ESIC Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  ESIC
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsEsic(!isEsic);
                    if (isEsic) {
                      setEsicNumber('');
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.esicNumber;
                        return newErrors;
                      });
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isEsic ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEsic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {isEsic && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ESIC Number *
                  </label>
                  <input
                    type="text"
                    value={esicNumber}
                    onChange={(e) => {
                      setEsicNumber(e.target.value);
                      if (errors.esicNumber) {
                        setErrors(prev => ({ ...prev, esicNumber: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.esicNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter ESIC Number"
                    disabled={loading}
                  />
                  {errors.esicNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.esicNumber}</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="inline mr-1" size={16} />
                  Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.industry ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Constitution of Business <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.constitution_of_business || ''}
                  onChange={(e) => handleInputChange('constitution_of_business', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.constitution_of_business ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  {CONSTITUTION_OF_BUSINESS.map((constitution) => (
                    <option key={constitution} value={constitution === 'Select' ? '' : constitution}>
                      {constitution}
                    </option>
                  ))}
                </select>
                {errors.constitution_of_business && (
                  <p className="mt-1 text-sm text-red-600">{errors.constitution_of_business}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-1" size={16} />
                  Fiscal Year Start (Optional)
                </label>
                <select
                  value={fiscalStartYear}
                  onChange={(e) => handleFiscalYearChange(e.target.value, fiscalEndYear)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fiscalYear ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select Start Year</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = 2000 + i;
                    return (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-1" size={16} />
                  Fiscal Year End (Optional)
                </label>
                <select
                  value={fiscalEndYear}
                  onChange={(e) => handleFiscalYearChange(fiscalStartYear, e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fiscalYear ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading || !fiscalStartYear}
                >
                  <option value="">Select End Year</option>
                  {fiscalStartYear && (() => {
                    const startYear = parseInt(fiscalStartYear);
                    const years = [];
                    for (let year = startYear + 1; year <= 2099; year++) {
                      years.push(year);
                    }
                    return years.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ));
                  })()}
                </select>
                {fiscalStartYear && fiscalEndYear && (
                  <p className="mt-1 text-xs text-gray-500">
                    Fiscal Year: {fiscalStartYear}-{fiscalEndYear}
                  </p>
                )}
                {errors.fiscalYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.fiscalYear}</p>
                )}
              </div>
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Building2 size={16} />
                  <span>Create Company</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
