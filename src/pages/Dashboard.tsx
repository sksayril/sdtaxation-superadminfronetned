import React from 'react';
import Layout from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Receipt, Calculator, Wallet, CreditCard } from 'lucide-react';

const salesData = [
  { month: 'Jan', amount: 65000 },
  { month: 'Feb', amount: 59000 },
  { month: 'Mar', amount: 80000 },
  { month: 'Apr', amount: 81000 },
  { month: 'May', amount: 56000 },
  { month: 'Jun', amount: 55000 },
];

const pieData = [
  { name: 'GST Returns', value: 35, color: '#3B82F6' },
  { name: 'ITR Filing', value: 25, color: '#F97316' },
  { name: 'TDS Returns', value: 20, color: '#10B981' },
  { name: 'Others', value: 20, color: '#8B5CF6' },
];

export default function Dashboard() {
  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹4,86,000</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-600">+12.5%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">1,248</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-600">+5.2%</span>
                  <span className="text-gray-500 ml-1">new this month</span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Returns Filed</p>
                <p className="text-2xl font-bold text-gray-900">856</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="text-red-500 mr-1" size={16} />
                  <span className="text-red-600">-2.1%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Receipt className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tax Saved</p>
                <p className="text-2xl font-bold text-gray-900">₹2,84,500</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                  <span className="text-green-600">+18.3%</span>
                  <span className="text-gray-500 ml-1">for clients</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Calculator className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
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
                <Bar dataKey="amount" fill="url(#blueGradient)" radius={4} />
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
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Cash Balance</p>
                <p className="text-2xl font-bold">₹85,430</p>
              </div>
              <Wallet size={32} className="text-blue-200" />
            </div>
            <div className="mt-4 pt-4 border-t border-blue-400">
              <input
                type="text"
                placeholder="Enter amount..."
                className="w-full bg-blue-400 bg-opacity-30 text-white placeholder-blue-200 border-0 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Bank Balance</p>
                <p className="text-2xl font-bold">₹3,42,150</p>
              </div>
              <CreditCard size={32} className="text-green-200" />
            </div>
            <div className="mt-4 pt-4 border-t border-green-400">
              <input
                type="text"
                placeholder="Enter amount..."
                className="w-full bg-green-400 bg-opacity-30 text-white placeholder-green-200 border-0 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Receivables</p>
                <p className="text-2xl font-bold">₹1,28,750</p>
              </div>
              <TrendingUp size={32} className="text-orange-200" />
            </div>
            <div className="mt-4 pt-4 border-t border-orange-400">
              <input
                type="text"
                placeholder="Enter amount..."
                className="w-full bg-orange-400 bg-opacity-30 text-white placeholder-orange-200 border-0 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Payables</p>
                <p className="text-2xl font-bold">₹64,320</p>
              </div>
              <TrendingDown size={32} className="text-red-200" />
            </div>
            <div className="mt-4 pt-4 border-t border-red-400">
              <input
                type="text"
                placeholder="Enter amount..."
                className="w-full bg-red-400 bg-opacity-30 text-white placeholder-red-200 border-0 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'GST Return filed for ABC Corp', time: '2 hours ago', type: 'success' },
              { action: 'ITR submitted for John Doe', time: '4 hours ago', type: 'info' },
              { action: 'TDS payment processed', time: '6 hours ago', type: 'warning' },
              { action: 'New client registration completed', time: '1 day ago', type: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}