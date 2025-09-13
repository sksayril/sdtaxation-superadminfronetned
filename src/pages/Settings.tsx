import React from 'react';
import Layout from '../components/Layout';

export default function Settings() {
  return (
    <Layout title="Settings">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
          <p className="text-gray-600">Application settings coming soon...</p>
        </div>
      </div>
    </Layout>
  );
}