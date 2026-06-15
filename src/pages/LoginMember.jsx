import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, FaLock, FaArrowRight, FaArrowLeft, FaCut, FaEye, FaEyeSlash 
} from 'react-icons/fa';

export default function LoginMember() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/member-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT - Image Side */}
      <div className="hidden lg:block lg:w-7/12 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
        
        <div className="absolute inset-0 p-16 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <FaCut className="text-black text-xl" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">HAIRCUT</span>
          </Link>
          
          <div className="max-w-md">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-white/90 text-3xl font-light leading-snug mb-4">
              "The best grooming experience I've ever had. Truly exceptional service."
            </p>
            <p className="text-white/60 text-sm font-medium">— Marcus Lee, Premium Member since 2024</p>
          </div>
        </div>
      </div>

      {/* RIGHT - Form Side */}
      <div className="w-full lg:w-5/12 flex items-center bg-white">
        <div className="w-full max-w-md mx-auto px-8 py-12">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-16 transition-colors text-sm group">
            <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs tracking-wider">BACK</span>
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-gray-900 text-4xl font-bold tracking-tight mb-3">
              Sign in
            </h1>
            <p className="text-gray-500 text-base">
              Welcome back. Enter your credentials to access your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-300" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-700 text-sm font-medium">
                  Password
                </label>
                <a href="#" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-11 pr-12 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-300" 
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-md border-2 border-gray-300 text-black focus:ring-0 focus:ring-offset-0 checked:bg-black checked:border-black transition-all"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  Keep me signed in
                </span>
              </label>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white rounded-2xl py-4 hover:bg-black transition-all duration-300 disabled:opacity-60 disabled:cursor-wait font-semibold text-sm shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in
                  <FaArrowRight className="text-xs" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-400 text-sm font-medium">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 rounded-2xl py-4 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-semibold shadow-sm hover:shadow-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          {/* Footer */}
          <p className="mt-8 text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-gray-900 font-semibold hover:underline underline-offset-4">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}