import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '../utils/toast';
import { apiService, tokenManager, LoginRequest, LoginResponse } from '../services/api';
import TokenExpiredModal from '../components/TokenExpiredModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  showTokenExpiredModal: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTokenExpiredModal, setShowTokenExpiredModal] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = tokenManager.getToken();
        const userData = tokenManager.getUserData();

        if (token && userData) {
          // Check if token is expired first
          if (tokenManager.isTokenExpired()) {
            // Token is expired, clear auth and show modal
            tokenManager.clearAuth();
            setIsAuthenticated(false);
            setUser(null);
            setShowTokenExpiredModal(true);
            setLoading(false);
            return;
          }

          // Token is not expired, verify with server
          try {
            await apiService.getSuperAdminProfile();
            // Token is valid, restore authentication
            setIsAuthenticated(true);
            setUser({
              ...userData,
              role: 'superadmin'
            });
          } catch (error: any) {
            // API call failed - check if it's due to token expiration
            if (error.isTokenExpired || error.message?.includes('Token expired') || error.message?.includes('Unauthorized')) {
              // Token expired on server side
              tokenManager.clearAuth();
              setIsAuthenticated(false);
              setUser(null);
              setShowTokenExpiredModal(true);
            } else {
              // Other error (network, server error, etc.) - keep user logged in if token is not expired
              // Only clear auth if token is actually expired
              if (tokenManager.isTokenExpired()) {
                tokenManager.clearAuth();
                setIsAuthenticated(false);
                setUser(null);
                setShowTokenExpiredModal(true);
              } else {
                // Token is still valid, restore authentication even if API call failed
                setIsAuthenticated(true);
                setUser({
                  ...userData,
                  role: 'superadmin'
                });
                console.warn('API verification failed but token is valid, keeping user logged in:', error);
              }
            }
          }
        } else {
          // No token or user data, user is not authenticated
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Only clear auth if we can't verify token, but don't redirect if token exists
        const token = tokenManager.getToken();
        if (!token || tokenManager.isTokenExpired()) {
          tokenManager.clearAuth();
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle token expiration redirect
  const handleTokenExpiredRedirect = () => {
    setShowTokenExpiredModal(false);
    tokenManager.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
    // Redirect is handled in TokenExpiredModal component
  };


  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const credentials: LoginRequest = { email, password };
      const response: LoginResponse = await apiService.login(credentials);

      if (response.success) {
        // Store token and user data
        tokenManager.setToken(response.token);
        tokenManager.setUserData(response.data);

        // Update state
        setIsAuthenticated(true);
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: 'superadmin'
        });

        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API to invalidate token on server
      await apiService.logout();
      
      // Clear local storage
      tokenManager.clearAuth();
      
      // Update state
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
      
      // Show success message
      toast.success('Logged out successfully', '👋 Logout Successful');
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Even if API call fails, clear local storage
      tokenManager.clearAuth();
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
      
      // Show warning message
      toast.warning('Logged out locally (server logout failed)', '⚠️ Partial Logout');
    }
  };

  // Monitor token expiration periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      if (tokenManager.isTokenExpired()) {
        setShowTokenExpiredModal(true);
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every 30 seconds
    const interval = setInterval(checkTokenExpiration, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      loading, 
      error,
      showTokenExpiredModal
    }}>
      {children}
      <TokenExpiredModal 
        isOpen={showTokenExpiredModal} 
        onRedirect={handleTokenExpiredRedirect}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}