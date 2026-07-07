
import React from 'react';
// KOMENTAR DEMO: Komponen PageHeader untuk menjaga konsistensi desain bagian atas halaman (Judul, Breadcrumb/Jejak navigasi, dan tombol aksi tambahan).
export default function PageHeader({ title, breadcrumb, children }) {
    // Mengecek apakah breadcrumb array atau string
    const displayBreadcrumb = Array.isArray(breadcrumb) 
        ? breadcrumb.join(' / ') 
        : breadcrumb;

    return (
        <div id="pageheader-container" className="flex items-center justify-between p-4 mb-2">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-2xl font-bold text-gray-800">
                    {title}
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-1 mt-1 text-xs text-gray-400">
                    <span className="cursor-pointer hover:text-hijau transition">Dashboard</span>
                    <span className="text-gray-600 font-bold">/ {displayBreadcrumb}</span>
                </div>
            </div>

            {/* Tempat untuk merender Tombol "Add Orders" / "Add Customer" */}
            <div id="action-button">
                {children}
            </div>
        </div>
    );
}