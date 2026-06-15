import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCut, FaCalendarAlt, FaShoppingBag, FaTicketAlt, 
  FaUserCog, FaSignOutAlt, FaStar, FaClock, FaHistory, 
  FaCheckCircle, FaBox, FaTruck, FaReceipt, FaCrown, FaArrowLeft, FaUserTie,
  FaCamera, FaSave, FaEnvelope, FaPhone, FaLock, FaCopy, FaChevronRight, FaArrowRight 
} from 'react-icons/fa';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('hub');
  
  // State interaktif untuk fitur "Copy Voucher"
  const [copiedVoucher, setCopiedVoucher] = useState(null);

  const handleLogout = () => {
    navigate('/');
  };

  const handleCopyVoucher = (code) => {
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2000); 
  };

  // ==========================================
  // DATA DUMMY
  // ==========================================
  const jadwalAktif = [
    { id: 'HC-88912', service: 'HairCut Signature', kapster: 'Andi', date: '24 Okt 2026', time: '14:00', status: 'Terkonfirmasi', price: 'Rp 75.000' }
  ];

  const riwayatBooking = [
    { id: 'HC-77102', service: 'Classic Shave', kapster: 'Budi', date: '10 Sep 2026', time: '16:30', status: 'Selesai', price: 'Rp 35.000' },
    { id: 'HC-65231', service: 'HairCut Signature', kapster: 'Andi', date: '15 Agu 2026', time: '11:00', status: 'Selesai', price: 'Rp 75.000' },
    { id: 'HC-55091', service: 'Hair Coloring', kapster: 'Reza', date: '02 Jul 2026', time: '13:00', status: 'Selesai', price: 'Rp 150.000' },
  ];

  const pesananProduk = [
    { id: 'ORD-9921', date: '20 Okt 2026', items: 'Matte Clay Pomade (1x), Hair Tonic Ginseng (1x)', total: 'Rp 205.000', status: 'Dikirim', resi: 'JNT1234567890' },
    { id: 'ORD-8812', date: '05 Sep 2026', items: 'Beard Oil Premium (1x)', total: 'Rp 95.000', status: 'Selesai', resi: 'SICEPAT09876' }
  ];

  const voucherSaya = [
    { code: 'WELCOME20', title: 'First Haircut', discount: '20%', validUntil: '31 Des 2026', status: 'Aktif', badgeColor: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-transparent' },
    { code: 'POMADE15', title: 'Diskon Pomade', discount: 'Rp 15k', validUntil: '15 Nov 2026', status: 'Aktif', badgeColor: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-transparent' },
    { code: 'LOYAL50', title: 'Potongan Khusus', discount: 'Rp 50k', validUntil: '01 Agu 2026', status: 'Terpakai', badgeColor: 'bg-gray-200 text-gray-500 border-gray-300' }
  ];

  // ==========================================
  // KOMPONEN RENDER HALAMAN
  // ==========================================

  const renderHub = () => (
    <div className="animate-fade-in relative z-10">
      {/* Welcome Section */}
      <div className="mb-12 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold tracking-widest uppercase mb-4 text-blue-600">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Member Area
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 pb-2">
          Halo, Rafif! <span className="inline-block origin-bottom-right animate-[wave_2s_infinite] text-black">👋</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg max-w-xl leading-relaxed">Selamat datang kembali. Siap untuk menyempurnakan gaya Anda hari ini?</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(234,179,8,0.15)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-100 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"><FaStar /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Poin Loyalitas</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">1,250</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"><FaHistory /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Kunjungan</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">12 Kali</h3>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 via-black to-slate-900 p-6 rounded-[2rem] border border-gray-800 shadow-xl flex items-center gap-5 group relative overflow-hidden hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-yellow-400 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 backdrop-blur-md relative z-10 border border-white/5"><FaCrown /></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Member</p>
            <h3 className="text-2xl font-black text-white mt-0.5">Gold</h3>
          </div>
        </div>
      </div>

      {/* Tanda Jadwal Terdekat (Highlight) */}
      {jadwalAktif.length > 0 && (
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] border border-emerald-400 p-1 md:p-1.5 mb-12 shadow-[0_10px_30px_rgba(16,185,129,0.25)] cursor-pointer hover:scale-[1.01] transition-transform duration-300 group"
          onClick={() => setCurrentView('appointments')}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-[1.7rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Jadwal Terdekat
                </p>
                <h4 className="font-black text-gray-900 mt-1 text-lg">{jadwalAktif[0].service} — {jadwalAktif[0].date}</h4>
              </div>
            </div>
            <button className="w-full md:w-auto px-6 py-3 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center gap-2 border border-emerald-100">
              Lihat Detail <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* HUB GRID CARDS (Main Menu - COLORFUL) */}
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
        Eksplorasi Menu <span className="h-px bg-gray-200 flex-1"></span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card: Booking Saya (Tema Biru) */}
        <button 
          onClick={() => setCurrentView('appointments')} 
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] hover:border-blue-200 hover:-translate-y-1.5 active:scale-95 transition-all duration-300 text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg transition-all duration-300 relative z-10 border border-blue-100">
            <FaCalendarAlt />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 relative z-10 flex items-center justify-between group-hover:text-blue-600 transition-colors">
            Booking Saya
            <FaArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm" />
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed relative z-10">Kelola jadwal aktif dan lihat riwayat kunjungan potong rambut Anda.</p>
        </button>

        {/* Card: Pesanan Produk (Tema Jingga/Amber) */}
        <button 
          onClick={() => setCurrentView('orders')} 
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)] hover:border-amber-200 hover:-translate-y-1.5 active:scale-95 transition-all duration-300 text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-lg transition-all duration-300 relative z-10 border border-amber-100">
            <FaShoppingBag />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 relative z-10 flex items-center justify-between group-hover:text-amber-600 transition-colors">
            Pesanan Produk
            <FaArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm" />
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed relative z-10">Lacak status pengiriman pomade dan riwayat belanja produk Anda.</p>
        </button>

        {/* Card: Voucher Promo (Tema Hijau/Emerald) */}
        <button 
          onClick={() => setCurrentView('vouchers')} 
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] hover:border-emerald-200 hover:-translate-y-1.5 active:scale-95 transition-all duration-300 text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-lg transition-all duration-300 relative z-10 border border-emerald-100">
            <FaTicketAlt />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 relative z-10 flex items-center justify-between group-hover:text-emerald-600 transition-colors">
            Voucher Promo
            <FaArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm" />
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed relative z-10">Klaim dan gunakan kupon diskon eksklusif untuk layanan & produk.</p>
        </button>

        {/* Card: Pengaturan Profil (Tema Ungu/Purple) */}
        <button 
          onClick={() => setCurrentView('profile')} 
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)] hover:border-purple-200 hover:-translate-y-1.5 active:scale-95 transition-all duration-300 text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-lg transition-all duration-300 relative z-10 border border-purple-100">
            <FaUserCog />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 relative z-10 flex items-center justify-between group-hover:text-purple-600 transition-colors">
            Pengaturan Profil
            <FaArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-sm" />
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed relative z-10">Perbarui data diri, foto profil, password, dan keamanan akun.</p>
        </button>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="animate-fade-in">
      <button onClick={() => setCurrentView('hub')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group">
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Dashboard
      </button>

      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Kelola Jadwal</h2>
          <p className="text-gray-500 mt-2">Pantau jadwal aktif dan histori perawatan Anda.</p>
        </div>
        <Link to="/booking" className="relative z-10 inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_25px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:scale-95 w-full md:w-auto">
          <FaCut /> Booking Baru
        </Link>
      </div>

      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
        Menunggu Kedatangan <span className="h-px bg-gray-200 flex-1"></span>
      </h3>
      <div className="grid grid-cols-1 gap-5 mb-12">
        {jadwalAktif.length > 0 ? (
          jadwalAktif.map((jadwal) => (
            <div key={jadwal.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all group">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-20 h-20 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex flex-col items-center justify-center shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <span className="text-xs font-bold uppercase">{jadwal.date.split(' ')[1]}</span>
                  <span className="text-2xl font-black leading-tight">{jadwal.date.split(' ')[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {jadwal.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold tracking-widest">ID: {jadwal.id}</span>
                  </div>
                  <h4 className="font-black text-gray-900 text-xl">{jadwal.service}</h4>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-4 mt-2 font-medium">
                    <span className="flex items-center gap-1.5"><FaClock className="text-gray-400" /> {jadwal.time} WIB</span>
                    <span className="flex items-center gap-1.5"><FaUserTie className="text-gray-400" /> {jadwal.kapster}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 gap-4">
                <p className="font-black text-gray-900 text-xl">{jadwal.price}</p>
                <button className="px-6 py-2.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white active:scale-95 transition-all">
                  Lihat E-Ticket
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><FaCalendarAlt /></div>
            <p className="text-gray-500 font-medium">Tidak ada jadwal aktif saat ini.</p>
          </div>
        )}
      </div>

      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
        Riwayat Kunjungan <span className="h-px bg-gray-200 flex-1"></span>
      </h3>
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-widest">
                <th className="p-6 font-bold w-1/4">Tanggal</th>
                <th className="p-6 font-bold w-1/4">Layanan</th>
                <th className="p-6 font-bold w-1/4">Kapster</th>
                <th className="p-6 font-bold text-right w-1/4">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {riwayatBooking.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors group cursor-pointer">
                  <td className="p-6">
                    <p className="font-bold text-gray-900">{item.date}</p>
                    <p className="text-xs text-gray-400">{item.time} WIB</p>
                  </td>
                  <td className="p-6 font-bold text-gray-900">{item.service}</td>
                  <td className="p-6 text-gray-600 flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">{item.kapster.charAt(0)}</div>
                    {item.kapster}
                  </td>
                  <td className="p-6 text-right">
                    <p className="font-black text-gray-900">{item.price}</p>
                    <span className="inline-block mt-1 bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Selesai</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="animate-fade-in">
      <button onClick={() => setCurrentView('hub')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-amber-600 transition-colors group">
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Dashboard
      </button>

      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pesanan Produk</h2>
          <p className="text-gray-500 mt-2">Lacak status pesanan dan histori belanja Anda.</p>
        </div>
        <div className="hidden md:flex w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl items-center justify-center text-2xl relative z-10 border border-amber-100 shadow-inner">
          <FaBox />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pesananProduk.map((order) => (
          <div key={order.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.1)] transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-5 mb-5 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-inner ${order.status === 'Dikirim' ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-green-100 text-green-600 border border-green-200'}`}>
                  {order.status === 'Dikirim' ? <FaTruck /> : <FaCheckCircle />}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg leading-tight">{order.id}</h4>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">{order.date}</p>
                </div>
              </div>
              <span className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-widest border ${
                order.status === 'Dikirim' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-green-50 text-green-600 border-green-200'
              }`}>
                Status: {order.status}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Daftar Produk</p>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">{order.items}</p>
                </div>
                {order.resi && (
                  <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 mt-2">
                    <FaReceipt className="text-gray-400 text-xs" />
                    <span className="text-xs text-gray-500">Resi: <strong className="text-gray-900">{order.resi}</strong></span>
                  </div>
                )}
              </div>
              <div className="text-left md:text-right w-full md:w-auto bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl border border-gray-100 md:border-none">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Belanja</p>
                <p className="text-2xl font-black text-gray-900">{order.total}</p>
                {order.status === 'Dikirim' && (
                  <button className="mt-4 w-full md:w-auto px-6 py-3 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 hover:-translate-y-0.5 active:scale-95 transition-all shadow-[0_5px_15px_rgba(245,158,11,0.3)]">
                    Lacak Pengiriman
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVouchers = () => (
    <div className="animate-fade-in">
      <button onClick={() => setCurrentView('hub')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors group">
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Dashboard
      </button>

      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Voucher & Promo</h2>
          <p className="text-gray-500 mt-2">Klaim dan gunakan penawaran spesial Anda.</p>
        </div>
        <div className="hidden md:flex w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl items-center justify-center text-2xl relative z-10 border border-emerald-100 shadow-inner">
          <FaTicketAlt />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {voucherSaya.map((voucher, idx) => (
          <div key={idx} className={`relative p-8 rounded-[2rem] overflow-hidden transition-all duration-300 ${voucher.status === 'Aktif' ? 'bg-white border-2 border-emerald-50 shadow-md hover:shadow-xl hover:-translate-y-1' : 'bg-gray-50 border-2 border-gray-200 opacity-70 grayscale-[50%]'}`}>
            {/* Hiasan Tiket Cutout */}
            <div className="absolute top-1/2 -left-4 w-8 h-8 bg-[#F4F7FE] rounded-full transform -translate-y-1/2 border-r-2 border-gray-100"></div>
            <div className="absolute top-1/2 -right-4 w-8 h-8 bg-[#F4F7FE] rounded-full transform -translate-y-1/2 border-l-2 border-gray-100"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className={`px-3 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-widest shadow-sm ${voucher.badgeColor}`}>
                {voucher.status}
              </span>
              <FaTicketAlt className={voucher.status === 'Aktif' ? 'text-emerald-500 text-2xl drop-shadow-sm' : 'text-gray-300 text-2xl'} />
            </div>
            
            <div className="relative z-10">
              <h4 className="font-bold text-gray-500 text-sm mb-1">{voucher.title}</h4>
              <h3 className={`text-4xl font-black mb-8 tracking-tighter ${voucher.status === 'Aktif' ? 'text-gray-900' : 'text-gray-400'}`}>
                {voucher.discount}
              </h3>
            </div>
            
            <div className="pt-6 border-t-2 border-dashed border-gray-200 relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Berlaku s/d</p>
                  <p className="text-xs font-bold text-gray-700">{voucher.validUntil}</p>
                </div>
              </div>
              
              <button 
                onClick={() => voucher.status === 'Aktif' && handleCopyVoucher(voucher.code)}
                disabled={voucher.status !== 'Aktif'}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                  voucher.status !== 'Aktif' 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : copiedVoucher === voucher.code 
                      ? 'bg-emerald-500 text-white shadow-[0_5px_15px_rgba(16,185,129,0.3)]'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-100 hover:border-emerald-500'
                }`}
              >
                {copiedVoucher === voucher.code ? (
                  <><FaCheckCircle /> Tersalin!</>
                ) : (
                  <><FaCopy /> {voucher.status === 'Aktif' ? voucher.code : 'Kedaluwarsa'}</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="animate-fade-in">
      <button onClick={() => setCurrentView('hub')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors group">
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Dashboard
      </button>

      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pengaturan Profil</h2>
          <p className="text-gray-500 mt-2">Kelola informasi data diri dan keamanan akun Anda.</p>
        </div>
        <div className="hidden md:flex w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl items-center justify-center text-2xl relative z-10 border border-purple-100 shadow-inner">
          <FaUserCog />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Foto Profil */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center flex flex-col items-center sticky top-24">
            <div className="relative w-40 h-40 mb-5 group cursor-pointer">
              <div className="w-full h-full rounded-full border-4 border-white shadow-[0_10px_20px_rgba(168,85,247,0.15)] overflow-hidden bg-purple-50">
                <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-purple-900/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                <FaCamera className="text-white text-2xl mb-1" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Ubah Foto</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900">Rafif Zidane</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest mt-3 shadow-md">
              <FaCrown className="text-[10px]" /> Gold Member
            </span>
            <div className="w-full h-px bg-gray-100 my-6"></div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Gunakan foto dengan resolusi minimal 500x500px. Format yang diizinkan: JPG, PNG. Maks. 2MB.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Form Data Diri & Password */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Form Data Diri */}
          <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">Informasi Pribadi</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-purple-600 transition-colors">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <FaUserTie className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input type="text" defaultValue="Rafif Zidane" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm font-medium hover:bg-gray-100" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-purple-600 transition-colors">Nomor Telepon</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input type="text" defaultValue="081234567890" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm font-medium hover:bg-gray-100" />
                  </div>
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-purple-600 transition-colors">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input type="email" defaultValue="rafif@example.com" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm font-medium hover:bg-gray-100" />
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button type="submit" className="bg-purple-600 text-white px-8 py-4 rounded-xl text-xs font-bold hover:bg-purple-700 hover:-translate-y-1 active:scale-95 transition-all shadow-[0_10px_20px_rgba(168,85,247,0.25)] flex items-center gap-3 w-full md:w-auto justify-center">
                  <FaSave className="text-base" /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* Form Ubah Password */}
          <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">Keamanan Akun</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-purple-600 transition-colors">Password Saat Ini</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input type="password" placeholder="Masukkan password saat ini" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm hover:bg-gray-100" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-purple-600 transition-colors">Password Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input type="password" placeholder="Password baru" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm hover:bg-gray-100" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-purple-600 transition-colors">Konfirmasi Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input type="password" placeholder="Ulangi password baru" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm hover:bg-gray-100" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button type="submit" className="bg-purple-50 text-purple-700 px-8 py-4 rounded-xl text-xs font-bold hover:bg-purple-600 hover:text-white active:scale-95 transition-all flex items-center gap-3 w-full md:w-auto justify-center border border-purple-100 hover:border-purple-600 shadow-sm hover:shadow-md">
                  <FaLock className="text-base" /> Perbarui Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );

  // ==========================================
  // RENDER UTAMA (LAYOUT DASAR)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans selection:bg-gray-800 selection:text-white relative">
      {/* Background Ornaments (Aksen Warna Halus) */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -z-10 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[150px] -z-10 pointer-events-none transform translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* HEADER NAVIGASI */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg group-hover:-rotate-12 transition-transform duration-300">
              <FaCut className="text-lg" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">HairCut.</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 border-r border-gray-200 pr-5 mr-1">
              <div className="text-right">
                <p className="text-xs font-black text-gray-900">Rafif Zidane</p>
                <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Gold Member</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <button onClick={handleLogout} className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 bg-white hover:bg-red-50 px-4 py-2.5 rounded-full border border-gray-200 hover:border-red-100 shadow-sm">
              <span className="hidden sm:inline">Logout</span> <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16 relative z-10">
        {currentView === 'hub' && renderHub()}
        {currentView === 'appointments' && renderAppointments()}
        {currentView === 'orders' && renderOrders()}
        {currentView === 'vouchers' && renderVouchers()}
        {currentView === 'profile' && renderProfile()}
      </main>

    </div>
  );
}