import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface LoginFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginForm({ onClose, onSuccess }: LoginFormProps) {
  const { login, signup } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!formData.name || !formData.email || !formData.password || !formData.phone) {
          setError('All fields are required');
          return;
        }
        
        const success = await signup(formData);
        if (success) {
          setSuccess('Account created successfully!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setError('Failed to create account. Email might be already in use.');
        }
      } else {
        if (!formData.email || !formData.password) {
          setError('Email and password are required');
          return;
        }

        const success = await login(formData.email, formData.password);
        if (success) {
          setSuccess('Login successful!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-md rounded-lg shadow-xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light">{isSignup ? 'Create Account' : 'Login'}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded text-sm">
                {success}
              </div>
            )}
            
            {isSignup && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 text-sm tracking-wider hover:bg-black/90 transition-colors disabled:bg-gray-400"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <span>{isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}</span>
              )}
            </button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                  setSuccess('');
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phone: ''
                  });
                }}
                className="text-gray-600 hover:text-black"
              >
                {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}