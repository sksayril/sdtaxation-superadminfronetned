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

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCompanies();
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

  // Filter companies based on search and status
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.company_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title="Company Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
              <div className="text-gray-600">
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
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={20} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Add Company</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Company List ({filteredCompanies.length})
            </h2>
          </div>
          
          {loading ? (
            <SkeletonLoader type="card" count={6} />
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600 mb-4">
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
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompanies.map((company) => (
                    <tr key={company._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Building2 className="text-blue-600" size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{company.company_name}</div>
                            {company.company_website && (
                              <div className="text-sm text-gray-500">{company.company_website}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.company_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{company.company_phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div>{company.company_address.street}</div>
                          <div className="text-gray-500">
                            {company.company_address.city}, {company.company_address.state} {company.company_address.zipCode}
                          </div>
                          <div className="text-gray-500">{company.company_address.country}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          company.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {company.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(company.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {company.created_by.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
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