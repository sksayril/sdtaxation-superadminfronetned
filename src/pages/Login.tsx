import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Loader2, User, Lock, RotateCcw, Check } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Black Bar */}
      <div className="bg-black text-white px-4 py-2 flex justify-between items-center text-sm">
        <div className="font-semibold">All - in - One Software</div>
        <div className="font-semibold hidden md:block">CRM, ERP, HR, PAYROLL</div>
        <div className="text-right">
          Technical Support : 9993556791 sdtaxation@gmail.com
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white px-6 py-4 border-b">
        <h1 className="text-3xl font-bold text-blue-700">S.D.Taxation Associate</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto h-full">

          {/* Column 1: What's New */}
          <div className="bg-white shadow-md rounded-sm overflow-hidden flex flex-col h-[500px] md:col-span-2">
            <div className="bg-[#206c82] px-4 py-3">
              <h2 className="text-white font-bold text-lg">What's New</h2>
            </div>
            <div className="p-4 flex-grow border-l border-r border-b border-gray-200">
              {/* Content for What's New */}
            </div>
          </div>

          {/* Column 3: Establishment Login */}
          <div className="bg-white shadow-md rounded-sm overflow-hidden flex flex-col h-auto min-h-[500px]">
            <div className="bg-[#009ac7] px-4 py-3">
              <h2 className="text-white font-bold text-lg text-center">Establishment Login</h2>
            </div>
            <div className="p-6 flex-grow border-l border-r border-b border-gray-200 flex flex-col justify-center">

              <form onSubmit={handleSubmit} className="space-y-4">
                {displayError && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded text-sm mb-2">
                    <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
                    <span className="text-red-700">{displayError}</span>
                  </div>
                )}

                {/* Username/Email */}
                <div className="flex items-center bg-blue-50 border border-blue-100 rounded overflow-hidden">
                  <div className="p-3 bg-gray-100 text-gray-500 border-r border-gray-300">
                    <User size={18} />
                  </div>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-blue-50 focus:outline-none text-gray-700"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="flex items-center bg-blue-50 border border-blue-100 rounded overflow-hidden">
                  <div className="p-3 bg-gray-100 text-gray-500 border-r border-gray-300">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-blue-50 focus:outline-none text-gray-700"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition-colors"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Links */}
                <div className="flex justify-between text-xs text-gray-500 pt-2">
                  <a href="#" className="hover:underline">Forgot Password</a>
                  <span>|</span>
                  <a href="#" className="hover:underline">Unlock Account</a>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Strip (Red) */}
      <div className="h-4 bg-[#c00]"></div>
    </div>
  );
}