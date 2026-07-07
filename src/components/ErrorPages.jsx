import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCut, FaRedo, FaHome } from 'react-icons/fa';

// KOMENTAR DEMO: Komponen UI re-usable khusus untuk menampilkan Halaman Error interaktif. Memiliki efek background partikel bergerak dan parallax kursor.
const ErrorPage = ({ kodeError = "404", deskripsiError }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // Inisialisasi partikel
  useEffect(() => {
    const initialParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    }));
    setParticles(initialParticles);
  }, []);

  // Update posisi mouse untuk efek parallax
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 100;
    const y = (clientY / innerHeight) * 100;
    setMousePosition({ x, y });
  };

  // Update posisi partikel
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        let newX = p.x + p.speedX;
        let newY = p.y + p.speedY;

        if (newX > 100 || newX < 0) p.speedX *= -1;
        if (newY > 100 || newY < 0) p.speedY *= -1;

        return { ...p, x: newX, y: newY };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black font-sans p-6 overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Background Orbs - Monochrome */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 -top-48 -left-48 rounded-full bg-gray-700/10 blur-3xl transition-all duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}%, ${mousePosition.y * 0.02}%)`
          }}
        ></div>
        <div
          className="absolute w-80 h-80 -bottom-40 -right-40 rounded-full bg-gray-600/10 blur-3xl transition-all duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.02}%, ${mousePosition.y * -0.02}%)`
          }}
        ></div>
      </div>

      {/* Particles - Monochrome */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gray-400/20"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            transition: 'transform 0.1s',
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
          }}
        />
      ))}

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] z-10 relative">

        {/* Judul Atas - Monochrome Gradient */}
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 mb-10 tracking-widest uppercase drop-shadow-lg animate-pulse">
          System Error
        </h1>

        {/* Area Error Interaktif */}
        <div className="flex items-center space-x-4 md:space-x-8">
          {/* Angka Pertama */}
          <span className="text-[120px] md:text-[160px] font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-500 leading-none select-none drop-shadow-xl hover:from-gray-200 hover:to-gray-400 hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer">
            {kodeError.charAt(0)}
          </span>

          {/* Elemen Tengah: Kotak Ikon Barbershop yang Lebih Interaktif - Monochrome */}
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-800 to-black flex flex-col items-center justify-center rounded-3xl shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-gray-500/30 group-hover:ring-2 group-hover:ring-gray-500/50 border border-gray-700/50">

              {/* Corner Decorations - Monochrome */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gray-500 rounded-tl-lg"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gray-500 rounded-tr-lg"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gray-500 rounded-bl-lg"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gray-500 rounded-br-lg"></div>

              {/* Glow Effect - Monochrome */}
              <div className="absolute inset-0 rounded-3xl bg-gray-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Sparkles - Monochrome */}
              <div className="absolute w-2 h-2 bg-gray-300 rounded-full animate-twinkle opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ top: '20%', left: '20%', animationDelay: '0s' }}></div>
              <div className="absolute w-2 h-2 bg-gray-400 rounded-full animate-twinkle opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ top: '60%', left: '70%', animationDelay: '0.5s' }}></div>
              <div className="absolute w-2 h-2 bg-gray-200 rounded-full animate-twinkle opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ top: '80%', left: '30%', animationDelay: '1s' }}></div>

              {/* Ikon Gunting dengan efek tambahan - Monochrome */}
              <div className="relative z-10">
                <FaCut className="text-5xl md:text-7xl text-gray-200 group-hover:text-white transition-colors duration-300 animate-cut-icon drop-shadow-lg" />
                {/* Ping Indicator - Monochrome */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-500/20 animate-ping-slow"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Angka Terakhir */}
          <span className="text-[120px] md:text-[160px] font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-500 leading-none select-none drop-shadow-xl hover:from-gray-200 hover:to-gray-400 hover:scale-110 hover:-rotate-3 transition-all duration-300 cursor-pointer">
            {kodeError.charAt(2) || kodeError.charAt(1)}
          </span>
        </div>

        {/* Deskripsi Teks dengan Glassmorphism - Monochrome */}
        <div className="mt-12 p-6 backdrop-blur-sm bg-gray-800/30 rounded-2xl border border-gray-700/50 shadow-xl max-w-md animate-fade-in-up">
          <p className="text-lg md:text-xl text-gray-300 font-medium text-center leading-relaxed">
            {deskripsiError || "Oops! Sepertinya halaman yang kamu cari sedang dipotong atau tidak tersedia di Barbershop ini."}
          </p>
        </div>

        {/* Progress Indicator - Monochrome */}
        <div className="flex mt-8 space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-gray-500 ${i === 0 ? 'animate-pulse' : ''}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* Tombol Aksi - Monochrome Theme */}
        <div className="flex flex-wrap gap-4 mt-10 justify-center">
          <Link
            to="/"
            className="group px-8 py-4 bg-gradient-to-r from-gray-800 to-black text-white font-black rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-center gap-2 border border-gray-700/50 hover:border-gray-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <FaHome className="z-10" />
            <span className="z-10">Dashboard</span>
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="group px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-black rounded-2xl shadow-lg relative overflow-hidden flex items-center justify-center gap-2 border border-gray-600/50 hover:border-gray-400/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <FaRedo className="z-10" />
            <span className="z-10">Coba Lagi</span>
          </button>
        </div>
      </div>

      {/* Tambahkan CSS Animasi Custom */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-twinkle {
          animation: twinkle 2s infinite;
        }

        @keyframes cut-icon {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        .animate-cut-icon {
          animation: cut-icon 2s ease-in-out infinite;
        }

        @keyframes ping-slow {
          0% { transform: scale(0.8); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0,0,0.2,1) infinite;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;