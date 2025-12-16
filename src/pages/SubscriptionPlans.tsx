import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CreateSubscriptionPlanModal from '../components/CreateSubscriptionPlanModal';
import EditSubscriptionPlanModal from '../components/EditSubscriptionPlanModal';
import DeleteSubscriptionPlanModal from '../components/DeleteSubscriptionPlanModal';
import { apiService, type SubscriptionPlan, type CreateSubscriptionPlanRequest } from '../services/api';
import { toast } from '../utils/toast';
import { Package, Plus, Search, Edit, Trash2, RefreshCw, CheckCircle } from 'lucide-react';

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState<SubscriptionPlan | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch subscription plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscriptionPlans();
      if (response.success) {
        setPlans(response.data);
      } else {
        toast.error('Failed to fetch subscription plans', '❌ Fetch Error');
      }
    } catch (error: any) {
      console.error('Error fetching subscription plans:', error);
      toast.error('Failed to fetch subscription plans. Please try again.', '❌ Network Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle create subscription plan
  const handleCreatePlan = async (planData: CreateSubscriptionPlanRequest) => {
    try {
      setCreateLoading(true);
      const response = await apiService.createSubscriptionPlan(planData);
      if (response.success) {
        toast.success('Subscription plan created successfully!', '🎉 Success!');
        setCreateModalOpen(false);
        await fetchPlans();
      } else {
        toast.error(response.message || 'Failed to create subscription plan', '❌ Creation Failed');
      }
    } catch (error: any) {
      console.error('Error creating subscription plan:', error);
      toast.error('Failed to create subscription plan. Please try again.', '❌ Network Error');
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle edit subscription plan
  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setEditModalOpen(true);
  };

  // Handle update subscription plan
  const handleUpdatePlan = async (planId: string, planData: Partial<CreateSubscriptionPlanRequest>) => {
    try {
      setEditLoading(true);
      const response = await apiService.updateSubscriptionPlan(planId, planData);
      if (response.success) {
        toast.success('Subscription plan updated successfully!', '✅ Update Success');
        setEditModalOpen(false);
        setEditingPlan(null);
        await fetchPlans();
      } else {
        toast.error(response.message || 'Failed to update subscription plan', '❌ Update Failed');
      }
    } catch (error: any) {
      console.error('Error updating subscription plan:', error);
      toast.error('Failed to update subscription plan. Please try again.', '❌ Network Error');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete subscription plan
  const handleDeletePlan = (plan: SubscriptionPlan) => {
    setDeletingPlan(plan);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete subscription plan
  const handleConfirmDeletePlan = async (planId: string) => {
    try {
      setDeleteLoading(true);
      const response = await apiService.deleteSubscriptionPlan(planId);
      if (response.success) {
        toast.success('Subscription plan deleted successfully!', '✅ Delete Success');
        setDeleteModalOpen(false);
        setDeletingPlan(null);
        await fetchPlans();
      } else {
        toast.error(response.message || 'Failed to delete subscription plan', '❌ Delete Failed');
      }
    } catch (error: any) {
      console.error('Error deleting subscription plan:', error);
      toast.error('Failed to delete subscription plan. Please try again.', '❌ Network Error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter plans
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterActive === 'all' || 
                         (filterActive === 'active' && plan.isActive) ||
                         (filterActive === 'inactive' && !plan.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title="Subscription Plans">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="text-green-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${plans.length} plans available`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchPlans}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={20} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={20} />
              <span>Create Plan</span>
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
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading plans...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
            <p className="text-gray-600">
              {searchTerm || filterActive !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first subscription plan.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div key={plan._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.planName}</h3>
                    {plan.description && (
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    plan.isActive 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {plan.currency || 'INR'} {plan.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium text-gray-900">{plan.duration} months</span>
                  </div>
                  {plan.maxEmployees !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Max Employees</span>
                      <span className="text-sm font-medium text-gray-900">{plan.maxEmployees}</span>
                    </div>
                  )}
                  {plan.maxAdmins && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Max Admins</span>
                      <span className="text-sm font-medium text-gray-900">{plan.maxAdmins}</span>
                    </div>
                  )}
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-xs text-gray-500">+{plan.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Created {new Date(plan.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Plan"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Subscription Plan Modal */}
        <CreateSubscriptionPlanModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreatePlan}
          loading={createLoading}
        />

        {/* Edit Subscription Plan Modal */}
        <EditSubscriptionPlanModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingPlan(null);
          }}
          onSubmit={handleUpdatePlan}
          plan={editingPlan}
          loading={editLoading}
        />

        {/* Delete Subscription Plan Modal */}
        <DeleteSubscriptionPlanModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingPlan(null);
          }}
          onConfirm={handleConfirmDeletePlan}
          plan={deletingPlan}
          loading={deleteLoading}
        />
      </div>
    </Layout>
  );
}

