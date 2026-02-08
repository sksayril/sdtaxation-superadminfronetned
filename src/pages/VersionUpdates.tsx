import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { RefreshCw, ArrowLeft, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Update {
  id: string;
  version: string;
  releaseDate: string;
  description: string;
  type: 'Major' | 'Minor' | 'Patch';
  status: 'Available' | 'Installed' | 'Pending';
  size: string;
}

export default function VersionUpdates() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [updates] = useState<Update[]>([
    {
      id: '1',
      version: '2.1.0',
      releaseDate: '2024-01-10',
      description: 'Major update with new features and performance improvements',
      type: 'Major',
      status: 'Available',
      size: '125 MB'
    },
    {
      id: '2',
      version: '2.0.5',
      releaseDate: '2024-01-05',
      description: 'Bug fixes and security patches',
      type: 'Patch',
      status: 'Installed',
      size: '45 MB'
    },
    {
      id: '3',
      version: '2.0.4',
      releaseDate: '2023-12-20',
      description: 'Minor improvements and bug fixes',
      type: 'Minor',
      status: 'Installed',
      size: '32 MB'
    }
  ]);

  const [currentVersion] = useState('2.0.5');

  const handleCheckUpdates = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      alert('No new updates available. You are on the latest version.');
    }, 2000);
  };

  const handleInstall = (update: Update) => {
    if (confirm(`Install version ${update.version}? This may require system restart.`)) {
      alert(`Installing version ${update.version}...`);
    }
  };

  const handleDownload = (update: Update) => {
    alert(`Downloading version ${update.version}...`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Major':
        return 'bg-blue-100 text-blue-800';
      case 'Minor':
        return 'bg-green-100 text-green-800';
      case 'Patch':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-orange-100 text-orange-800';
      case 'Installed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Version Updates">
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
            <div className="p-2 bg-indigo-100 rounded-lg">
              <RefreshCw className="text-indigo-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Version Updates</h1>
              <p className="text-gray-600">Check for and manage system version updates</p>
            </div>
          </div>
          <button
            onClick={handleCheckUpdates}
            disabled={checking}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Checking...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Check for Updates</span>
              </>
            )}
          </button>
        </div>

        {/* Current Version Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 mb-1">Current Version</p>
              <p className="text-3xl font-bold mb-2">v{currentVersion}</p>
              <p className="text-indigo-100 text-sm">System is up to date</p>
            </div>
            <div className="p-4 bg-white bg-opacity-20 rounded-lg">
              <CheckCircle size={32} />
            </div>
          </div>
        </div>

        {/* Available Updates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Update History</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {updates.map((update) => (
              <div key={update.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <RefreshCw className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-semibold text-gray-900">Version {update.version}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(update.type)}`}>
                          {update.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(update.status)}`}>
                          {update.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{new Date(update.releaseDate).toLocaleDateString('en-GB')}</span>
                        </div>
                        <span>•</span>
                        <span>{update.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 ml-11">{update.description}</p>
                <div className="flex items-center space-x-2 ml-11">
                  {update.status === 'Available' && (
                    <>
                      <button
                        onClick={() => handleInstall(update)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                      >
                        <Download size={14} />
                        <span>Install Update</span>
                      </button>
                      <button
                        onClick={() => handleDownload(update)}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Download
                      </button>
                    </>
                  )}
                  {update.status === 'Installed' && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">Installed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-blue-600 mt-0.5" size={20} />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Update Recommendations</h3>
                <p className="text-sm text-blue-800">
                  It's recommended to install updates regularly to get the latest features, 
                  security patches, and bug fixes. Always backup your data before installing major updates.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-indigo-600 mt-0.5" size={20} />
              <div>
                <h3 className="text-sm font-semibold text-indigo-900 mb-1">Auto-Update Settings</h3>
                <p className="text-sm text-indigo-800">
                  Enable automatic updates to receive patches and minor updates automatically. 
                  Major updates will still require manual approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
