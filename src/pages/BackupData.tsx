import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { HardDrive, ArrowLeft, Download, Upload, Trash2, Calendar, Clock } from 'lucide-react';

interface Backup {
  id: string;
  name: string;
  date: string;
  time: string;
  size: string;
  type: 'Full' | 'Incremental';
  status: 'Completed' | 'In Progress' | 'Failed';
}

export default function BackupData() {
  const navigate = useNavigate();
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backups] = useState<Backup[]>([
    {
      id: '1',
      name: 'Full Backup - 2024-01-15',
      date: '2024-01-15',
      time: '02:30 AM',
      size: '2.45 GB',
      type: 'Full',
      status: 'Completed'
    },
    {
      id: '2',
      name: 'Incremental Backup - 2024-01-14',
      date: '2024-01-14',
      time: '02:30 AM',
      size: '450 MB',
      type: 'Incremental',
      status: 'Completed'
    },
    {
      id: '3',
      name: 'Full Backup - 2024-01-13',
      date: '2024-01-13',
      time: '02:30 AM',
      size: '2.38 GB',
      type: 'Full',
      status: 'Completed'
    }
  ]);

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    // Simulate backup creation
    setTimeout(() => {
      setIsCreatingBackup(false);
      alert('Backup created successfully!');
    }, 3000);
  };

  const handleDownload = (backup: Backup) => {
    alert(`Downloading backup: ${backup.name}`);
  };

  const handleDelete = (backupId: string) => {
    if (confirm('Are you sure you want to delete this backup?')) {
      alert(`Backup ${backupId} deleted`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Full' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  return (
    <Layout title="Backup Data">
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <HardDrive className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Backup Data</h1>
              <p className="text-gray-600">Create and manage data backups</p>
            </div>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingBackup ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Creating Backup...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Create Backup</span>
              </>
            )}
          </button>
        </div>

        {/* Backup Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Backups</p>
                <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <HardDrive className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">5.28 GB</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Download className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Backup</p>
                <p className="text-2xl font-bold text-gray-900">2 days ago</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Backup List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Backup History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Backup Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <HardDrive className="text-purple-600 mr-2" size={16} />
                        <span className="text-sm font-medium text-gray-900">{backup.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>{backup.date}</span>
                        <Clock size={14} />
                        <span>{backup.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(backup.type)}`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {backup.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(backup.status)}`}>
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDownload(backup)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(backup.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">Backup Information</h3>
          <p className="text-sm text-purple-800">
            Regular backups ensure data safety and quick recovery in case of system failures. 
            Full backups contain all data, while incremental backups only include changes since the last backup.
          </p>
        </div>
      </div>
    </Layout>
  );
}
