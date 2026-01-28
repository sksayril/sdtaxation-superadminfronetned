import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutConfirmation from './LogoutConfirmation';
import {
  Home,
  Building2,
  Users,
  Package,
  UserCheck,
  DollarSign,
  FileText,
  Settings,
  Calculator,
  Receipt,
  FileBarChart,
  User,
  LogOut,
  Menu,
  X,
  Calendar,
  Mail,
  Download,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
  CreditCard,
  Lock,
  CheckSquare
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Format date for last login display
  const formatLastLogin = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes} IST`;
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/company', label: 'Company', icon: Building2 },
    { path: '/admin-management', label: 'Admin Management', icon: Shield },
    { path: '/subscription-plans', label: 'Subscription Plans', icon: Package },
    { path: '/company-subscriptions', label: 'Company Subscriptions', icon: CreditCard },
    { path: '/crm', label: 'CRM', icon: Users },
    { path: '/erp', label: 'ERP', icon: Package },
    { path: '/hrm', label: 'HRM', icon: UserCheck },
    { path: '/payroll', label: 'Payroll', icon: DollarSign },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const taxMenuItems = [
    { path: '/gst', label: 'GST', icon: Calculator },
    { path: '/tds', label: 'TDS', icon: Receipt },
    { path: '/itr', label: 'ITR', icon: FileBarChart },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'w-64' : 'w-16 lg:w-16'}
      `}>
        <div className={`flex items-center justify-between h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 ${
          !sidebarOpen ? 'px-2' : ''
        }`}>
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-white truncate">S.D.Taxation</h1>
          )}
          {!sidebarOpen && (
            <div className="text-white font-bold text-lg">SD</div>
          )}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-white hover:text-gray-200 p-1"
          >
            <X size={24} />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block text-white hover:text-gray-200 p-1"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="flex-1 px-2 py-6 overflow-y-auto h-full">
          <nav className="space-y-2">
            <div className="pb-4">
              {sidebarOpen && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Main Menu
                </h3>
              )}
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${!sidebarOpen ? 'justify-center' : ''}`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <Icon size={20} className={sidebarOpen ? 'mr-3' : ''} />
                    {sidebarOpen && <span>{item.label}</span>}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-200">
              {sidebarOpen && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Tax Modules
                </h3>
              )}
              {taxMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${!sidebarOpen ? 'justify-center' : ''}`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <Icon size={20} className={sidebarOpen ? 'mr-3' : ''} />
                    {sidebarOpen && <span>{item.label}</span>}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {sidebarOpen && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2 px-1">
                  <button className="flex flex-col items-center p-3 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Mail size={16} className="mb-1" />
                    <span>Gmail</span>
                  </button>
                  <button className="flex flex-col items-center p-3 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Download size={16} className="mb-1" />
                    <span>Download</span>
                  </button>
                  <button className="flex flex-col items-center p-3 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Globe size={16} className="mb-1" />
                    <span>Online</span>
                  </button>
                  <button className="flex flex-col items-center p-3 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Receipt size={16} className="mb-1" />
                    <span>E-way Bill</span>
                  </button>
                </div>
              </div>
            )}
            
            {!sidebarOpen && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button 
                  className="w-full flex justify-center p-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group relative"
                  title="Gmail"
                >
                  <Mail size={20} />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Gmail
                  </div>
                </button>
                <button 
                  className="w-full flex justify-center p-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group relative"
                  title="Download"
                >
                  <Download size={20} />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Download
                  </div>
                </button>
                <button 
                  className="w-full flex justify-center p-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group relative"
                  title="Online"
                >
                  <Globe size={20} />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Online
                  </div>
                </button>
                <button 
                  className="w-full flex justify-center p-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group relative"
                  title="E-way Bill"
                >
                  <Receipt size={20} />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    E-way Bill
                  </div>
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3 relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={16} />
                  <span className="lowercase">{user?.name || 'superadmin'}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Last Logged In at</div>
                      <div className="text-sm text-gray-700 font-medium">{formatLastLogin()}</div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={16} className="text-gray-500" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          // Navigate to change password page or open modal
                          setUserDropdownOpen(false);
                          // Add change password functionality here
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Lock size={16} className="text-gray-500" />
                        <span>Change Password</span>
                      </button>
                      <button
                        onClick={() => {
                          // Navigate to DSC registration/update page
                          setUserDropdownOpen(false);
                          // Add DSC functionality here
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <CheckSquare size={16} className="text-gray-500" />
                        <span>Register / Update DSC</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogoutClick();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogoutConfirm}
        userName={user?.name}
      />
    </div>
  );
}