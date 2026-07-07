import React from 'react';
import { FaCut } from 'react-icons/fa';

// KOMENTAR DEMO: Komponen UI re-usable untuk menampilkan layar antarmuka memuat (Loading Screen) dengan animasi CSS kustom (seperti gunting bergerak).
export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 font-sans px-4">
            
            <div className="relative w-full max-w-xl h-20 mb-8 flex items-center overflow-hidden px-1">
                
                <div className="absolute top-1/2 left-0 right-0 h-0 border-t-2 border-dotted border-slate-300 transform -translate-y-1/2 z-0"></div>
                
                <div className="absolute top-1/2 left-0 h-0 border-t-2 border-dotted border-slate-50 transform -translate-y-1/2 z-10 animate-maskCut"></div>

                <div className="absolute top-1/2 h-10 w-10 flex items-center justify-center transform -translate-y-1/2 z-20 animate-movingScissors">
                    
                    <FaCut className="text-4xl text-slate-800 animate-snipAction shadow-slate-200 drop-shadow-md" />
                
                </div>
            </div>

            {/* Teks Loading */}
            <div className="flex flex-col items-center">
                <p className="text-slate-800 text-sm font-black tracking-[0.3em] uppercase animate-pulse">
                    Prepairing
                </p>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1">
                    Your Tools..
                </p>
            </div>

            {/* CSS Custom untuk Kompleks Animasi (Tiga Animasi Saling Sinkron) */}
            <style dangerouslySetInnerHTML={{ __html: `
                /* 1. Animasi Gerak Horisontal (Lurus ke Samping) across the whole track */
                @keyframes movingScissors {
                    0% { left: 4px; } /* Start of track */
                    100% { left: calc(100% - 44px); } /* End of track minus scissors width */
                }
                .animate-movingScissors {
                    /* Durasi 2s untuk satu pass ke samping, bergerak linear */
                    animation: movingScissors 2s linear infinite;
                }

                /* 2. Animasi Snipping Action (Buka/Tutup Cepat) - Berulang cepat */
                @keyframes snipAction {
                    0% { transform: rotate(0deg); }
                    50% { transform: rotate(-35deg); } /* Close blade */
                    100% { transform: rotate(0deg); } /* Open blade */
                }
                .animate-snipAction {
                    /* Jalankan animasi ini jauh lebih cepat (0.4s) dan berulang */
                    animation: snipAction 0.4s ease-in-out infinite;
                }

                /* 3. Animasi MASKING (Matches movingScissors to hide 'cut' part) */
                /* Kita gunakan efek 'width' latar belakang putih yang melebar perlahan */
                @keyframes maskCut {
                    0% { width: 4px; opacity: 1; }
                    /* Sedikit offset agar terlihat seperti guntinglah yang menghapus */
                    100% { width: calc(100% - 44px); opacity: 0; }
                }
                .animate-maskCut {
                    /* Harus SAMA PERSIS durasi dan timing dengan movingScissors */
                    animation: maskCut 2s linear infinite;
                }
            `}} />
        </div>
    );
}