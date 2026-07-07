import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaRedoAlt, FaExclamationTriangle, FaGhost } from "react-icons/fa";

import PageHeader from "../components/PageHeader";

export default function NotFound() {
    const navigate = useNavigate();
    const [ghostPosition, setGhostPosition] = useState(0);
    const [countdown, setCountdown] = useState(10);
    const [isGlitching, setIsGlitching] = useState(false);

    // KOMENTAR DEMO: Mengatur efek animasi maskot hantu (Ghost) agar terlihat bergerak secara interaktif (mengubah posisi) setiap 500ms
    // Efek hantu bergerak-gerak (interaktif)
    useEffect(() => {
        const interval = setInterval(() => {
            setGhostPosition(prev => (prev + 1) % 3);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // KOMENTAR DEMO: Mengatur timer hitung mundur (countdown). Jika mencapai 0, pengguna akan diarahkan kembali secara otomatis ke Beranda (Landing Page).
    // Countdown auto-redirect (interaktif & memberi rasa urgency)
    useEffect(() => {
        if (countdown <= 0) {
            navigate('/');
            return;
        }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    // Efek glitch saat hover tombol
    const handleGlitch = () => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
    };

    return (
        <div id="dashboard-container" className="flex-1 w-full pb-10 relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            
            <PageHeader title="404 - Lost in Space" />

            {/* Partikel Background (Simulasi Bintang) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div key={i} 
                         className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                         style={{
                             top: `${Math.random() * 100}%`,
                             left: `${Math.random() * 100}%`,
                             animationDelay: `${Math.random() * 2}s`,
                             opacity: Math.random() * 0.5 + 0.3
                         }} />
                ))}
            </div>

            {/* Konten Utama */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 text-center">
                
                {/* Angka 404 Glitch */}
                <div className={`relative mb-8 ${isGlitching ? 'animate-pulse' : ''}`}>
                    <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 leading-none filter drop-shadow-2xl">
                        404
                    </h1>
                    <div className="absolute top-0 left-0 right-0 flex justify-center">
                        <FaGhost 
                            className={`text-6xl text-white/80 transition-all duration-300 ${
                                ghostPosition === 0 ? 'translate-x-[-20px] translate-y-[-10px]' : 
                                ghostPosition === 1 ? 'translate-x-[20px] translate-y-[10px]' : 
                                'translate-x-0 translate-y-0'
                            }`}
                        />
                    </div>
                </div>

                {/* Pesan Utama */}
                <div className="bg-black/30 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl max-w-2xl w-full">
                    <div className="flex items-center justify-center gap-3 mb-4 text-yellow-400">
                        <FaExclamationTriangle className="text-4xl animate-bounce" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Ups! Halaman Tidak Ditemukan
                        </h2>
                        <FaExclamationTriangle className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    
                    <p className="text-lg text-gray-300 mb-6">
                        Sepertinya kamu tersesat di dimensi yang salah. 
                        Halaman yang kamu cari mungkin sudah dihapus, dipindahkan, 
                        atau memang tidak pernah ada.
                    </p>

                    {/* Progress Bar Countdown */}
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-red-500 to-purple-500 h-full transition-all duration-1000 ease-linear"
                            style={{ width: `${(countdown / 10) * 100}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-400 mb-8">
                        Otomatis kembali ke beranda dalam <span className="text-white font-bold">{countdown}</span> detik...
                    </p>

                    {/* Tombol Aksi Interaktif */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            onMouseEnter={handleGlitch}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <FaHome /> Kembali ke Beranda
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        <button
                            onClick={() => window.history.back()}
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <FaRedoAlt /> Kembali Sebelumnya
                        </button>
                    </div>

                    {/* Saran Pencarian (Opsional - Interaktif) */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-gray-400 mb-3 text-sm">Mungkin kamu mencari:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['Dashboard', 'Produk', 'Profil', 'Laporan'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => navigate(`/${item.toLowerCase()}`)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/20 rounded-full text-sm text-gray-300 transition-all duration-200 flex items-center gap-1"
                                >
                                    <FaSearch className="text-xs" /> {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Kode Error Kreatif */}
                <div className="mt-8 text-gray-500 text-sm font-mono">
                    <span className="bg-black/30 px-3 py-1 rounded">ERR_INTERNET_DISCONNECTED_FROM_REALITY</span>
                </div>
            </div>

            {/* Dekorasi Sudut */}
            <div className="absolute bottom-4 left-4 text-white/10 text-8xl font-black select-none">404</div>
            <div className="absolute top-4 right-4 text-white/10 text-8xl font-black select-none rotate-12">404</div>
        </div>
    );
}