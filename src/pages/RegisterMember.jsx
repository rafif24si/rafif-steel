import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaEnvelope, FaLock, FaArrowRight, FaArrowLeft, FaCut, FaEye, FaEyeSlash, FaUser 
} from 'react-icons/fa';

export default function RegisterMember() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerError, setRegisterError] = useState('');

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      navigate('/member-dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setRegisterError('');
  };

  // KOMENTAR DEMO: Menangani proses pendaftaran (Sign up). Fungsi ini mendaftarkan akun baru dengan role 'customer' ke database.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setRegisterError("Password dan Confirm Password tidak cocok!");
      return;
    }

    setIsSubmitting(true);
    setRegisterError('');
    
    try {
      const { usersAPI } = await import('../services/usersAPI');
      const payload = {
        name: formData.name,
        email: formData.email, 
        password: formData.password,
        role: "customer"
      };
      
      await usersAPI.registerUser(payload);
      
      alert("Pendaftaran berhasil! Silakan Sign in.");
      const redirectTo = location.state?.from || '/login-member';
      navigate(redirectTo);
    } catch (error) {
      console.error("Register failed", error);
      setRegisterError('Terjadi kesalahan saat mencoba register: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT - Image Side */}
      <div className="hidden lg:block lg:w-7/12 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2070&auto=format&fit=crop"
          alt="Barbershop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
        
        <div className="absolute inset-0 p-16 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <FaCut className="text-black text-xl" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">HAIRCUT</span>
          </Link>
          
          <div className="max-w-md">
            <h2 className="text-white text-4xl font-black mb-4 leading-tight">
              Join Our Exclusive Community
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Create an account today to easily book appointments, track your service history, and access special members-only promotions.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT - Form Side */}
      <div className="w-full lg:w-5/12 flex items-center bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto px-8 py-12 my-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-10 transition-colors text-sm group">
            <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs tracking-wider">BACK TO HOME</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 text-4xl font-bold tracking-tight mb-3">
              Sign up
            </h1>
            <p className="text-gray-500 text-base">
              Enter your details below to create your account and get started.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400 text-sm" />
                </div>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-300" 
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input 
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-300" 
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 pl-11 pr-12 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-300" 
                  placeholder="Create a password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 h-full px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3.5 pl-11 pr-12 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all duration-300" 
                  placeholder="Confirm your password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-0 h-full px-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                  {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            {registerError && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium mb-4">
                {registerError}
              </div>
            )}
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-gray-900 text-white rounded-2xl py-4 hover:bg-black transition-all duration-300 disabled:opacity-60 disabled:cursor-wait font-semibold text-sm shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5 mt-4"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">Processing...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">Create Account <FaArrowRight className="text-xs" /></span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login-member" className="text-gray-900 font-semibold hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
