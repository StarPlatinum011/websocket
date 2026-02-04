import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage = () => {

    const [formData, setFormData] = useState<FormData>({
      email: '',
      password: ''
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value } = e.target;
      
      setFormData(prev=> ({...prev, [name]: value}));

      if(errors[name as keyof FormErrors]) {
        setErrors(prev => ({...prev, [name]: ''}))
      }

    }

    const validateForm = (): boolean => {
      const newErrors: FormErrors = {};

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        if(!validateForm()) return;
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ 
                  email: formData.email,
                  password: formData.password
                 })
            });

            if(!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Login failed");
            }

            const data = await response.json();

            // Store in auth store
            login(data.token, data.userId, data.userName);

            //Redirect to main page
            navigate('/');
        } catch (err: Error | unknown) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred';
            console.log("Invalid credentials: ", message);
            setErrors({ general: 'Invalid email or password' });
        }
    }

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
          <h1 className="text-2xl font-bold text-[#2D3436]">Welcome Back</h1>
          <p className="text-[#2D3436] opacity-70 mt-1">Sign in to continue to Enigma</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-5">
            {errors.general && (
              <div className="bg-[#FEF3F2] border border-[#F7A072] text-[#F7A072] px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#00A7E1] border-gray-300 rounded focus:ring-[#00A7E1] focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-sm text-[#2D3436] opacity-70">Remember me</span>
              </label>
              <a href="/login" className="text-sm text-[#00A7E1] hover:text-[#0090C4] font-medium transition-colors">
                Forgot password?
              </a>
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#2D3436] opacity-70">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A7E1]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-[#2D3436]">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A7E1]"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium text-[#2D3436]">Facebook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#2D3436] opacity-70 text-sm mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-[#00A7E1] hover:text-[#0090C4] font-medium transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
    );
};

export default LoginPage;