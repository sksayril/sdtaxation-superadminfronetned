import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AssignSubscriptionModal from '../components/AssignSubscriptionModal';
import EditCompanySubscriptionModal from '../components/EditCompanySubscriptionModal';
import DeleteCompanySubscriptionModal from '../components/DeleteCompanySubscriptionModal';
import { apiService, type CompanySubscription, type Company, type SubscriptionPlan, type AssignSubscriptionRequest, type UpdateSubscriptionRequest } from '../services/api';
import { toast } from '../utils/toast';
import { CreditCard, Plus, Search, RefreshCw, Building2, Package, Calendar, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';

export default function CompanySubscriptions() {
  const [subscriptions, setSubscriptions] = useState<CompanySubscription[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<CompanySubscription | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingSubscription, setDeletingSubscription] = useState<CompanySubscription | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCompanySubscriptions();
      if (response.success) {
        setSubscriptions(response.data);
      } else {
        toast.error('Failed to fetch subscriptions', '❌ Fetch Error');
      }
    } catch (error: any) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to fetch subscriptions. Please try again.', '❌ Network Error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await apiService.getCompanies();
      if (response.success) {
        setCompanies(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to fetch companies', '❌ Fetch Error');
    }
  };

  // Fetch subscription plans
  const fetchPlans = async () => {
    try {
      const response = await apiService.getSubscriptionPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching subscription plans:', error);
      toast.error('Failed to fetch subscription plans', '❌ Fetch Error');
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchCompanies();
    fetchPlans();
  }, []);

  // Fetch companies and plans when assign modal opens
  useEffect(() => {
    if (assignModalOpen) {
      fetchCompanies();
      fetchPlans();
    }
  }, [assignModalOpen]);

  // Handle assign subscription
  const handleAssignSubscription = async (subscriptionData: AssignSubscriptionRequest) => {
    try {
      setAssignLoading(true);
      const response = await apiService.assignSubscription(subscriptionData);
      if (response.success) {
        toast.success('Subscription assigned to company successfully!', '🎉 Success!');
        setAssignModalOpen(false);
        await fetchSubscriptions();
      } else {
        toast.error(response.message || 'Failed to assign subscription', '❌ Assignment Failed');
      }
    } catch (error: any) {
      console.error('Error assigning subscription:', error);
      toast.error('Failed to assign subscription. Please try again.', '❌ Network Error');
    } finally {
      setAssignLoading(false);
    }
  };

  // Handle edit subscription
  const handleEditSubscription = (subscription: CompanySubscription) => {
    setEditingSubscription(subscription);
    setEditModalOpen(true);
  };

  // Handle update subscription
  const handleUpdateSubscription = async (subscriptionId: string, subscriptionData: UpdateSubscriptionRequest) => {
    try {
      setEditLoading(true);
      const response = await apiService.updateCompanySubscription(subscriptionId, subscriptionData);
      if (response.success) {
        toast.success('Subscription updated successfully!', '✅ Update Success');
        setEditModalOpen(false);
        setEditingSubscription(null);
        await fetchSubscriptions();
      } else {
        toast.error(response.message || 'Failed to update subscription', '❌ Update Failed');
      }
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription. Please try again.', '❌ Network Error');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete subscription
  const handleDeleteSubscription = (subscription: CompanySubscription) => {
    setDeletingSubscription(subscription);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete subscription
  const handleConfirmDeleteSubscription = async (subscriptionId: string) => {
    try {
      setDeleteLoading(true);
      const response = await apiService.deleteCompanySubscription(subscriptionId);
      if (response.success) {
        toast.success('Subscription deleted successfully!', '✅ Delete Success');
        setDeleteModalOpen(false);
        setDeletingSubscription(null);
        await fetchSubscriptions();
      } else {
        toast.error(response.message || 'Failed to delete subscription', '❌ Delete Failed');
      }
    } catch (error: any) {
      console.error('Error deleting subscription:', error);
      toast.error('Failed to delete subscription. Please try again.', '❌ Network Error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.plan.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesCompany = !selectedCompany || sub.company._id === selectedCompany;
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Company Subscriptions">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Subscriptions</h1>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${subscriptions.length} active subscriptions`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                fetchSubscriptions();
                fetchCompanies();
              }}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={20} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setAssignModalOpen(true)}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              <span>Assign Subscription</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by company or plan name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.company_name}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Subscriptions Table */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading subscriptions...</p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' || selectedCompany
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by assigning a subscription to a company.'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Auto Renew
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {subscription.company.company_name}
                            </div>
                            {subscription.company.company_email && (
                              <div className="text-sm text-gray-500">
                                {subscription.company.company_email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {subscription.plan.planName}
                            </div>
                            {subscription.plan.price && (
                              <div className="text-sm text-gray-500">
                                ₹{subscription.plan.price.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscription.autoRenew ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditSubscription(subscription)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Subscription"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSubscription(subscription)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Delete Subscription"
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
          </div>
        )}

        {/* Assign Subscription Modal */}
        <AssignSubscriptionModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          onSubmit={handleAssignSubscription}
          companies={companies}
          plans={plans}
          loading={assignLoading}
        />

        {/* Edit Company Subscription Modal */}
        <EditCompanySubscriptionModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingSubscription(null);
          }}
          onSubmit={handleUpdateSubscription}
          subscription={editingSubscription}
          loading={editLoading}
        />

        {/* Delete Company Subscription Modal */}
        <DeleteCompanySubscriptionModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingSubscription(null);
          }}
          onConfirm={handleConfirmDeleteSubscription}
          subscription={deletingSubscription}
          loading={deleteLoading}
        />
      </div>
    </Layout>
  );
}

