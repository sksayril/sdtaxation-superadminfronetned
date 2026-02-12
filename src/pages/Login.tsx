import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Loader2, User, Lock, RotateCcw, Check, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('superadmin@gmail.com');
  const [password, setPassword] = useState('superadmin@123');
  const [localError, setLocalError] = useState('');
  const [whatsNewExpanded, setWhatsNewExpanded] = useState(true);

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
        <div className="font-semibold">All - in - One Software : CRM, ERP, HR, PAYROLL</div>
        <div className="font-semibold hidden md:block"></div>
        <div className="text-right flex items-center space-x-2">
          <span className="font-semibold">Technical Support :</span>
          <div className="flex items-center space-x-1">
            <Phone size={14} />
            <span>9993556791</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail size={14} />
            <span>sdtaxtion@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white px-6 py-4 border-b">
        <h1 className="text-3xl font-bold text-blue-700">S.D.Taxation Associate</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow pt-4 pb-4 pr-4 md:pt-8 md:pb-8 md:pr-8">
        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* What's New */}
          <div className={`bg-white shadow-md rounded-sm overflow-hidden flex flex-col transition-all duration-300 md:w-3/4 ${
            whatsNewExpanded ? 'h-[500px]' : 'h-auto'
          }`}>
            <div 
              className="bg-[#206c82] px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#1a5a6f] transition-colors"
              onClick={() => setWhatsNewExpanded(!whatsNewExpanded)}
            >
              <h2 className="text-white font-bold text-lg">What's New</h2>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setWhatsNewExpanded(!whatsNewExpanded);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                {whatsNewExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            {whatsNewExpanded && (
              <div className="p-4 flex-grow border-l border-r border-b border-gray-200 overflow-y-auto">
                {/* Content for What's New */}
                <div className="text-gray-500 text-center py-8">
                  <p>No updates available at the moment.</p>
                </div>
              </div>
            )}
          </div>

          {/* Establishment Login */}
          <div className="bg-white shadow-md rounded-sm overflow-hidden flex flex-col h-auto min-h-[500px] md:ml-6 md:w-1/4">
            <div className="bg-blue-600 px-4 py-3">
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
                <div className="flex space-x-3 pt-2 justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md flex items-center justify-center space-x-2 transition-colors text-sm font-medium"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md flex items-center justify-center space-x-2 transition-colors text-sm font-medium"
                  >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Links */}
                <div className="flex justify-center items-center gap-2 text-sm text-gray-600 pt-3">
                  <a href="#" className="hover:underline">Forgot Password</a>
                  <span className="text-gray-400">|</span>
                  <a href="#" className="hover:underline">Unlock Account</a>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Strip (Blue) */}
      <div className="w-full h-12 bg-blue-600 overflow-hidden relative flex items-center">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="text-white text-sm font-semibold px-4">
            S.D. Taxation Associate | 9993556791 | Email: sdtaxtion@gmail.com | All-in-One Software : CRM, ERP, HR, PAYROLL | Technical Support: 9993556791 | Email: sdtaxtion@gmail.com
          </span>
          <span className="text-white text-sm font-semibold px-4">
            S.D. Taxation Associate | 9993556791 | Email: sdtaxtion@gmail.com | All-in-One Software : CRM, ERP, HR, PAYROLL | Technical Support: 9993556791 | Email: sdtaxtion@gmail.com
          </span>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}