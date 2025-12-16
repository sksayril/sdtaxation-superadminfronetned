import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiService, type DashboardData } from '../services/api';
import { toast } from '../utils/toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Receipt, Calculator, 
  Wallet, CreditCard, Building2, Package, RefreshCw,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { LoadingSpinner } from '../components/SkeletonLoader';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardData();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        toast.error('Failed to fetch dashboard data', '❌ Fetch Error');
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data. Please try again.', '❌ Network Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Get icon component based on icon name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'revenue':
        return <DollarSign className="text-blue-600" size={24} />;
      case 'clients':
        return <Users className="text-orange-600" size={24} />;
      case 'companies':
        return <Building2 className="text-green-600" size={24} />;
      case 'balance':
        return <Wallet className="text-purple-600" size={24} />;
      default:
        return <DollarSign className="text-blue-600" size={24} />;
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'down':
        return <TrendingDown className="text-red-500" size={16} />;
      default:
        return <Minus className="text-gray-400" size={16} />;
    }
  };

  // Get trend color
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Prepare chart data
  const revenueChartData = dashboardData?.revenueTrend.map(item => ({
    month: item.month.split(' ')[0],
    revenue: item.revenue,
    subscriptions: item.subscriptions
  })) || [];

  const serviceDistributionData = dashboardData?.serviceDistribution.map((item, index) => {
    const colors = ['#3B82F6', '#F97316', '#10B981', '#8B5CF6', '#EC4899', '#14B8A6'];
    return {
      name: item.name,
      value: parseFloat(item.percentage),
      count: item.count,
      color: colors[index % colors.length]
    };
  }) || [];

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout title="Dashboard">
        <div className="text-center py-12">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={20} />
            <span>Refresh</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</p>
                  <div className="flex items-center text-sm">
                    {getTrendIcon(kpi.trend)}
                    <span className={`ml-1 ${getTrendColor(kpi.trend)}`}>
                      {kpi.change !== '0' && kpi.change !== '0.0' ? `${kpi.change}%` : 'No change'}
                    </span>
                    <span className="text-gray-500 ml-1">from last period</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-full">
                  {getIcon(kpi.icon)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹{dashboardData.summary.totalRevenue.toLocaleString()}</p>
                <p className="text-blue-200 text-xs mt-1">Active: ₹{dashboardData.summary.activeRevenue.toLocaleString()}</p>
              </div>
              <DollarSign size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Balance</p>
                <p className="text-2xl font-bold">₹{dashboardData.summary.totalBalance.toLocaleString()}</p>
                <p className="text-green-200 text-xs mt-1">System Balance</p>
              </div>
              <Wallet size={32} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Returns Filed</p>
                <p className="text-2xl font-bold">{dashboardData.summary.returnsFiled.toLocaleString()}</p>
                <p className="text-orange-200 text-xs mt-1">Total returns processed</p>
              </div>
              <Receipt size={32} className="text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Tax Saved</p>
                <p className="text-2xl font-bold">₹{dashboardData.summary.taxSaved.toLocaleString()}</p>
                <p className="text-purple-200 text-xs mt-1">For all clients</p>
              </div>
              <Calculator size={32} className="text-purple-200" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="url(#blueGradient)" radius={4} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Service Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Distribution</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {serviceDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {serviceDistributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subscriptions Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="text-purple-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Subscriptions</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-lg font-bold text-gray-900">{dashboardData.subscriptions.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="text-sm font-semibold text-green-600">{dashboardData.subscriptions.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expired</span>
                <span className="text-sm font-semibold text-red-600">{dashboardData.subscriptions.expired}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="text-sm font-semibold text-gray-600">{dashboardData.subscriptions.cancelled}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total Revenue</span>
                  <span className="text-sm font-bold text-gray-900">₹{dashboardData.subscriptions.revenue.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Active Revenue</span>
                  <span className="text-xs text-green-600">₹{dashboardData.subscriptions.revenue.active.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Companies Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Companies</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-lg font-bold text-gray-900">{dashboardData.companies.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="text-sm font-semibold text-green-600">{dashboardData.companies.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inactive</span>
                <span className="text-sm font-semibold text-gray-600">{dashboardData.companies.inactive}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Suspended</span>
                <span className="text-sm font-semibold text-yellow-600">{dashboardData.companies.suspended}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">With Subscription</span>
                  <span className="text-sm font-bold text-green-600">{dashboardData.companies.withSubscription}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Without Subscription</span>
                  <span className="text-xs text-red-600">{dashboardData.companies.withoutSubscription}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Users Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Users</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="text-lg font-bold text-gray-900">{dashboardData.users.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Admins</span>
                <span className="text-sm font-semibold text-blue-600">
                  {dashboardData.users.admins.active}/{dashboardData.users.admins.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">HR</span>
                <span className="text-sm font-semibold text-purple-600">
                  {dashboardData.users.hr.active}/{dashboardData.users.hr.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Employees</span>
                <span className="text-sm font-semibold text-green-600">
                  {dashboardData.users.employees.active.toLocaleString()}/{dashboardData.users.employees.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Balances Table */}
        {dashboardData.companyBalances && dashboardData.companyBalances.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Company Balances</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ledgers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vouchers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.companyBalances.map((company) => (
                    <tr key={company.companyId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{company.companyName}</div>
                          <div className="text-sm text-gray-500">{company.companyEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          company.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : company.status === 'suspended'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {company.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{company.balance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {company.ledgerCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {company.voucherCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {company.subscription ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company.subscription.planName}</div>
                            <div className="text-xs text-gray-500">
                              {company.subscription.status} • {new Date(company.subscription.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">No subscription</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'Receipt' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'Receipt' ? (
                        <ArrowUpRight className={`${transaction.type === 'Receipt' ? 'text-green-600' : 'text-red-600'}`} size={20} />
                      ) : (
                        <ArrowDownRight className="text-red-600" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.voucherNumber}</p>
                      <p className="text-xs text-gray-500">{transaction.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      transaction.type === 'Receipt' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'Receipt' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Plans Summary */}
        {dashboardData.plans && dashboardData.plans.list.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
              <span className="text-sm text-gray-500">
                {dashboardData.plans.active} active of {dashboardData.plans.total} total
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.plans.list.map((plan) => (
                <div key={plan.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{plan.name}</h4>
                    {plan.isActive && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-gray-900">₹{plan.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-gray-900">{plan.duration} months</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
