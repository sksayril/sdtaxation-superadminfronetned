import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CreateAdminModal from '../components/CreateAdminModal';
import AdminDetailsModal from '../components/AdminDetailsModal';
import EditAdminModal from '../components/EditAdminModal';
import DeleteAdminModal from '../components/DeleteAdminModal';
import { AdminTableSkeleton, LoadingSpinner } from '../components/SkeletonLoader';
import { apiService, type Company, type CreateAdminRequest, type Admin, type UpdateAdminRequest } from '../services/api';
import { toast } from '../utils/toast';
import { UserCheck, Plus, Search, RefreshCw, Eye, Edit, Trash2, Mail, Phone, MapPin, Calendar, Shield, Building2 } from 'lucide-react';

export default function AdminManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  // Fetch companies for admin creation
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCompanies();
      if (response.success) {
        setCompanies(response.data);
        // Don't auto-select a company - let user choose or show all
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

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      setAdminsLoading(true);
      const response = await apiService.getAdmins();
      if (response.success) {
        setAdmins(response.data);
      } else {
        toast.error(
          'Failed to fetch admins',
          '❌ Fetch Error'
        );
      }
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      toast.error(
        'Failed to fetch admins. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setAdminsLoading(false);
    }
  };

  // Load companies and admins on component mount
  useEffect(() => {
    fetchCompanies();
    fetchAdmins();
  }, []);


  // Handle create admin
  const handleCreateAdmin = async (adminData: CreateAdminRequest) => {
    try {
      setCreateLoading(true);
      const response = await apiService.createAdmin(adminData);
      if (response.success) {
        toast.success(
          `Admin "${response.data.fullname}" created successfully!`,
          '👤 Admin Created'
        );
        setCreateModalOpen(false);
        // Refresh admins list
        await fetchAdmins();
      } else {
        toast.error(
          response.message || 'Failed to create admin',
          '❌ Creation Failed'
        );
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error(
        'Failed to create admin. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle view admin details
  const handleViewAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setDetailsModalOpen(true);
  };

  // Handle edit admin
  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditModalOpen(true);
  };

  // Handle update admin
  const handleUpdateAdmin = async (adminId: string, adminData: UpdateAdminRequest) => {
    try {
      setEditLoading(true);
      const response = await apiService.updateAdmin(adminId, adminData);
      if (response.success) {
        toast.success(
          `Admin "${response.data.fullname}" updated successfully!`,
          '✅ Update Success'
        );
        setEditModalOpen(false);
        setEditingAdmin(null);
        // Refresh admins list
        await fetchAdmins();
      } else {
        toast.error(
          response.message || 'Failed to update admin',
          '❌ Update Failed'
        );
      }
    } catch (error: any) {
      console.error('Error updating admin:', error);
      toast.error(
        'Failed to update admin. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = (admin: Admin) => {
    setDeletingAdmin(admin);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete admin
  const handleConfirmDeleteAdmin = async (adminId: string) => {
    try {
      setDeleteLoading(true);
      const response = await apiService.deleteAdmin(adminId);
      if (response.success) {
        toast.success(
          `Admin deleted successfully!`,
          '✅ Delete Success'
        );
        setDeleteModalOpen(false);
        setDeletingAdmin(null);
        // Refresh admins list
        await fetchAdmins();
      } else {
        toast.error(
          response.message || 'Failed to delete admin',
          '❌ Delete Failed'
        );
      }
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      toast.error(
        'Failed to delete admin. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter admins based on search term and selected company
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = 
      admin.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.adminArea.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = !selectedCompany || (admin.company && admin.company._id === selectedCompany);
    
    return matchesSearch && matchesCompany;
  });


  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout title="Admin Management">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserCheck className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${admins.length} admins • ${companies.length} companies`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                fetchCompanies();
                fetchAdmins();
              }}
              disabled={loading || adminsLoading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`${loading || adminsLoading ? 'animate-spin' : ''}`} size={20} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              disabled={companies.length === 0}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              <span>Create Admin</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search admins by name, email, department, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building2 className="text-gray-400" size={20} />
              </div>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="pl-12 pr-8 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 appearance-none bg-white text-gray-700 min-w-[200px]"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="text-purple-600" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Admin List
                  </h2>
                  <div className="text-sm text-gray-600">
                    {adminsLoading ? (
                      <span className="inline-flex items-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Loading...
                      </span>
                    ) : (
                      `${filteredAdmins.length} of ${admins.length} admins`
                    )}
                  </div>
                </div>
              </div>
              {filteredAdmins.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Active</span>
                </div>
              )}
            </div>
          </div>
          
          {adminsLoading ? (
            <AdminTableSkeleton count={5} />
          ) : companies.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Companies Found</h3>
              <p className="text-gray-600 mb-4">
                You need to create companies first before creating admins.
              </p>
              <button
                onClick={() => window.location.href = '/company'}
                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                <span>Create Company</span>
              </button>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {admins.length === 0 ? 'No Admins Created Yet' : 'No Admins Match Your Search'}
              </h3>
              <p className="text-gray-600 mb-4">
                {admins.length === 0 
                  ? 'Get started by creating your first admin for a company.'
                  : 'Try adjusting your search terms or company filter.'
                }
              </p>
              {admins.length === 0 && (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus size={20} />
                  <span>Create Admin</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Admin Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Work Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                              <Shield className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                              {admin.fullname}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                              @{admin.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {admin.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          {admin.phone}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {admin.department}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          {admin.adminArea}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {admin.company ? (
                          <>
                            <div className="text-sm font-semibold text-gray-900">
                              {admin.company.company_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {admin.company.company_email}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-400 italic">
                            No company assigned
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          admin.status === 'active' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(admin.lastLogin)}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewAdmin(admin)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="View Admin Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditAdmin(admin)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit Admin"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete Admin"
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

        {/* Create Admin Modal */}
        <CreateAdminModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateAdmin}
          companies={companies}
          loading={createLoading}
        />

        {/* Admin Details Modal */}
        <AdminDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedAdmin(null);
          }}
          admin={selectedAdmin}
        />

        {/* Edit Admin Modal */}
        <EditAdminModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingAdmin(null);
          }}
          onSubmit={handleUpdateAdmin}
          admin={editingAdmin}
          companies={companies}
          loading={editLoading}
        />

        {/* Delete Admin Modal */}
        <DeleteAdminModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingAdmin(null);
          }}
          onConfirm={handleConfirmDeleteAdmin}
          admin={deletingAdmin}
          loading={deleteLoading}
        />
      </div>
    </Layout>
  );
}
