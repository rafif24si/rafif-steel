import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { usersAPI } from '../../services/usersAPI'; 

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Mengikat inputan dengan state React
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fungsi yang BENAR untuk mengirim ke Supabase
    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Password dan Confirm Password tidak cocok!");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name: formData.name,
                email: formData.email, 
                password: formData.password,
                role: "customer"
            };
            
            // Perintah ini yang akan memasukkan data ke database Anda
            await usersAPI.registerUser(payload);
            
            alert("Pendaftaran berhasil! Silakan sign in.");
            navigate('/login');
        } catch (error) {
            alert("Gagal mendaftar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800">Create an Account</h2>
                <p className="text-sm text-slate-500 mt-1">Join SteelCut to manage your barbershop.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
                <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 group-focus-within:text-slate-800 transition-colors">
                        Full Name
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><FaUser /></span>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="M Rafif Zidane" 
                            className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 group-focus-within:text-slate-800 transition-colors">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><FaEnvelope /></span>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="admin@haircut.com" 
                            className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 group-focus-within:text-slate-800 transition-colors">
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><FaLock /></span>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="••••••••" 
                            className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all"
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 group-focus-within:text-slate-800 transition-colors">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><FaLock /></span>
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            placeholder="••••••••" 
                            className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all"
                            required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors">
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full mt-6 py-4 bg-slate-800 text-white font-black rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-700 hover:shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? "Menyimpan..." : "Sign Up"}
                </button>
            </form>

            <div className="mt-8 text-center text-xs font-medium text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-slate-800 font-bold hover:underline transition-all">
                    Sign in here
                </Link>
            </div>
        </div>
    );
}