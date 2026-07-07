import React from 'react';
import { FaRegBell, FaSearch, FaHistory, FaRegSun } from "react-icons/fa";
import { FiSidebar } from "react-icons/fi";

// KOMENTAR DEMO: Komponen UI re-usable untuk bagian navigasi atas (Top Bar/Header) di dashboard admin. Berisi kotak pencarian (search) dan ikon notifikasi.
export default function Header() {
    return (
        <div id="header-container" className="flex justify-between items-center py-4 px-8 bg-[#F7F9FB] border-b border-gray-100 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Left Section: Sidebar Toggle & Breadcrumbs */}
            <div className="flex items-center space-x-4">
                <FiSidebar className="text-gray-500 text-xl cursor-pointer hover:text-[#0C0C0C]" />
                <div className="text-gray-400 text-sm font-medium flex items-center gap-2">
                    <span className="cursor-pointer hover:text-gray-600">Dashboards</span>
                    <span>/</span>
                    <span className="text-[#0C0C0C]">Default</span>
                </div>
            </div>

            {/* Right Section: Search & Icons */}
            <div id="icons-container" className="flex items-center space-x-5">
                
                {/* Search Bar (Gaya minimalis) */}
                <div id="search-bar" className="relative flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-64 shadow-sm">
                    <FaSearch id="search-icon" className="text-gray-400 text-xs" />
                    <input
                        id="search-input"
                        type="text"
                        placeholder="Search..."
                        className="border-none bg-transparent w-full outline-none text-sm ml-2 text-[#0C0C0C] placeholder-gray-400"
                    />
                    <span className="text-gray-300 text-xs bg-gray-50 px-1.5 rounded border border-gray-200">/</span>
                </div>

                {/* Minimal Icons */}
                <div className="flex items-center space-x-4 text-gray-500">
                    <FaRegSun className="cursor-pointer hover:text-[#0C0C0C] text-lg transition-colors" />
                    <FaHistory className="cursor-pointer hover:text-[#0C0C0C] text-lg transition-colors" />
                    <div className="relative cursor-pointer hover:text-[#0C0C0C] transition-colors">
                        <FaRegBell className="text-lg" />
                        <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
                    </div>
                    <FiSidebar className="cursor-pointer hover:text-[#0C0C0C] text-lg transition-colors" />
                </div>
            </div>
        </div>
    );
}