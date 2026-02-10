import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Loader2, Mail, Lock, Check, RotateCcw } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('superadmin@gmail.com');
  const [password, setPassword] = useState('superadmin@123');
  const [localError, setLocalError] = useState('');
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setLocalError(error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setLocalError('Login failed. Please try again.');
    }
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setLocalError('');
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h1 className="text-xl font-bold text-white text-center">S.D. Taxation Superadmin</h1>
        </div>

        {/* Login Form */}
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {displayError && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-500" size={16} />
                <span className="text-red-700 text-sm">{displayError}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="mr-2 text-gray-500" size={16} />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Lock className="mr-2 text-gray-500" size={16} />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}