import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Loader2, ExternalLink, Shield, User, Users } from 'lucide-react';

type LoginType = 'superadmin' | 'employee' | 'hr';

export default function Login() {
  const [loginType, setLoginType] = useState<LoginType>('superadmin');
  const [email, setEmail] = useState('superadmin@gmail.com');
  const [password, setPassword] = useState('superadmin@123');
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Update default credentials based on login type
  useEffect(() => {
    switch (loginType) {
      case 'superadmin':
        setEmail('superadmin@gmail.com');
        setPassword('superadmin@123');
        break;
      case 'employee':
        setEmail('employee@gmail.com');
        setPassword('employee@123');
        break;
      case 'hr':
        setEmail('hr@gmail.com');
        setPassword('hr@123');
        break;
    }
  }, [loginType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      const success = await login(email, password);
      if (success) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate('/dashboard');
      } else {
        setLocalError(error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setLocalError('Login failed. Please try again.');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex bg-blue-900">
      {/* Left Panel - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700 flex-col justify-between p-12 text-white">
        <div>
          <h2 className="text-2xl font-bold mb-12">COMPANY LOGO</h2>
        </div>
        <div className="space-y-6">
          <h1 className="text-5xl font-bold">Welcome to...</h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div>
          <p className="text-sm text-white/80">
            Lorem ipsum dolor sit amet
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-stone-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Login</h1>
            <p className="text-gray-600">
              Welcome! Login to get amazing discounts and offers only for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {displayError && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-500" size={16} />
                <span className="text-red-700 text-sm">{displayError}</span>
              </div>
            )}

            {/* Login Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Login Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Superadmin Login */}
                <label
                  className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    loginType === 'superadmin'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="loginType"
                    value="superadmin"
                    checked={loginType === 'superadmin'}
                    onChange={(e) => setLoginType(e.target.value as LoginType)}
                    className="sr-only"
                  />
                  <Shield className={`mb-2 ${loginType === 'superadmin' ? 'text-blue-600' : 'text-gray-400'}`} size={24} />
                  <span className={`text-xs font-medium ${loginType === 'superadmin' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Superadmin
                  </span>
                  {loginType === 'superadmin' && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </label>

                {/* Employee Login */}
                <label
                  className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    loginType === 'employee'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="loginType"
                    value="employee"
                    checked={loginType === 'employee'}
                    onChange={(e) => setLoginType(e.target.value as LoginType)}
                    className="sr-only"
                  />
                  <User className={`mb-2 ${loginType === 'employee' ? 'text-blue-600' : 'text-gray-400'}`} size={24} />
                  <span className={`text-xs font-medium ${loginType === 'employee' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Employee
                  </span>
                  {loginType === 'employee' && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </label>

                {/* HR Login */}
                <label
                  className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    loginType === 'hr'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="loginType"
                    value="hr"
                    checked={loginType === 'hr'}
                    onChange={(e) => setLoginType(e.target.value as LoginType)}
                    className="sr-only"
                  />
                  <Users className={`mb-2 ${loginType === 'hr' ? 'text-blue-600' : 'text-gray-400'}`} size={24} />
                  <span className={`text-xs font-medium ${loginType === 'hr' ? 'text-blue-600' : 'text-gray-600'}`}>
                    HR Login
                  </span>
                  {loginType === 'hr' && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                User Name
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 uppercase tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>LOGIN</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.open('https://admin.sdtaxation.com/', '_blank')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 uppercase tracking-wide"
            >
              <ExternalLink size={16} />
              <span>Admin Portal</span>
            </button>

            <div className="flex items-center justify-between text-sm">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // Add forgot password functionality here if needed
                }}
              >
                Forgot Password?
              </a>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // Add sign up functionality here if needed
                }}
              >
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}