import React from 'react';
import Layout from '../components/Layout';
import { Wrench, Database, Server, Key, Globe, Shield } from 'lucide-react';

export default function Setup() {
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
          {/* Database Configuration */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Database className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Database</h3>
                <p className="text-sm text-gray-500">Database settings</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Configure database connections and manage data storage settings.
            </p>
          </div>

          {/* Server Configuration */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Server className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Server</h3>
                <p className="text-sm text-gray-500">Server configuration</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Manage server settings, ports, and network configurations.
            </p>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Key className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                <p className="text-sm text-gray-500">API configuration</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Manage API keys and third-party service integrations.
            </p>
          </div>

          {/* Domain Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Globe className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Domain</h3>
                <p className="text-sm text-gray-500">Domain settings</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Configure domain names, SSL certificates, and DNS settings.
            </p>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Shield className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                <p className="text-sm text-gray-500">Security configuration</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Manage security policies, authentication, and access controls.
            </p>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Wrench className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System</h3>
                <p className="text-sm text-gray-500">System preferences</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Configure system-wide settings and application preferences.
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
