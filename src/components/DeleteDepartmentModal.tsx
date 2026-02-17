import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { Department } from '../services/api';

interface DeleteDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (departmentId: string) => Promise<void>;
  department: Department | null;
  loading?: boolean;
}

export default function DeleteDepartmentModal({
  isOpen,
  onClose,
  onConfirm,
  department,
  loading = false
}: DeleteDepartmentModalProps) {
  const handleConfirm = async () => {
    if (department) {
      await onConfirm(department._id);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Department</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Are you sure you want to delete this department?
              </h4>
              {department && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Department Name:</span> {department.department_name}
                  </p>
                  {department.description && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Description:</span> {department.description}
                    </p>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-600">
                This action cannot be undone. The department will be permanently deleted from the system.
                <br />
                <span className="font-semibold text-red-600 mt-2 block">
                  Note: You cannot delete a department if it is assigned to any admins or employees.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 border border-transparent rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} />
                <span>Delete Department</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
