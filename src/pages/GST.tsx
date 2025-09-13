import React from 'react';
import Layout from '../components/Layout';
import { Calculator, FileText, Download, Upload } from 'lucide-react';

export default function GST() {
  return (
    <Layout title="GST Management">
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">GSTR-1</h3>
                <p className="text-sm text-gray-600">Outward Supplies</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-50 rounded-full">
                <Calculator className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">GSTR-3B</h3>
                <p className="text-sm text-gray-600">Monthly Return</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-50 rounded-full">
                <Upload className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">File Return</h3>
                <p className="text-sm text-gray-600">Submit GST Return</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <Download className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Download</h3>
                <p className="text-sm text-gray-600">Export Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* GST Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">GST Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">₹2,45,000</h3>
              <p className="text-blue-800 font-medium">Total GST Collected</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">₹1,85,000</h3>
              <p className="text-green-800 font-medium">Input Tax Credit</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-600">₹60,000</h3>
              <p className="text-orange-800 font-medium">Net GST Payable</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}