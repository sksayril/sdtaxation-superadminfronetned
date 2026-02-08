import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Download, ArrowLeft, FileDown, Package, Database, Server } from 'lucide-react';

export default function DownloadSetup() {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState<string | null>(null);

  const setupFiles = [
    {
      id: '1',
      name: 'System Configuration Package',
      description: 'Complete system configuration files and settings',
      size: '2.5 MB',
      type: 'Configuration',
      icon: Package,
      color: 'blue'
    },
    {
      id: '2',
      name: 'Database Schema',
      description: 'Database structure and migration files',
      size: '1.8 MB',
      type: 'Database',
      icon: Database,
      color: 'green'
    },
    {
      id: '3',
      name: 'Server Configuration',
      description: 'Server setup files and environment configurations',
      size: '950 KB',
      type: 'Server',
      icon: Server,
      color: 'purple'
    },
    {
      id: '4',
      name: 'Application Setup Files',
      description: 'All application setup and installation files',
      size: '15.2 MB',
      type: 'Application',
      icon: FileDown,
      color: 'orange'
    }
  ];

  const handleDownload = (fileId: string, fileName: string) => {
    setDownloading(fileId);
    // Simulate download
    setTimeout(() => {
      setDownloading(null);
      alert(`Downloaded: ${fileName}`);
    }, 2000);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <Layout title="Download Setup">
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
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="text-green-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Download Setup</h1>
              <p className="text-gray-600">Download system setup files and configuration packages</p>
            </div>
          </div>
        </div>

        {/* Download Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {setupFiles.map((file) => {
            const Icon = file.icon;
            const colors = getColorClasses(file.color);
            const isDownloading = downloading === file.id;

            return (
              <div
                key={file.id}
                className={`bg-white rounded-xl shadow-sm p-6 border ${colors.border} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`p-3 ${colors.bg} rounded-lg`}>
                    <Icon className={colors.text} size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{file.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{file.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded">{file.type}</span>
                      <span>{file.size}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(file.id, file.name)}
                  disabled={isDownloading}
                  className={`w-full px-4 py-2 text-sm font-medium text-white ${colors.bg.replace('100', '600')} rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Download All Button */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Download All Files</h3>
              <p className="text-sm text-gray-600">
                Download all setup files as a single package (20.45 MB)
              </p>
            </div>
            <button
              onClick={() => handleDownload('all', 'Complete Setup Package')}
              disabled={downloading !== null}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              <span>Download All</span>
            </button>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-green-900 mb-2">Download Information</h3>
          <p className="text-sm text-green-800">
            All setup files are provided in standard formats and can be used to configure new installations 
            or restore system settings. Make sure to keep these files secure as they contain sensitive configuration data.
          </p>
        </div>
      </div>
    </Layout>
  );
}
