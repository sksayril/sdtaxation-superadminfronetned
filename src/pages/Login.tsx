import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calculator, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('demo@sdtaxation.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (login(email, password)) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use demo@sdtaxation.com / demo123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 px-8 py-6">
            <div className="flex items-center justify-center space-x-3">
              <Calculator className="text-white" size={32} />
              <h1 className="text-2xl font-bold text-white">S.D.Taxation Associate</h1>
            </div>
            <p className="text-blue-100 text-center mt-2">Your trusted taxation partner</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="text-red-500" size={16} />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Demo Credentials</h3>
                <p className="text-sm text-blue-700">Email: demo@sdtaxation.com</p>
                <p className="text-sm text-blue-700">Password: demo123</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Clients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">50+</div>
                  <div className="text-sm text-gray-600">Tax Types</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}