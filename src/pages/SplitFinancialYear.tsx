import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Calendar, ArrowLeft, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';

interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive' | 'Closed';
}

export default function SplitFinancialYear() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([
    {
      id: '1',
      name: 'FY 2023-24',
      startDate: '2023-04-01',
      endDate: '2024-03-31',
      status: 'Active'
    },
    {
      id: '2',
      name: 'FY 2022-23',
      startDate: '2022-04-01',
      endDate: '2023-03-31',
      status: 'Closed'
    },
    {
      id: '3',
      name: 'FY 2021-22',
      startDate: '2021-04-01',
      endDate: '2022-03-31',
      status: 'Closed'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newYear: FinancialYear = {
      id: Date.now().toString(),
      ...formData,
      status: 'Active'
    };
    setFinancialYears([newYear, ...financialYears]);
    setFormData({ name: '', startDate: '', endDate: '' });
    setShowModal(false);
    alert('Financial year created successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this financial year?')) {
      setFinancialYears(financialYears.filter(year => year.id !== id));
      alert('Financial year deleted successfully!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Split Financial Year">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/setup')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="text-gray-600" size={20} />
            </button>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="text-orange-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Split Financial Year</h1>
              <p className="text-gray-600">Manage financial year periods for accounting and reporting</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Financial Year</span>
          </button>
        </div>

        {/* Financial Years List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financialYears.map((year) => (
            <div
              key={year.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{year.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(year.status)}`}>
                      {year.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(year.startDate).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(year.endDate).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <button
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                  title="Edit"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(year.id)}
                  className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Financial Year Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Add Financial Year</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Year Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., FY 2024-25"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle size={16} />
                    <span>Create</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Information Card */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="text-orange-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-orange-900 mb-1">Financial Year Management</h3>
              <p className="text-sm text-orange-800">
                Financial years are used to organize accounting periods and generate reports. 
                You can create multiple financial years and switch between them as needed. 
                Only one financial year can be active at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
