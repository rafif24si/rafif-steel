import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaEnvelope, FaLock, FaArrowRight, FaArrowLeft, FaCut, FaEye, FaEyeSlash 
} from 'react-icons/fa';

export default function LoginMember() {
  const navigate = useNavigate();
  const location = useLocation(); // Mendeteksi asal pengguna
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginError, setLoginError] = useState('');

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      navigate('/member-dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    
    try {
      // Import secara dinamis agar tidak mengubah struktur import yang ada jika tidak perlu
      const { usersAPI } = await import('../services/usersAPI');
      const users = await usersAPI.loginUser(formData.email, formData.password);
      
      if (users && users.length > 0) {
        const loggedInUser = users[0];
        // Simpan data login
        localStorage.setItem('userEmail', loggedInUser.email);
        localStorage.setItem('userName', loggedInUser.nama || loggedInUser.username || loggedInUser.email);
        
        // LOGIKA REDIRECT PINTAR
        const redirectTo = location.state?.from || '/member-dashboard';
        navigate(redirectTo);
      } else {
        setLoginError('Email atau password salah.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login failed", error);
      setLoginError('Terjadi kesalahan saat mencoba login.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT - Image Side */}
      <div className="hidden lg:block lg:w-7/12 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop"
          alt="Barbershop"
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
              {location.state?.from === '/booking' 
                ? "Silakan login terlebih dahulu untuk melanjutkan reservasi jadwal Anda." 
                : "Welcome back. Enter your credentials to access your account."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input 
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-300" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-700 text-sm font-medium">Password</label>
                <a href="#" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-11 pr-12 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-300" 
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 h-full px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            {loginError && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium mb-4">
                {loginError}
              </div>
            )}
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-gray-900 text-white rounded-2xl py-4 hover:bg-black transition-all duration-300 disabled:opacity-60 disabled:cursor-wait font-semibold text-sm shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5 mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">Processing...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">Sign in <FaArrowRight className="text-xs" /></span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register-member" className="text-gray-900 font-semibold hover:underline underline-offset-4">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}