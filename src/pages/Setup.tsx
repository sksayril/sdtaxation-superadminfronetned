import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Wrench, Download, HardDrive, Calendar, RefreshCw } from 'lucide-react';

export default function Setup() {
  const navigate = useNavigate();

  return (
    <Layout title="Setup">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wrench className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Setup & Configuration</h1>
            <p className="text-gray-600">Configure system settings and preferences</p>
          </div>
        </div>

        {/* Setup Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Setup */}
          <div 
            onClick={() => navigate('/setup/configuration')}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wrench className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Setup</h3>
                <p className="text-sm text-gray-500">System setup</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Configure initial system settings and application preferences.
            </p>
          </div>

          {/* Download Setup */}
          <div 
            onClick={() => navigate('/setup/download')}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Download Setup</h3>
                <p className="text-sm text-gray-500">Download configuration</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Download system setup files and configuration packages.
            </p>
          </div>

          {/* Backup Data */}
          <div 
            onClick={() => navigate('/setup/backup')}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <HardDrive className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Backup Data</h3>
                <p className="text-sm text-gray-500">Data backup</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Create and manage data backups to ensure data safety and recovery.
            </p>
          </div>

          {/* Split Financial Year */}
          <div 
            onClick={() => navigate('/setup/split-financial-year')}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Split Financial Year</h3>
                <p className="text-sm text-gray-500">Financial year management</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Split and manage financial year periods for accounting and reporting.
            </p>
          </div>

          {/* Version Updates */}
          <div 
            onClick={() => navigate('/setup/version-updates')}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <RefreshCw className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Version Updates</h3>
                <p className="text-sm text-gray-500">System updates</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Check for and manage system version updates and patches.
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Setup Information</h3>
          <p className="text-blue-800 text-sm">
            Use the setup options above to configure various aspects of your system. 
            Each section allows you to manage specific settings and preferences for optimal system performance.
          </p>
        </div>
      </div>
    </Layout>
  );
}
