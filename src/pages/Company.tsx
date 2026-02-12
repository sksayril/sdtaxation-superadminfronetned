import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CreateCompanyModal from '../components/CreateCompanyModal';
import CompanyDetailsModal from '../components/CompanyDetailsModal';
import EditCompanyModal from '../components/EditCompanyModal';
import DeleteCompanyModal from '../components/DeleteCompanyModal';
import SkeletonLoader, { LoadingSpinner } from '../components/SkeletonLoader';
import { apiService, type Company, type CreateCompanyRequest, type UpdateCompanyRequest } from '../services/api';
import { toast } from '../utils/toast';
import { Building2, Plus, Search, Edit, Trash2, RefreshCw, Eye } from 'lucide-react';

export default function Company() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Format date as "11-02-2026" (day-month-year with dashes)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  };

  // Listen for custom event to open create company modal from header button
  useEffect(() => {
    const handleOpenCreateModal = () => {
      setCreateModalOpen(true);
    };

    window.addEventListener('openCreateCompanyModal', handleOpenCreateModal);
    return () => {
      window.removeEventListener('openCreateCompanyModal', handleOpenCreateModal);
    };
  }, []);

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // Use filter API with empty body to get all companies
      const response = await apiService.filterCompanies({});
      if (response.success) {
        setCompanies(response.data);
      } else {
        toast.error(
          'Failed to fetch companies',
          '❌ Fetch Error'
        );
      }
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error(
        'Failed to fetch companies. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setLoading(false);
    }
  };
  // Filter companies by status using API (POST /api/companies/filter)
  const filterCompaniesByStatus = async (status: string) => {
    try {
      setLoading(true);
      if (status === 'all') {
        // When 'all' is selected, call filter API with no status to get all companies
        const response = await apiService.filterCompanies({});
        if (response.success) {
          setCompanies(response.data);
        } else {
          toast.error(
            response.message || 'Failed to fetch companies',
            '❌ Filter Error'
          );
        }
      } else {
        // Call filter API with status (POST /api/companies/filter)
        const response = await apiService.filterCompanies({ 
          status: status as 'active' | 'inactive' | 'suspended' 
        });
        if (response.success) {
          setCompanies(response.data);
          toast.success(
            response.message || `Companies filtered by status: ${status}`,
            '✅ Filter Applied'
          );
        } else {
          toast.error(
            response.message || 'Failed to filter companies',
            '❌ Filter Error'
          );
        }
      }
    } catch (error: any) {
      console.error('Error filtering companies:', error);
      // Handle specific API error messages
      const errorMessage = error?.message || error?.error || 'Failed to filter companies. Please try again.';
      toast.error(
        errorMessage,
        '❌ Filter Error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (company: Company) => {
    try {
      const newStatus = company.status === 'active' ? 'inactive' : 'active';
      
      // Update company status using POST /api/companies/filter with company_id and status
      const response = await apiService.updateCompanyStatus(company._id, newStatus);
      
      if (response.success) {
        // Refresh the list using filter API POST /api/companies/filter
        if (filterStatus === 'all') {
          // Call filter API with no status to get all companies
          const filterResponse = await apiService.filterCompanies({});
          if (filterResponse.success) {
            setCompanies(filterResponse.data);
          }
        } else {
          // Call filter API with current filter status
          await filterCompaniesByStatus(filterStatus);
        }
        toast.success(
          `Company status updated to ${newStatus}`,
          '✅ Status Updated'
        );
      } else {
        toast.error(
          response.message || 'Failed to update company status',
          '❌ Update Error'
        );
      }
    } catch (error: any) {
      console.error('Error updating company status:', error);
      const errorMessage = error?.message || error?.error || 'Failed to update company status. Please try again.';
      toast.error(
        errorMessage,
        '❌ Update Error'
      );
    }
  };

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Handle create company
  const handleCreateCompany = async (companyData: CreateCompanyRequest) => {
    try {
      setCreateLoading(true);
      const response = await apiService.createCompany(companyData);
      if (response.success) {
        toast.success(
          'Company created successfully!',
          '🎉 Success!'
        );
        setCreateModalOpen(false);
        // Refresh the companies list
        await fetchCompanies();
      } else {
        toast.error(
          response.message || 'Failed to create company',
          '❌ Creation Failed'
        );
      }
    } catch (error: any) {
      console.error('Error creating company:', error);
      toast.error(
        'Failed to create company. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle view company details
  const handleViewCompany = async (companyId: string) => {
    try {
      setDetailsLoading(true);
      setDetailsModalOpen(true);
      setSelectedCompany(null); // Clear previous data
      
      const response = await apiService.getCompanyById(companyId);
      if (response.success) {
        setSelectedCompany(response.data);
        toast.success(
          'Company details loaded successfully!',
          '👁️ Details Loaded'
        );
      } else {
        toast.error(
          'Failed to fetch company details',
          '❌ Fetch Error'
        );
        setDetailsModalOpen(false);
      }
    } catch (error: any) {
      console.error('Error fetching company details:', error);
      toast.error(
        'Failed to fetch company details. Please try again.',
        '❌ Network Error'
      );
      setDetailsModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle edit company
  const handleEditCompany = async (companyId: string) => {
    try {
      setEditLoading(true);
      setEditModalOpen(true);
      setEditingCompany(null); // Clear previous data
      
      const response = await apiService.getCompanyById(companyId);
      if (response.success) {
        setEditingCompany(response.data);
        toast.success(
          'Company data loaded for editing!',
          '✏️ Edit Mode'
        );
      } else {
        toast.error(
          'Failed to fetch company data for editing',
          '❌ Fetch Error'
        );
        setEditModalOpen(false);
      }
    } catch (error: any) {
      console.error('Error fetching company for editing:', error);
      toast.error(
        'Failed to fetch company data. Please try again.',
        '❌ Network Error'
      );
      setEditModalOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle update company
  const handleUpdateCompany = async (companyId: string, companyData: UpdateCompanyRequest) => {
    try {
      setEditLoading(true);
      const response = await apiService.updateCompany(companyId, companyData);
      if (response.success) {
        toast.success(
          'Company updated successfully!',
          '✅ Update Success'
        );
        setEditModalOpen(false);
        // Refresh the companies list
        await fetchCompanies();
      } else {
        toast.error(
          response.message || 'Failed to update company',
          '❌ Update Failed'
        );
      }
    } catch (error: any) {
      console.error('Error updating company:', error);
      toast.error(
        'Failed to update company. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete company
  const handleDeleteCompany = async (companyId: string) => {
    try {
      setDeleteLoading(true);
      const response = await apiService.deleteCompany(companyId);
      if (response.success) {
        toast.success(
          'Company deleted successfully!',
          '🗑️ Delete Success'
        );
        setDeleteModalOpen(false);
        // Refresh the companies list
        await fetchCompanies();
      } else {
        toast.error(
          response.message || 'Failed to delete company',
          '❌ Delete Failed'
        );
      }
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(
        'Failed to delete company. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (companyId: string) => {
    try {
      setDeleteLoading(true);
      setDeleteModalOpen(true);
      setDeletingCompany(null); // Clear previous data
      
      const response = await apiService.getCompanyById(companyId);
      if (response.success) {
        setDeletingCompany(response.data);
        toast.warning(
          'Please confirm company deletion',
          '⚠️ Delete Confirmation'
        );
      } else {
        toast.error(
          'Failed to fetch company data for deletion',
          '❌ Fetch Error'
        );
        setDeleteModalOpen(false);
      }
    } catch (error: any) {
      console.error('Error fetching company for deletion:', error);
      toast.error(
        'Failed to fetch company data. Please try again.',
        '❌ Network Error'
      );
      setDeleteModalOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter companies based on search (status filtering is done via API)
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.company_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout title="Company Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Companies</h1>
              <div className="text-gray-600 dark:text-gray-400">
                {loading ? (
                  <span className="inline-flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Loading...
                  </span>
                ) : (
                  `${companies.length} companies found`
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchCompanies}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 dark:text-gray-300 dark:bg-gray-800"
            >
              <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={20} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              <span>Add Company</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                const newStatus = e.target.value;
                setFilterStatus(newStatus);
                filterCompaniesByStatus(newStatus);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Company List ({filteredCompanies.length})
            </h2>
          </div>
          
          {loading ? (
            <SkeletonLoader type="card" count={6} />
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={48} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No companies found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first company.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  <span>Create Company</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCompanies.map((company) => (
                    <tr key={company._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Building2 className="text-blue-600 dark:text-blue-300" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">{company.company_name}</div>
                            {company.company_website && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">{company.company_website}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{company.company_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{company.company_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          company.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : company.status === 'suspended'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {company.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(company.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          by {company.created_by.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleStatusToggle(company)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                company.status === 'active'
                                  ? 'bg-green-600 focus:ring-green-500'
                                  : 'bg-gray-300 focus:ring-gray-400'
                              }`}
                              title={company.status === 'active' ? 'Click to set Inactive' : 'Click to set Active'}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  company.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <span className={`text-sm font-medium ${
                              company.status === 'active' ? 'text-green-700' : 'text-gray-600'
                            }`}>
                              {company.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleViewCompany(company._id)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="View Company Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditCompany(company._id)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit Company"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(company._id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Company"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Company Modal */}
        <CreateCompanyModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateCompany}
          loading={createLoading}
        />

        {/* Company Details Modal */}
        <CompanyDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          company={selectedCompany}
          loading={detailsLoading}
        />

        {/* Edit Company Modal */}
        <EditCompanyModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleUpdateCompany}
          company={editingCompany}
          loading={editLoading}
        />

        {/* Delete Company Modal */}
        <DeleteCompanyModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteCompany}
          company={deletingCompany}
          loading={deleteLoading}
        />
      </div>
    </Layout>
  );
}