import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <Layout title="My Profile">
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-gray-600" size={20} />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="text-gray-600" size={20} />
              <div>
                <p className="font-medium text-gray-900">Role</p>
                <p className="text-gray-600">{user?.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}