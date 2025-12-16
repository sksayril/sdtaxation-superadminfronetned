import { Loader2 } from 'lucide-react';

interface SkeletonLoaderProps {
  type?: 'table' | 'card' | 'text' | 'button' | 'avatar';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ type = 'text', count = 1, className = '' }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'table':
        return (
          <div className="animate-pulse">
            <div className="space-y-4">
              {/* Table Header */}
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              
              {/* Table Rows */}
              {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="animate-pulse space-y-4">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'avatar':
        return (
          <div className="animate-pulse">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'button':
        return (
          <div className="animate-pulse">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded-lg w-24"></div>
            ))}
          </div>
        );

      case 'text':
      default:
        return (
          <div className="animate-pulse space-y-2">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`${className}`}>
      {renderSkeleton()}
    </div>
  );
}

// Specific skeleton components for common use cases
export function AdminTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {Array.from({ length: count }).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
    </div>
  );
}
