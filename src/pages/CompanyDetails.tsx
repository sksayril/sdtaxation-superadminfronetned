import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { apiService, type Company } from '../services/api';
import { toast } from '../utils/toast';
import { Building2, Mail, Phone, MapPin, Globe, Calendar, User, FileText, Briefcase, Receipt, Shield, Award, Users, Building, ArrowLeft, Loader2, Edit } from 'lucide-react';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

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
        setCompany(response.data);
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
    <Layout title="Company Details">
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/company')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Back to Companies"
            >
              <ArrowLeft className="text-gray-600 dark:text-gray-300" size={24} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Building2 className="text-blue-600 dark:text-blue-300" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Details</h1>
                <p className="text-gray-600 dark:text-gray-400">View complete company information</p>
              </div>
            </div>
          </div>
          {company && (
            <button
              onClick={() => navigate(`/company/${id}/edit`)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Edit Company"
            >
              <Edit size={18} />
              <span>Edit Company</span>
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
                <p className="text-gray-600 dark:text-gray-400">Loading company details...</p>
              </div>
            </div>
          </div>
        ) : company ? (
          <div className="space-y-6">
            {/* Company Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Building2 className="mr-2" size={20} />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium text-lg">{company.company_name}</p>
                </div>
                {company.company_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Client ID
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium font-mono">{company.company_id}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    company.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : company.status === 'suspended'
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
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
                      Fiscal Year
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
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    company.tdsApplicable 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="mr-2" size={20} />
                Professional & Compliance Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Award className="mr-1" size={14} />
                    Professional Tax
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    company.professional 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
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
                {!company.professional && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Award className="mr-1" size={14} />
                      Professional Number
                    </label>
                    <p className="text-gray-500 dark:text-gray-400 italic">Not applicable</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Users className="mr-1" size={14} />
                    EPF
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    company.epf 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {company.epf ? 'Yes' : 'No'}
                  </span>
                </div>
                {company.epf && company.epfNumber ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Users className="mr-1" size={14} />
                      EPF Number
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{company.epfNumber}</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Users className="mr-1" size={14} />
                      EPF Number
                    </label>
                    <p className="text-gray-500 dark:text-gray-400 italic">Not applicable</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Shield className="mr-1" size={14} />
                    ESIC
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    company.esic 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {company.esic ? 'Yes' : 'No'}
                  </span>
                </div>
                {company.esic && company.esicNumber ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Shield className="mr-1" size={14} />
                      ESIC Number
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{company.esicNumber}</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Shield className="mr-1" size={14} />
                      ESIC Number
                    </label>
                    <p className="text-gray-500 dark:text-gray-400 italic">Not applicable</p>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="mr-2" size={20} />
                Address Information
              </h2>
              <div className="space-y-4">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="mr-2" size={20} />
                Company Metadata
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="text-blue-600 dark:text-blue-300" size={20} />
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Company Logo
                </h2>
                <div className="flex justify-center">
                  <img 
                    src={company.company_logo} 
                    alt={`${company.company_name} logo`}
                    className="max-w-48 max-h-48 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="text-center py-12">
              <Building2 className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={48} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Company Data</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Unable to load company details.</p>
              <button
                onClick={() => navigate('/company')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Companies</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
