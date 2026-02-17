import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Check, Building2, Plus, Search, Edit, Trash2, RefreshCw, Briefcase } from 'lucide-react';
import { apiService, type Department } from '../services/api';
import { toast } from '../utils/toast';
import CreateDepartmentModal from '../components/CreateDepartmentModal';
import EditDepartmentModal from '../components/EditDepartmentModal';
import DeleteDepartmentModal from '../components/DeleteDepartmentModal';
import { LoadingSpinner } from '../components/SkeletonLoader';

export default function Settings() {
  const { theme, themeName, setTheme, availableThemes } = useTheme();
  
  // Department Management State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [createDepartmentModalOpen, setCreateDepartmentModalOpen] = useState(false);
  const [editDepartmentModalOpen, setEditDepartmentModalOpen] = useState(false);
  const [deleteDepartmentModalOpen, setDeleteDepartmentModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const getThemeColorClass = (themeName: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600',
      red: 'bg-red-600',
      indigo: 'bg-indigo-600',
      black: 'bg-gray-900',
      pink: 'bg-pink-600',
      teal: 'bg-teal-600',
      cyan: 'bg-cyan-600',
      white: 'bg-white border-2 border-gray-300',
    };
    return colorMap[themeName] || 'bg-blue-600';
  };

  const getThemeBorderClass = (themeName: string) => {
    const borderMap: Record<string, string> = {
      blue: 'border-blue-100',
      purple: 'border-purple-100',
      green: 'border-green-100',
      orange: 'border-orange-100',
      red: 'border-red-100',
      indigo: 'border-indigo-100',
      black: 'border-gray-200',
      pink: 'border-pink-100',
      teal: 'border-teal-100',
      cyan: 'border-cyan-100',
      white: 'border-gray-300',
    };
    return borderMap[themeName] || 'border-blue-100';
  };

  const getThemeLightClass = (themeName: string) => {
    const lightMap: Record<string, string> = {
      blue: 'bg-blue-50',
      purple: 'bg-purple-50',
      green: 'bg-green-50',
      orange: 'bg-orange-50',
      red: 'bg-red-50',
      indigo: 'bg-indigo-50',
      black: 'bg-gray-50',
      pink: 'bg-pink-50',
      teal: 'bg-teal-50',
      cyan: 'bg-cyan-50',
      white: 'bg-white',
    };
    return lightMap[themeName] || 'bg-blue-50';
  };

  const getThemeTextClass = (themeName: string) => {
    const textMap: Record<string, string> = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      indigo: 'text-indigo-600',
      black: 'text-gray-900',
      pink: 'text-pink-600',
      teal: 'text-teal-600',
      cyan: 'text-cyan-600',
      white: 'text-gray-900',
    };
    return textMap[themeName] || 'text-blue-600';
  };

  const getThemeBorderActiveClass = (themeName: string) => {
    const borderMap: Record<string, string> = {
      blue: 'border-blue-600',
      purple: 'border-purple-600',
      green: 'border-green-600',
      orange: 'border-orange-600',
      red: 'border-red-600',
      indigo: 'border-indigo-600',
      black: 'border-gray-900',
      pink: 'border-pink-600',
      teal: 'border-teal-600',
      cyan: 'border-cyan-600',
      white: 'border-gray-300',
    };
    return borderMap[themeName] || 'border-blue-600';
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const params: any = {};
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await apiService.getDepartments(params);
      if (response.success) {
        setDepartments(response.data);
      } else {
        toast.error(
          response.message || 'Failed to fetch departments',
          '❌ Fetch Error'
        );
      }
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      toast.error(
        'Failed to fetch departments. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // Load departments on component mount and when filter changes
  useEffect(() => {
    fetchDepartments();
  }, [filterStatus]);

  // Filter departments based on search (client-side filtering after API fetch)
  const filteredDepartments = departments.filter(dept => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      dept.department_name.toLowerCase().includes(search) ||
      (dept.description && dept.description.toLowerCase().includes(search))
    );
  });

  // Handle create department success
  const handleCreateSuccess = () => {
    fetchDepartments();
  };

  // Handle edit department
  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setEditDepartmentModalOpen(true);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    fetchDepartments();
    setEditDepartmentModalOpen(false);
    setSelectedDepartment(null);
  };

  // Handle delete department
  const handleDeleteDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setDeleteDepartmentModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async (departmentId: string) => {
    try {
      setDeleteLoading(true);
      const response = await apiService.deleteDepartment(departmentId);
      if (response.success) {
        toast.success(
          'Department deleted successfully!',
          '✅ Delete Success'
        );
        setDeleteDepartmentModalOpen(false);
        setSelectedDepartment(null);
        fetchDepartments();
      } else {
        toast.error(
          response.message || 'Failed to delete department',
          '❌ Delete Failed'
        );
      }
    } catch (error: any) {
      console.error('Error deleting department:', error);
      toast.error(
        error?.message || 'Failed to delete department. Please try again.',
        '❌ Network Error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Layout title="Settings">
      <div className="space-y-6">
        {/* Theme Selection */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border dark:border-gray-700 ${getThemeBorderClass(themeName)}`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-lg ${getThemeLightClass(themeName)} dark:bg-gray-700`}>
              <Palette className={getThemeTextClass(themeName)} size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Theme Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred color theme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {availableThemes.map((availableTheme) => {
              const isSelected = themeName === availableTheme.name;
              const isWhiteTheme = availableTheme.name === 'white';
              return (
                <button
                  key={availableTheme.name}
                  onClick={() => setTheme(availableTheme.name)}
                  className={`
                    w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95
                    ${getThemeColorClass(availableTheme.name)} 
                    ${isWhiteTheme ? 'text-gray-900' : 'text-white'}
                    ${isSelected ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''}
                  `}
                >
                  <Palette size={18} />
                  <span className="font-semibold">{availableTheme.displayName}</span>
                  {isSelected && (
                    <div className={`${isWhiteTheme ? 'bg-gray-200' : 'bg-white/20'} rounded-full p-0.5 ml-1`}>
                      <Check size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong className="dark:text-white">Current Theme:</strong> {theme.displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              The theme will be applied to the sidebar, cards, and page elements throughout the application.
            </p>
          </div>
        </div>

        {/* Department Management */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border dark:border-gray-700 ${getThemeBorderClass(themeName)}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getThemeLightClass(themeName)} dark:bg-gray-700`}>
                <Briefcase className={getThemeTextClass(themeName)} size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Department Management</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage departments in the system</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchDepartments}
                disabled={departmentsLoading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`${departmentsLoading ? 'animate-spin' : ''}`} size={20} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setCreateDepartmentModalOpen(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${getThemeColorClass(themeName)} hover:opacity-90`}
              >
                <Plus size={20} />
                <span>Create Department</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Departments Table */}
          <div className="overflow-x-auto">
            {departmentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="md" />
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={48} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {departments.length === 0 ? 'No Departments Created Yet' : 'No Departments Match Your Search'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {departments.length === 0
                    ? 'Get started by creating your first department.'
                    : 'Try adjusting your search terms or filter criteria.'
                  }
                </p>
                {departments.length === 0 && (
                  <button
                    onClick={() => setCreateDepartmentModalOpen(true)}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${getThemeColorClass(themeName)} hover:opacity-90`}
                  >
                    <Plus size={20} />
                    <span>Create Department</span>
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      SL No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Department Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
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
                  {filteredDepartments.map((department, index) => (
                    <tr key={department._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 dark:text-white text-center">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getThemeLightClass(themeName)} dark:bg-gray-700`}>
                              <Briefcase className={getThemeTextClass(themeName)} size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">{department.department_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white max-w-md">
                          {department.description || (
                            <span className="text-gray-400 dark:text-gray-500 italic">No description</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          department.status === 'active'
                            ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {department.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(department.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          by {department.created_by.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditDepartment(department)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Department"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(department)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Department"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Create Department Modal */}
        <CreateDepartmentModal
          isOpen={createDepartmentModalOpen}
          onClose={() => setCreateDepartmentModalOpen(false)}
          onSuccess={handleCreateSuccess}
          loading={false}
        />

        {/* Edit Department Modal */}
        <EditDepartmentModal
          isOpen={editDepartmentModalOpen}
          onClose={() => {
            setEditDepartmentModalOpen(false);
            setSelectedDepartment(null);
          }}
          onSuccess={handleEditSuccess}
          department={selectedDepartment}
          loading={false}
        />

        {/* Delete Department Modal */}
        <DeleteDepartmentModal
          isOpen={deleteDepartmentModalOpen}
          onClose={() => {
            setDeleteDepartmentModalOpen(false);
            setSelectedDepartment(null);
          }}
          onConfirm={handleConfirmDelete}
          department={selectedDepartment}
          loading={deleteLoading}
        />
      </div>
    </Layout>
  );
}
