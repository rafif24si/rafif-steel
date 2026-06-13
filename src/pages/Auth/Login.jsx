// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { usersAPI } from '../../services/usersAPI'; 

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const users = await usersAPI.loginUser(credentials.email, credentials.password);
            
            if (users && users.length > 0) {
                const loggedInUser = users[0]; 
                localStorage.setItem("user", JSON.stringify(loggedInUser));
                alert("Welcome back, " + loggedInUser.name + "!");
                
                // PENYESUAIAN: Arahkan ke /dashboard, bukan /
                navigate('/dashboard'); 
            } else {
                alert("Email atau Password salah!");
            }
        } catch (error) {
            alert("Terjadi kesalahan sistem: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-800">Welcome back!</h2>
                <p className="text-sm text-slate-500 mt-1">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 group-focus-within:text-slate-800 transition-colors">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                            <FaEnvelope />
                        </span>
                        <input 
                            type="email" 
                            name="email"
                            value={credentials.email}
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
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                            <FaLock />
                        </span>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all"
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-800 cursor-pointer" />
                        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Remember me</span>
                    </label>
                    <Link to="/forgot" className="text-xs font-bold text-slate-800 hover:text-slate-500 transition-colors">
                        Forgot password?
                    </Link>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-4 py-4 bg-slate-800 text-white font-black rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-700 hover:shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Checking details..." : "Sign In to Dashboard"}
                </button>
            </form>

            <div className="mt-8 text-center text-xs font-medium text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-slate-800 font-bold hover:underline transition-all">
                    Sign up here
                </Link>
            </div>
        </div>
    );
}