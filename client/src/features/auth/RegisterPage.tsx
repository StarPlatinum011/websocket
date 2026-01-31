import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface FormData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  userName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('localhost', {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: formData.email,
          userName: formData.userName,
          password: formData.password
        })
      });

      if(!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      // response data from backend 
      const data = await response.json();

      // Attach token and other state to store
      login(data.sessionToken, data.userId, data.userName);
      navigate('/');
      
    } catch (err) {
      console.log("Error: ", err);
      
      setErrors({ general: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[#00A7E1] p-3 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#2D3436]">Create Account</h1>
          <p className="text-[#2D3436] opacity-70 mt-1">Start your journey with Enigma</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-5">
            {errors.general && (
              <div className="bg-[#FEF3F2] border border-[#F7A072] text-[#F7A072] px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.userName}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.userName ? 'border-[#F7A072] focus:ring-[#F7A072]' : 'border-gray-300 focus:ring-[#00A7E1]'
                  } text-[#2D3436] rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="John Doe"
                />
              </div>
              {errors.userName && (
                <p className="text-[#F7A072] text-xs mt-1">{errors.userName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.email ? 'border-[#F7A072] focus:ring-[#F7A072]' : 'border-gray-300 focus:ring-[#00A7E1]'
                  } text-[#2D3436] rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-[#F7A072] text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.password ? 'border-[#F7A072] focus:ring-[#F7A072]' : 'border-gray-300 focus:ring-[#00A7E1]'
                  } text-[#2D3436] rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#F7A072] text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#2D3436] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.confirmPassword ? 'border-[#F7A072] focus:ring-[#F7A072]' : 'border-gray-300 focus:ring-[#00A7E1]'
                  } text-[#2D3436] rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[#F7A072] text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#00A7E1] hover:bg-[#0090C4] text-white font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A7E1] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#2D3436] opacity-70 text-sm mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-[#00A7E1] hover:text-[#0090C4] font-medium transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;