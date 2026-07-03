import { Outlet, useLocation, Link } from "react-router-dom";

export default function AuthLayout() {
    // Mendapatkan lokasi path saat ini untuk mengubah teks secara dinamis (Login/Register)
    const location = useLocation();
    const isLogin = location.pathname !== "/register";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB] font-sans p-4 md:p-8">

            {/* Main Card Container */}
            <div className="flex flex-col md:flex-row w-full max-w-[1050px] bg-white rounded-[2.5rem] shadow-xl overflow-hidden min-h-[600px]">

                {/* ================= LEFT PANEL (Text Only & Centered) ================= */}
                {/* Menambahkan items-center dan justify-center agar konten berada tepat di tengah */}
                <div className="hidden md:flex flex-col items-center justify-center text-center relative w-1/2 p-12 lg:p-16 bg-gradient-to-br from-[#EDEEFC] via-white to-[#E6F1FD] overflow-hidden">

                    {/* Efek Cahaya / Blur Background */}
                    <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#D0BDF0]/50 rounded-full mix-blend-multiply filter blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-[#7DBBFF]/40 rounded-full mix-blend-multiply filter blur-3xl"></div>

                    {/* Header Logo & Tulisan */}
                    <div className="relative z-10 flex flex-col items-center">
                        <h1 className="text-4xl font-black tracking-tighter text-[#101623] mb-6">
                            Hair<span className="text-[#495B70]">Cut.</span>
                        </h1>
                        <h2 className="text-[32px] leading-tight font-extrabold text-[#0C0C0C] mb-4">
                            {isLogin ? "Sign In to Admin Portal" : "Create an Account"}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm">
                            {isLogin ? "If you don't have an account, you can " : "If you already have an account, you can "}
                            <Link to={isLogin ? "/register" : "/login"} className="text-[#7DBBFF] hover:text-[#A0BCE8] font-bold transition-colors">
                                {isLogin ? "Register here!" : "Login here!"}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* ================= RIGHT PANEL (Form Outlet) ================= */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white relative z-10">

                    {/* Header Logo untuk Mobile Saja */}
                    <div className="md:hidden flex flex-col items-center justify-center mb-8">
                        <h1 className="text-4xl font-black tracking-tighter text-[#101623]">
                            Hair<span className="text-[#495B70]">Cut.</span>
                        </h1>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">
                            Admin Portal
                        </p>
                    </div>

                    {/* Komponen Form Login/Register Anda akan dirender di sini */}
                    <div className="w-full max-w-sm mx-auto">
                        <Outlet />
                    </div>

                    {/* Footer Section */}
                    <p className="text-center text-[11px] font-medium text-gray-400 mt-12">
                        © 2026 Rafif HairCut Barbershop.<br />All rights reserved.
                    </p>
                </div>

            </div>
        </div>
    );
}