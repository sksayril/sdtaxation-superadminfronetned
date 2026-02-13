import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { apiService, type Company, type UpdateCompanyRequest } from '../services/api';
import { toast } from '../utils/toast';
import { Building2, Mail, Phone, MapPin, Globe, Loader2, Briefcase, ArrowLeft, Save, FileText } from 'lucide-react';
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

export default function EditCompany() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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
    company_logo: '',
    gstNumber: '',
    fiscalYear: '',
    industry: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [isTdsApplicable, setIsTdsApplicable] = useState<boolean>(false);
  const pincodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      fetchCompanyDetails(id);
    } else {
      toast.error('Company ID is missing', '❌ Error');
      navigate('/company');
    }
  }, [id, navigate]);

  const fetchCompanyDetails = async (companyId: string) => {
    try {
      setLoading(true);
      const response = await apiService.getCompanyById(companyId);
      if (response.success && response.data) {
        const companyData = response.data;
        setCompany(companyData);
        setFormData({
          company_name: companyData.company_name || '',
          company_email: companyData.company_email || '',
          company_phone: companyData.company_phone || '',
          company_address: {
            street: companyData.company_address?.street || '',
            city: companyData.company_address?.city || '',
            state: companyData.company_address?.state || '',
            country: companyData.company_address?.country || 'India',
            zipCode: companyData.company_address?.zipCode || ''
          },
          company_website: companyData.company_website || '',
          company_logo: companyData.company_logo || '',
          gstNumber: companyData.gstNumber || '',
          fiscalYear: companyData.fiscalYear || '',
          industry: companyData.industry || ''
        });
        setIsTdsApplicable(companyData.tdsApplicable || false);
      } else {
        toast.error(
          response.message || 'Failed to fetch company details',
          '❌ Fetch Error'
        );
        navigate('/company');
      }
    } catch (error: any) {
      console.error('Error fetching company details:', error);
      toast.error(
        error?.message || 'Failed to fetch company details. Please try again.',
        '❌ Network Error'
      );
      navigate('/company');
    } finally {
      setLoading(false);
    }
  };

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
            const addressData = extractAddressFromPostOffice(response.PostOffice[0]);
            
            setFormData(prev => ({
              ...prev,
              company_address: {
                ...prev.company_address,
                city: addressData.city || prev.company_address.city,
                state: addressData.state || prev.company_address.state,
                country: addressData.country || prev.company_address.country
              }
            }));
            
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors['address.city'];
              delete newErrors['address.state'];
              return newErrors;
            });
          }
        } catch (error) {
          console.error('Error fetching address from PIN code:', error);
        } finally {
          setPincodeLoading(false);
        }
      }, 500);
    } else {
      setPincodeLoading(false);
    }

    return () => {
      if (pincodeTimeoutRef.current) {
        clearTimeout(pincodeTimeoutRef.current);
      }
    };
  }, [formData.company_address.zipCode, formData.company_address.country]);

  const handleInputChange = (field: keyof UpdateCompanyRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: keyof typeof formData.company_address, value: string) => {
    setFormData(prev => ({
      ...prev,
      company_address: {
        ...prev.company_address,
        [field]: value
      }
    }));
    
    const errorKey = `address.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
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

    if (!formData.industry || !formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company || !id) return;
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form', '❌ Validation Error');
      return;
    }

    try {
      setSaving(true);
      await apiService.updateCompany(id, { ...formData, tdsApplicable: isTdsApplicable });
      toast.success('Company updated successfully!', '✅ Update Success');
      navigate(`/company/${id}`);
    } catch (error: any) {
      console.error('Error updating company:', error);
      toast.error(
        error?.message || 'Failed to update company. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Edit Company">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-gray-600 dark:text-gray-400">Loading company details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout title="Edit Company">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Company not found.</p>
          <button
            onClick={() => navigate('/company')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Companies</span>
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Company">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/company/${id}`)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Back to Company Details"
            >
              <ArrowLeft className="text-gray-600 dark:text-gray-300" size={24} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Building2 className="text-blue-600 dark:text-blue-300" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Company</h1>
                <p className="text-gray-600 dark:text-gray-400">Update company information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Building2 className="mr-2" size={20} />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.company_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.company_name && (
                    <p className="mt-1 text-sm text-red-500">{errors.company_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Mail className="mr-1" size={14} />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.company_email}
                    onChange={(e) => handleInputChange('company_email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.company_email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.company_email && (
                    <p className="mt-1 text-sm text-red-500">{errors.company_email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Phone className="mr-1" size={14} />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.company_phone}
                    onChange={(e) => handleInputChange('company_phone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.company_phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.company_phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.company_phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Globe className="mr-1" size={14} />
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.company_website}
                    onChange={(e) => handleInputChange('company_website', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FileText className="mr-1" size={14} />
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Briefcase className="mr-1" size={14} />
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.industry ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fiscal Year
                  </label>
                  <input
                    type="text"
                    value={formData.fiscalYear}
                    onChange={(e) => handleInputChange('fiscalYear', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="2025-2026"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="mr-2" size={20} />
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company_address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors['address.street'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['address.street'] && (
                    <p className="mt-1 text-sm text-red-500">{errors['address.street']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.company_address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      maxLength={6}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                        errors['address.zipCode'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter 6-digit PIN code"
                    />
                    {pincodeLoading && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 className="animate-spin text-blue-600" size={20} />
                      </div>
                    )}
                  </div>
                  {errors['address.zipCode'] && (
                    <p className="mt-1 text-sm text-red-500">{errors['address.zipCode']}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter PIN code to auto-fill city and state
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company_address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors['address.city'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['address.city'] && (
                    <p className="mt-1 text-sm text-red-500">{errors['address.city']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company_address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors['address.state'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors['address.state'] && (
                    <p className="mt-1 text-sm text-red-500">{errors['address.state']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company_address.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* TDS Applicable */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTdsApplicable}
                  onChange={(e) => setIsTdsApplicable(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  TDS Applicable
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate(`/company/${id}`)}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
