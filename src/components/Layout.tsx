import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LogoutConfirmation from './LogoutConfirmation';
import {
  Home,
  Building2,
  Package,
  Settings,
  Shield,
  CreditCard,
  Wrench,
  User,
  LogOut,
  Menu,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  CheckSquare,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme, availableThemes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  
  // Get active menu item classes based on theme
  const getActiveMenuClasses = (isActive: boolean) => {
    if (!isActive) {
      // White theme needs black text, others need white text
      if (theme.name === 'white') {
        return 'text-gray-900 hover:bg-gray-100';
      }
      return 'text-white hover:bg-white hover:bg-opacity-10';
    }
    
    // Commented out dark mode support
    // if (isDarkMode) {
    //   const activeClassMap: Record<string, string> = {
    //     blue: 'bg-gray-700 dark:bg-gray-700 text-blue-300 dark:text-blue-400 rounded-lg',
    //     purple: 'bg-gray-700 dark:bg-gray-700 text-purple-300 dark:text-purple-400 rounded-lg',
    //     green: 'bg-gray-700 dark:bg-gray-700 text-green-300 dark:text-green-400 rounded-lg',
    //     orange: 'bg-gray-700 dark:bg-gray-700 text-orange-300 dark:text-orange-400 rounded-lg',
    //     red: 'bg-gray-700 dark:bg-gray-700 text-red-300 dark:text-red-400 rounded-lg',
    //     indigo: 'bg-gray-700 dark:bg-gray-700 text-indigo-300 dark:text-indigo-400 rounded-lg',
    //   };
    //   return activeClassMap[theme.name] || activeClassMap.blue;
    // }
    
    const activeClassMap: Record<string, string> = {
      blue: 'bg-white text-blue-600 rounded-lg border-2 border-black',
      purple: 'bg-white text-purple-600 rounded-lg border-2 border-black',
      green: 'bg-white text-green-600 rounded-lg border-2 border-black',
      orange: 'bg-white text-orange-600 rounded-lg border-2 border-black',
      red: 'bg-white text-red-600 rounded-lg border-2 border-black',
      indigo: 'bg-white text-indigo-600 rounded-lg border-2 border-black',
      black: 'bg-white text-gray-900 rounded-lg border-2 border-black',
      pink: 'bg-white text-pink-600 rounded-lg border-2 border-black',
      teal: 'bg-white text-teal-600 rounded-lg border-2 border-black',
      cyan: 'bg-white text-cyan-600 rounded-lg border-2 border-black',
      white: 'bg-gray-100 text-gray-900 rounded-lg border-2 border-black',
    };
    
    return activeClassMap[theme.name] || activeClassMap.blue;
  };
  
  // Get inactive icon color classes
  const getInactiveIconClasses = (isActive: boolean) => {
    if (isActive) {
      // Commented out dark mode support
      // if (isDarkMode) {
      //   const iconColorMap: Record<string, string> = {
      //     blue: 'text-blue-300 dark:text-blue-400',
      //     purple: 'text-purple-300 dark:text-purple-400',
      //     green: 'text-green-300 dark:text-green-400',
      //     orange: 'text-orange-300 dark:text-orange-400',
      //     red: 'text-red-300 dark:text-red-400',
      //     indigo: 'text-indigo-300 dark:text-indigo-400',
      //   };
      //   return iconColorMap[theme.name] || iconColorMap.blue;
      // }
      const iconColorMap: Record<string, string> = {
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        green: 'text-green-600',
        orange: 'text-orange-600',
        red: 'text-red-600',
        indigo: 'text-indigo-600',
        black: 'text-gray-900',
        pink: 'text-pink-600',
        teal: 'text-teal-600',
        cyan: 'text-cyan-600',
        white: 'text-gray-900',
      };
      return iconColorMap[theme.name] || iconColorMap.blue;
    }
    // White theme needs black text, others need white text
    if (theme.name === 'white') {
      return 'text-gray-900';
    }
    return 'text-white';
  };

  // Get dropdown menu item classes based on theme
  const getDropdownItemClasses = () => {
    // Commented out dark mode support
    // if (isDarkMode) {
    //   const itemClassMap: Record<string, string> = {
    //     blue: 'text-gray-300 hover:bg-blue-900 hover:text-blue-300',
    //     purple: 'text-gray-300 hover:bg-purple-900 hover:text-purple-300',
    //     green: 'text-gray-300 hover:bg-green-900 hover:text-green-300',
    //     orange: 'text-gray-300 hover:bg-orange-900 hover:text-orange-300',
    //     red: 'text-gray-300 hover:bg-red-900 hover:text-red-300',
    //     indigo: 'text-gray-300 hover:bg-indigo-900 hover:text-indigo-300',
    //   };
    //   return itemClassMap[theme.name] || itemClassMap.blue;
    // }
      const itemClassMap: Record<string, string> = {
        blue: 'text-gray-700 hover:bg-blue-50 hover:text-blue-600',
        purple: 'text-gray-700 hover:bg-purple-50 hover:text-purple-600',
        green: 'text-gray-700 hover:bg-green-50 hover:text-green-600',
        orange: 'text-gray-700 hover:bg-orange-50 hover:text-orange-600',
        red: 'text-gray-700 hover:bg-red-50 hover:text-red-600',
        indigo: 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600',
        black: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
        pink: 'text-gray-700 hover:bg-pink-50 hover:text-pink-600',
        teal: 'text-gray-700 hover:bg-teal-50 hover:text-teal-600',
        cyan: 'text-gray-700 hover:bg-cyan-50 hover:text-cyan-600',
        white: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
      };
      return itemClassMap[theme.name] || itemClassMap.blue;
  };

  // Get dropdown icon color classes based on theme
  const getDropdownIconClasses = () => {
    const iconClassMap: Record<string, string> = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      indigo: 'text-indigo-600',
      black: 'text-gray-900',
      pink: 'text-pink-600',
      teal: 'text-teal-600',
      cyan: 'text-cyan-600',
      white: 'text-gray-900',
    };
    return iconClassMap[theme.name] || iconClassMap.blue;
  };
  
  // Get sidebar header gradient classes
  const getSidebarHeaderClasses = () => {
    // Commented out dark mode support
    // if (isDarkMode) {
    //   return 'bg-gray-800 dark:bg-gray-900';
    // }
    const headerClassMap: Record<string, string> = {
      blue: 'bg-gradient-to-r from-blue-600 to-blue-700',
      purple: 'bg-gradient-to-r from-purple-600 to-purple-700',
      green: 'bg-gradient-to-r from-green-600 to-green-700',
      orange: 'bg-gradient-to-r from-orange-600 to-orange-700',
      red: 'bg-gradient-to-r from-red-600 to-red-700',
      indigo: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
      black: 'bg-gradient-to-r from-gray-900 to-black',
      pink: 'bg-gradient-to-r from-pink-600 to-pink-700',
      teal: 'bg-gradient-to-r from-teal-600 to-teal-700',
      cyan: 'bg-gradient-to-r from-cyan-600 to-cyan-700',
      white: 'bg-white border-b border-gray-300',
    };
    
    return headerClassMap[theme.name] || headerClassMap.blue;
  };

  // Get sidebar background gradient classes
  const getSidebarBgClasses = () => {
    // Commented out dark mode support
    // if (isDarkMode) {
    //   return 'bg-gray-800 dark:bg-gray-900';
    // }
    const sidebarBgMap: Record<string, string> = {
      blue: 'bg-gradient-to-b from-blue-600 to-blue-700',
      purple: 'bg-gradient-to-b from-purple-600 to-purple-700',
      green: 'bg-gradient-to-b from-green-600 to-green-700',
      orange: 'bg-gradient-to-b from-orange-600 to-orange-700',
      red: 'bg-gradient-to-b from-red-600 to-red-700',
      indigo: 'bg-gradient-to-b from-indigo-600 to-indigo-700',
      black: 'bg-gradient-to-b from-gray-900 to-black',
      pink: 'bg-gradient-to-b from-pink-600 to-pink-700',
      teal: 'bg-gradient-to-b from-teal-600 to-teal-700',
      cyan: 'bg-gradient-to-b from-cyan-600 to-cyan-700',
      white: 'bg-white border-r border-gray-300',
    };
    
    return sidebarBgMap[theme.name] || sidebarBgMap.blue;
  };

  // Get page background color classes
  const getPageBgClasses = () => {
    // Commented out dark mode support
    // if (isDarkMode) {
    //   return 'bg-gray-900';
    // }
    const pageBgMap: Record<string, string> = {
      blue: 'bg-blue-50',
      purple: 'bg-purple-50',
      green: 'bg-green-50',
      orange: 'bg-orange-50',
      red: 'bg-red-50',
      indigo: 'bg-indigo-50',
      black: 'bg-gray-50',
      pink: 'bg-pink-50',
      teal: 'bg-teal-50',
      cyan: 'bg-cyan-50',
      white: 'bg-gray-50',
    };
    
    return pageBgMap[theme.name] || pageBgMap.blue;
  };

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
    { path: '/setup', label: 'Setup', icon: Wrench },
    { path: '/company', label: 'Company', icon: Building2 },
    { path: '/admin-management', label: 'Admin Management', icon: Shield },
    { path: '/subscription-plans', label: 'Subscription Plans', icon: Package },
    { path: '/company-subscriptions', label: 'Company Subscriptions', icon: CreditCard },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];



  return (
    <div className={`flex h-screen ${getPageBgClasses()} overflow-hidden`}>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 ${getSidebarBgClasses()} shadow-lg transform transition-all duration-300 ease-in-out
        lg:relative lg:translate-x-0 flex flex-col h-screen
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'w-64' : 'w-16 lg:w-16'}
      `}>
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} h-16 px-4 flex-shrink-0 ${getSidebarHeaderClasses()} ${
          !sidebarOpen ? 'px-2' : ''
        }`}>
          {sidebarOpen && (
            <h1 className={`text-xl font-bold whitespace-nowrap ${theme.name === 'white' ? 'text-gray-900' : 'text-white'}`}>S.D.Taxation Associate</h1>
          )}
          {!sidebarOpen && (
            <div className={`font-bold text-lg ${theme.name === 'white' ? 'text-gray-900' : 'text-white'}`}>SD</div>
          )}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className={`lg:hidden p-1 ${theme.name === 'white' ? 'text-gray-900 hover:text-gray-700' : 'text-white hover:text-gray-200'}`}
          >
            <X size={24} />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden lg:block p-1 ${theme.name === 'white' ? 'text-gray-900 hover:text-gray-700' : 'text-white hover:text-gray-200'}`}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="flex-1 px-2 py-6 overflow-y-auto overflow-x-hidden min-h-0">
          <nav className="space-y-2">
            <div className="pb-2">
              {sidebarOpen && (
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${theme.name === 'white' ? 'text-gray-700' : 'text-white text-opacity-70'}`}>
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
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative ${getActiveMenuClasses(isActive)} ${!sidebarOpen ? 'justify-center' : ''}`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <Icon size={20} className={`${sidebarOpen ? 'mr-3' : ''} ${getInactiveIconClasses(isActive)}`} />
                    {sidebarOpen && <span className={isActive ? '' : (theme.name === 'white' ? 'text-gray-900' : 'text-white')}>{item.label}</span>}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-3 px-6 py-4">
            {/* Top Row: Title and User Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <Menu size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar size={16} />
                  <span>{(() => {
                    const now = new Date();
                    const day = String(now.getDate()).padStart(2, '0');
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const month = monthNames[now.getMonth()];
                    const year = String(now.getFullYear()).slice(-2);
                    return `${day}/${month}/${year}`;
                  })()}</span>
                </div>
                <div className="flex items-center space-x-3 relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <User size={18} />
                  <span className="font-medium">{user?.name || 'superadmin'}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-bold">Last Logged In at</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{formatLastLogin()}</div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${getDropdownItemClasses()}`}
                      >
                        <User size={16} className={getDropdownIconClasses()} />
                        <span className="font-bold">My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          // Navigate to change password page or open modal
                          setUserDropdownOpen(false);
                          // Add change password functionality here
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${getDropdownItemClasses()}`}
                      >
                        <Lock size={16} className={getDropdownIconClasses()} />
                        <span className="font-bold">Change Password</span>
                      </button>
                      <div className="relative">
                        {/* <button
                          onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${getDropdownItemClasses()}`}
                        > */}
                          {/* <div className="flex items-center space-x-3">
                            <Palette size={16} className={getDropdownIconClasses()} />
                            <span className="font-bold dark:text-gray-300">Theme Settings</span>
                          </div> */}
                          {/* <ChevronDown 
                            size={16} 
                            className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                              themeMenuOpen ? 'rotate-180' : ''
                            }`}
                          /> */}
                        {/* </button> */}
                        {themeMenuOpen && (
                          <div className="pl-4 pr-2 py-2 max-h-80 overflow-y-auto space-y-1">
                            {/* Dark Mode Toggle - Commented Out */}
                            {/* <button
                              onClick={() => {
                                toggleDarkMode();
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                                isDarkMode
                                  ? getDropdownItemClasses()
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {isDarkMode ? (
                                  <Moon size={16} className={getDropdownIconClasses()} />
                                ) : (
                                  <Sun size={16} className="text-gray-600" />
                                )}
                                <span className="font-medium">Dark Mode</span>
                              </div>
                              {isDarkMode && (
                                <div className={getDropdownIconClasses()}>
                                  <CheckSquare size={14} />
                                </div>
                              )}
                            </button> */}
                            {availableThemes.map((themeOption) => (
                              <button
                                key={themeOption.name}
                                onClick={() => {
                                  setTheme(themeOption.name);
                                  setThemeMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                                  theme.name === themeOption.name
                                    ? getDropdownItemClasses()
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <div 
                                    className={`w-4 h-4 rounded-full ${
                                      (() => {
                                        const colorMap: Record<string, string> = {
                                          blue: 'bg-blue-600',
                                          purple: 'bg-purple-600',
                                          green: 'bg-green-600',
                                          orange: 'bg-orange-600',
                                          red: 'bg-red-600',
                                          indigo: 'bg-indigo-600',
                                          black: 'bg-gray-900',
                                          pink: 'bg-pink-600',
                                          teal: 'bg-teal-600',
                                          cyan: 'bg-cyan-600',
                                          white: 'bg-white border-2 border-gray-300',
                                        };
                                        return colorMap[themeOption.name] || 'bg-blue-600';
                                      })()
                                    }`}
                                  />
                                  <span className="font-medium">{themeOption.displayName}</span>
                                </div>
                                {theme.name === themeOption.name && (
                                  <div className={getDropdownIconClasses()}>
                                    <CheckSquare size={14} />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogoutClick();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span className="font-bold">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto p-6 ${getPageBgClasses()}`}>
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