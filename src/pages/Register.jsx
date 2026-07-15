import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, FaLock, FaArrowRight, FaArrowLeft, FaCut, FaUser, FaPhone 
} from 'react-icons/fa';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // KOMENTAR DEMO: Simulasi fungsi registrasi sederhana (tanpa integrasi database) yang akan mengarahkan user ke halaman login setelah 1.5 detik
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi koneksi ke database
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Akun berhasil dibuat! Silakan login.");
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT - Image Side */}
      <div className="hidden lg:block lg:w-5/12 relative overflow-hidden bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"
          alt="Barbershop"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 p-16 flex flex-col justify-end">
          <h2 className="text-white text-4xl font-black mb-4">Bergabung bersama <br/> HairCut Family.</h2>
          <p className="text-gray-300">Dapatkan akses eksklusif ke layanan premium, promo member, dan kemudahan booking jadwal kapan saja.</p>
        </div>
      </div>

      {/* RIGHT - Form Side */}
      <div className="w-full lg:w-7/12 flex items-center bg-white">
        <div className="w-full max-w-md mx-auto px-8 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-10 transition-colors text-sm group">
            <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" /> BACK
          </Link>

          <div className="mb-8">
            <h1 className="text-gray-900 text-4xl font-bold tracking-tight mb-3">Create account</h1>
            <p className="text-gray-500">Sudah punya akun? <Link to="/login" className="text-black font-bold hover:underline">Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><FaUser /></div>
                <input name="name" required onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm focus:border-black transition-all" placeholder="Rafif Zidane" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><FaEnvelope /></div>
                <input type="email" name="email" required onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm focus:border-black transition-all" placeholder="rafif@example.com" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><FaPhone /></div>
                <input type="tel" name="phone" required onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm focus:border-black transition-all" placeholder="0812xxxx" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><FaLock /></div>
                <input type="password" name="password" required onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-11 pr-4 text-sm focus:border-black transition-all" placeholder="Create a password" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white rounded-2xl py-4 hover:bg-black font-semibold text-sm shadow-lg mt-4 disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}