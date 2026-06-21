import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCut, FaCalendarAlt, FaShoppingBag, FaTicketAlt, 
  FaUserCog, FaSignOutAlt, FaStar, FaClock, FaHistory, 
  FaCheckCircle, FaBox, FaTruck, FaReceipt, FaCrown, FaArrowLeft, FaUserTie,
  FaCamera, FaSave, FaEnvelope, FaPhone, FaLock, FaCopy, FaChevronRight, FaArrowRight,
  FaTimes, FaBarcode, FaQrcode
} from 'react-icons/fa';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('hub');
  
  // State interaktif
  const [copiedVoucher, setCopiedVoucher] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  
  // Profil State
  const [profileImg, setProfileImg] = useState("https://i.pravatar.cc/150?img=11");
  const fileInputRef = useRef(null);

  const handleLogout = () => navigate('/');

  const handleCopyVoucher = (code) => {
    setCopiedVoucher(code);
    navigator.clipboard.writeText(code);
    setTimeout(() => setCopiedVoucher(null), 2000); 
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
        showToast('Foto profil berhasil diperbarui!');
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // DATA DUMMY
  // ==========================================
  const jadwalAktif = [
    { id: 'HC-88912', service: 'Premium Haircut & Wash', kapster: 'Andi Saputra', date: '24 Okt 2026', time: '14:00', status: 'Terkonfirmasi', price: 'Rp 75.000' }
  ];

  const riwayatBooking = [
    { id: 'HC-77102', service: 'Classic Shave', kapster: 'Budi Hartono', date: '10 Sep 2026', time: '16:30', status: 'Selesai', price: 'Rp 35.000' },
    { id: 'HC-65231', service: 'HairCut Signature', kapster: 'Andi Saputra', date: '15 Agu 2026', time: '11:00', status: 'Selesai', price: 'Rp 75.000' },
  ];

  const pesananProduk = [
    { id: 'ORD-9921', date: '20 Okt 2026', items: 'Matte Clay Pomade (1x), Hair Tonic (1x)', total: 'Rp 205.000', status: 'Dikirim', resi: 'JNT1234567890' },
    { id: 'ORD-8812', date: '05 Sep 2026', items: 'Beard Oil Premium (1x)', total: 'Rp 95.000', status: 'Selesai', resi: 'SICEPAT09876' }
  ];

  const voucherSaya = [
    { code: 'WELCOME20', title: 'First Haircut', discount: '20%', validUntil: '31 Des 2026', status: 'Aktif' },
    { code: 'POMADE15', title: 'Diskon Pomade', discount: 'Rp 15k', validUntil: '15 Nov 2026', status: 'Aktif' },
    { code: 'LOYAL50', title: 'Potongan Khusus', discount: 'Rp 50k', validUntil: '01 Agu 2026', status: 'Terpakai' }
  ];

  // ==========================================
  // MODALS (TICKET & TRACKING)
  // ==========================================
  const TicketModal = () => {
    if (!showTicketModal || !selectedTicket) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl transform scale-100 animate-in zoom-in-95 duration-300 relative border border-slate-100">
          
          <div className="bg-slate-800 p-6 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 pointer-events-none"></div>
            
            {/* PERBAIKAN TOMBOL CLOSE: Memperbesar padding, menaikkan z-index, dan cursor-pointer jelas */}
            <button 
              onClick={() => setShowTicketModal(false)} 
              className="absolute top-3 right-3 p-3 z-50 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all hover:rotate-90 cursor-pointer"
              aria-label="Tutup E-Ticket"
            >
              <FaTimes className="text-white text-lg" />
            </button>
            
            <div className="relative z-10 pt-4">
              <FaCheckCircle className="text-4xl text-emerald-400 mx-auto mb-3 animate-[bounce_2s_infinite]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1">E-Ticket Confirmed</p>
              <h3 className="text-2xl font-black tracking-widest">{selectedTicket.id}</h3>
            </div>
          </div>
          
          <div className="p-8 relative">
            <div className="absolute -top-4 left-6 w-8 h-8 bg-slate-900/40 backdrop-blur-sm rounded-full pointer-events-none"></div>
            <div className="absolute -top-4 right-6 w-8 h-8 bg-slate-900/40 backdrop-blur-sm rounded-full pointer-events-none"></div>
            
            <div className="space-y-4 mb-8">
              <div className="animate-in slide-in-from-left-4 delay-100 fade-in fill-mode-both duration-500">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Layanan</p>
                <p className="font-bold text-slate-800 text-lg">{selectedTicket.service}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-left-4 delay-200 fade-in fill-mode-both duration-500">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</p>
                  <p className="font-bold text-slate-800">{selectedTicket.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waktu</p>
                  <p className="font-bold text-slate-800">{selectedTicket.time} WIB</p>
                </div>
              </div>
              <div className="animate-in slide-in-from-left-4 delay-300 fade-in fill-mode-both duration-500">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kapster</p>
                <p className="font-bold text-slate-800 flex items-center gap-2"><FaUserTie className="text-blue-500"/> {selectedTicket.kapster}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed animate-in slide-in-from-bottom-4 delay-500 fade-in fill-mode-both duration-500">
              <FaQrcode className="text-6xl text-slate-700 mb-2" />
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Scan di Kasir</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TrackingModal = () => {
    if (!showTrackingModal || !selectedOrder) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-500 border border-slate-100">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="font-black text-slate-800 text-lg">Lacak Pengiriman</h3>
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">ID: {selectedOrder.id}</p>
            </div>
            <button onClick={() => setShowTrackingModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-100 hover:rotate-90 transition-all">
              <FaTimes className="text-slate-600" />
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-8 animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 text-xl shadow-sm"><FaTruck className="animate-pulse" /></div>
              <div>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Resi Pengiriman</p>
                <p className="font-black text-slate-800 text-lg font-mono tracking-wider">{selectedOrder.resi}</p>
              </div>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-slate-100">
              <div className="relative z-10 flex items-start gap-4 animate-in slide-in-from-bottom-4 fade-in delay-100 fill-mode-both duration-500">
                <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-sm flex-shrink-0 -ml-[23px] mt-0.5"><FaCheckCircle className="text-white text-[10px]" /></div>
                <div>
                  <p className="font-bold text-slate-800">Paket sedang diantar kurir ke tujuan</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">21 Okt 2026, 08:30 WIB</p>
                </div>
              </div>
              <div className="relative z-10 flex items-start gap-4 animate-in slide-in-from-bottom-4 fade-in delay-200 fill-mode-both duration-500">
                <div className="w-6 h-6 rounded-full bg-slate-200 border-4 border-white flex-shrink-0 -ml-[23px] mt-0.5"></div>
                <div>
                  <p className="font-bold text-slate-500">Paket telah tiba di fasilitas transit kota tujuan</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">20 Okt 2026, 22:15 WIB</p>
                </div>
              </div>
              <div className="relative z-10 flex items-start gap-4 animate-in slide-in-from-bottom-4 fade-in delay-300 fill-mode-both duration-500">
                <div className="w-6 h-6 rounded-full bg-slate-200 border-4 border-white flex-shrink-0 -ml-[23px] mt-0.5"></div>
                <div>
                  <p className="font-bold text-slate-500">Paket diserahkan ke pihak ekspedisi</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">20 Okt 2026, 15:00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // STYLES ANIMASI CSS KHUSUS
  // ==========================================
  const customStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    .fade-up-item {
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  // ==========================================
  // KOMPONEN RENDER HALAMAN
  // ==========================================

  const renderHub = () => (
    <div className="relative z-10">
      <div className="mb-12 fade-up-item" style={{ animationDelay: '0ms' }}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-[10px] font-bold tracking-widest uppercase mb-4 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Member Dashboard
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-800 pb-2">
          Halo, Rafif! <span className="inline-block origin-bottom-right animate-[wave_2s_infinite] text-black">👋</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg max-w-xl font-medium">Selamat datang. Mari tingkatkan penampilan Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-5 group fade-up-item" style={{ animationDelay: '100ms' }}>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 group-hover:rotate-12"><FaStar /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Poin Loyalitas</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">1,250</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 transition-all duration-300 flex items-center gap-5 group fade-up-item" style={{ animationDelay: '200ms' }}>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 group-hover:-rotate-12"><FaHistory /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Kunjungan</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">12 Kali</h3>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-lg flex items-center gap-5 group relative overflow-hidden hover:-translate-y-1.5 transition-all duration-300 fade-up-item" style={{ animationDelay: '300ms' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-yellow-400 flex items-center justify-center text-2xl border border-white/10 relative z-10 group-hover:scale-110 transition-transform duration-300"><FaCrown /></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Status Member</p>
            <h3 className="text-2xl font-black text-white mt-0.5">Gold</h3>
          </div>
        </div>
      </div>

      {jadwalAktif.length > 0 && (
        <div 
          className="bg-white rounded-[2rem] border border-emerald-100 p-2 mb-12 shadow-[0_10px_40px_-15px_rgba(16,185,129,0.15)] cursor-pointer hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.25)] hover:-translate-y-1 transition-all duration-300 group fade-up-item"
          style={{ animationDelay: '400ms' }}
          onClick={() => setCurrentView('appointments')}
        >
          <div className="bg-emerald-50/50 rounded-[1.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-50">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Jadwal Mendatang
                </p>
                <h4 className="font-black text-slate-800 text-xl group-hover:text-emerald-700 transition-colors">{jadwalAktif[0].service}</h4>
              </div>
            </div>
            <button className="w-full md:w-auto px-6 py-3 bg-white text-emerald-700 font-bold text-sm rounded-xl border border-emerald-100 shadow-sm flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              Lihat Detail <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3 fade-up-item" style={{ animationDelay: '500ms' }}>
        Eksplorasi Menu <span className="h-px bg-slate-200 flex-1"></span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10">
        {[
          { id: 'appointments', icon: FaCalendarAlt, title: 'Booking Saya', desc: 'Kelola jadwal aktif dan riwayat.', color: 'blue' },
          { id: 'orders', icon: FaShoppingBag, title: 'Pesanan Produk', desc: 'Lacak pengiriman belanja Anda.', color: 'amber' },
          { id: 'vouchers', icon: FaTicketAlt, title: 'Voucher Promo', desc: 'Klaim kupon diskon menarik.', color: 'emerald' },
          { id: 'profile', icon: FaUserCog, title: 'Pengaturan Profil', desc: 'Perbarui data dan keamanan.', color: 'purple' }
        ].map((menu, idx) => (
          <button 
            key={menu.id}
            onClick={() => setCurrentView(menu.id)} 
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-300 text-left group relative overflow-hidden fade-up-item"
            style={{ animationDelay: `${600 + (idx * 100)}ms` }}
          >
            {/* Animasi latar belakang tipis saat hover */}
            <div className={`absolute inset-0 bg-${menu.color}-50/0 group-hover:bg-${menu.color}-50/50 transition-colors duration-500`}></div>
            
            <div className={`w-16 h-16 bg-${menu.color}-50 text-${menu.color}-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-${menu.color}-500 group-hover:text-white transition-colors duration-300 border border-${menu.color}-100 group-hover:shadow-lg relative z-10`}>
              <menu.icon className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className={`text-xl md:text-2xl font-black text-slate-800 mb-2 flex items-center justify-between relative z-10 group-hover:text-${menu.color}-700 transition-colors`}>
              {menu.title}
              <div className={`w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-${menu.color}-500 group-hover:border-${menu.color}-500 group-hover:text-white transition-all duration-300`}>
                <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
              </div>
            </h3>
            <p className="text-slate-500 text-sm font-medium relative z-10">{menu.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="fade-up-item pb-10">
      <button onClick={() => setCurrentView('hub')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group">
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:-translate-x-1 transition-transform shadow-sm"><FaArrowLeft className="text-xs" /></div> 
        Kembali
      </button>

      <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Kelola Jadwal</h2>
          <p className="text-slate-500 mt-2 font-medium">Pantau jadwal aktif dan histori perawatan Anda.</p>
        </div>
        <Link to="/booking" className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_25px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:scale-95">
          <FaCut /> Booking Baru
        </Link>
      </div>

      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 bg-white border border-slate-100 shadow-sm inline-flex items-center gap-2 px-3 py-1.5 rounded-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Menunggu Kedatangan
      </h3>
      
      <div className="grid grid-cols-1 gap-5 mb-12">
        {jadwalAktif.map((jadwal) => (
          <div key={jadwal.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-blue-200 transition-colors group relative overflow-hidden">
            {/* Dekorasi Card */}
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
              <div className="w-20 h-20 bg-blue-50 border border-blue-100 text-blue-600 rounded-[1.5rem] flex flex-col items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-blue-500 group-hover:text-blue-100">{jadwal.date.split(' ')[1]}</span>
                <span className="text-2xl font-black">{jadwal.date.split(' ')[0]}</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-bold rounded-md uppercase tracking-widest flex items-center gap-1.5">
                     Terkonfirmasi
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest">ID: {jadwal.id}</span>
                </div>
                <h4 className="font-black text-slate-800 text-xl group-hover:text-blue-700 transition-colors">{jadwal.service}</h4>
                <div className="text-sm text-slate-500 flex flex-wrap gap-4 mt-2 font-medium">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md"><FaClock className="text-slate-400" /> {jadwal.time} WIB</span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md"><FaUserTie className="text-slate-400" /> {jadwal.kapster}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 gap-4 relative z-10">
              <p className="font-black text-slate-800 text-xl">{jadwal.price}</p>
              <button onClick={() => { setSelectedTicket(jadwal); setShowTicketModal(true); }} className="px-6 py-3 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-black active:scale-95 transition-all shadow-md flex items-center gap-2 group-hover:-translate-y-1">
                <FaBarcode /> E-Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 bg-white border border-slate-100 shadow-sm inline-block px-3 py-1.5 rounded-md">Riwayat Kunjungan</h3>
      
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-widest">
                <th className="p-6 font-bold w-1/4">Tanggal & Waktu</th>
                <th className="p-6 font-bold w-1/4">Layanan</th>
                <th className="p-6 font-bold w-1/4">Kapster</th>
                <th className="p-6 font-bold text-right w-1/4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {riwayatBooking.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="p-6">
                    <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.date}</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{item.time} WIB</p>
                  </td>
                  <td className="p-6 font-bold text-slate-800">{item.service}</td>
                  <td className="p-6 text-slate-600 font-medium flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">{item.kapster.charAt(0)}</div>
                    {item.kapster}
                  </td>
                  <td className="p-6 text-right">
                    <p className="font-black text-slate-800">{item.price}</p>
                    <span className="inline-block mt-1.5 bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border border-slate-200">Selesai</span>
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
    <div className="fade-up-item pb-10">
      <button onClick={() => setCurrentView('hub')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-amber-600 transition-colors group">
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:-translate-x-1 transition-transform shadow-sm"><FaArrowLeft className="text-xs" /></div> 
        Kembali
      </button>

      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Pesanan Produk</h2>
        <p className="text-slate-500 mt-2 font-medium">Lacak status pesanan dan histori belanja pomade Anda.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pesananProduk.map((order) => (
          <div key={order.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.15)] hover:border-amber-100 transition-all duration-300 group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-50 pb-5 mb-5 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${order.status === 'Dikirim' ? 'bg-amber-50 text-amber-500 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'}`}>
                  {order.status === 'Dikirim' ? <FaTruck className="group-hover:-translate-x-1 transition-transform" /> : <FaCheckCircle />}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-amber-600 transition-colors">{order.id}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{order.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1.5 text-[9px] font-bold rounded-md uppercase tracking-widest border ${
                order.status === 'Dikirim' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                Status: {order.status}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Daftar Produk</p>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">{order.items}</p>
                </div>
              </div>
              <div className="text-left md:text-right w-full md:w-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Belanja</p>
                <p className="text-2xl font-black text-slate-800">{order.total}</p>
                {order.status === 'Dikirim' && (
                  <button onClick={() => { setSelectedOrder(order); setShowTrackingModal(true); }} className="mt-4 w-full md:w-auto px-6 py-3 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 hover:-translate-y-1 active:scale-95 transition-all shadow-[0_5px_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2">
                    Lacak Pengiriman <FaArrowRight />
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
    <div className="fade-up-item pb-10">
      <button onClick={() => setCurrentView('hub')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors group">
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:-translate-x-1 transition-transform shadow-sm"><FaArrowLeft className="text-xs" /></div> 
        Kembali
      </button>

      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Voucher Promo</h2>
        <p className="text-slate-500 mt-2 font-medium">Klaim dan gunakan kupon diskon Anda saat pembayaran.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {voucherSaya.map((voucher, idx) => (
          <div key={idx} className={`relative p-8 rounded-[2.5rem] transition-all duration-300 flex flex-col h-full overflow-hidden group ${voucher.status === 'Aktif' ? 'bg-white border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1.5' : 'bg-slate-50 border border-slate-200 opacity-70 grayscale-[30%]'}`}>
            
            {/* Animasi latar belakang tipis saat hover */}
            <div className="absolute inset-0 bg-emerald-50/0 group-hover:bg-emerald-50/30 transition-colors duration-500 z-0"></div>

            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className={`px-3 py-1.5 text-[9px] font-bold rounded-md uppercase tracking-widest border ${voucher.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {voucher.status}
              </span>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform duration-300 ${voucher.status === 'Aktif' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                <FaTicketAlt />
              </div>
            </div>
            
            <div className="flex-1 mb-6 relative z-10">
              <h4 className="font-bold text-slate-400 text-xs mb-1 uppercase tracking-widest">{voucher.title}</h4>
              <h3 className={`text-4xl font-black tracking-tighter ${voucher.status === 'Aktif' ? 'text-slate-800' : 'text-slate-400'}`}>
                {voucher.discount}
              </h3>
            </div>
            
            <div className="pt-6 border-t-2 border-dashed border-slate-200 mt-auto relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Berlaku s/d {voucher.validUntil}</p>
              
              <button 
                onClick={() => voucher.status === 'Aktif' && handleCopyVoucher(voucher.code)}
                disabled={voucher.status !== 'Aktif'}
                className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  voucher.status !== 'Aktif' 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : copiedVoucher === voucher.code 
                      ? 'bg-emerald-500 text-white shadow-[0_5px_15px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-800 text-white hover:bg-black active:scale-95 shadow-md'
                }`}
              >
                {copiedVoucher === voucher.code ? (
                  <><FaCheckCircle className="text-sm animate-in zoom-in duration-300" /> Tersalin!</>
                ) : (
                  <><FaCopy className="text-sm" /> {voucher.status === 'Aktif' ? voucher.code : 'Kedaluwarsa'}</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="fade-up-item pb-10">
      <button onClick={() => setCurrentView('hub')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors group">
        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:-translate-x-1 transition-transform shadow-sm"><FaArrowLeft className="text-xs" /></div> 
        Kembali
      </button>

      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Pengaturan Profil</h2>
        <p className="text-slate-500 mt-2 font-medium">Kelola informasi pribadi dan foto profil Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FOTO PROFIL */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center flex flex-col items-center group relative overflow-hidden hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.1)] transition-all duration-300">
            {/* Dekorasi BG */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
            />

            <div 
              className="relative w-36 h-36 mb-6 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-full h-full rounded-[2rem] border-4 border-white shadow-lg overflow-hidden bg-slate-100 relative z-10 group-hover:border-purple-50 transition-colors duration-300">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-slate-900/40 rounded-[2rem] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] z-20">
                <FaCamera className="text-white text-2xl mb-1.5 animate-bounce" />
                <span className="text-[9px] font-bold text-white uppercase tracking-widest">Ubah Foto</span>
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-800 tracking-tight relative z-10">Rafif Zidane</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold rounded-lg uppercase tracking-widest mt-3 relative z-10">
              <FaCrown className="text-[10px]" /> Gold Member
            </span>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* TOAST NOTIFICATION */}
          {toastMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300 shadow-sm">
              <FaCheckCircle className="text-emerald-500 text-xl" />
              <p className="font-bold text-sm">{toastMessage}</p>
            </div>
          )}
          
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.03)] transition-shadow duration-300">
            <h3 className="text-xl font-black text-slate-800 mb-8 pb-4 border-b border-slate-100">Informasi Pribadi</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); showToast('Data diri berhasil diperbarui!'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within/input:text-purple-500 transition-colors">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><FaUserTie className="text-slate-400 group-focus-within/input:text-purple-500 transition-colors" /></div>
                    <input type="text" defaultValue="Rafif Zidane" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-bold text-sm transition-all hover:bg-white" />
                  </div>
                </div>
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within/input:text-purple-500 transition-colors">Nomor Telepon</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><FaPhone className="text-slate-400 group-focus-within/input:text-purple-500 transition-colors" /></div>
                    <input type="text" defaultValue="081234567890" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-bold text-sm transition-all hover:bg-white" />
                  </div>
                </div>
              </div>
              <div className="space-y-2 group/input">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within/input:text-purple-500 transition-colors">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><FaEnvelope className="text-slate-400 group-focus-within/input:text-purple-500 transition-colors" /></div>
                  <input type="email" defaultValue="rafif@example.com" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-bold text-sm transition-all hover:bg-white" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-slate-800 text-white px-8 py-4 rounded-xl text-xs font-bold hover:bg-black active:scale-95 transition-all shadow-md flex items-center gap-2 hover:-translate-y-1 group/btn">
                  <FaSave className="group-hover/btn:scale-110 transition-transform" /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.03)] transition-shadow duration-300">
            <h3 className="text-xl font-black text-slate-800 mb-8 pb-4 border-b border-slate-100">Keamanan Akun</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); showToast('Password berhasil diperbarui!'); e.target.reset(); }}>
              <div className="space-y-2 group/input">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within/input:text-purple-500 transition-colors">Password Saat Ini</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><FaLock className="text-slate-400 group-focus-within/input:text-purple-500 transition-colors" /></div>
                  <input type="password" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all hover:bg-white" placeholder="••••••••" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within/input:text-purple-500 transition-colors">Password Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><FaLock className="text-slate-400 group-focus-within/input:text-purple-500 transition-colors" /></div>
                    <input type="password" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all hover:bg-white" placeholder="Password baru" />
                  </div>
                </div>
                <div className="space-y-2 group/input">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within/input:text-purple-500 transition-colors">Konfirmasi Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><FaLock className="text-slate-400 group-focus-within/input:text-purple-500 transition-colors" /></div>
                    <input type="password" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all hover:bg-white" placeholder="Ulangi password baru" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl text-xs font-bold hover:border-slate-800 hover:text-slate-900 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
                  <FaLock /> Perbarui Password
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
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* STYLE CSS KHUSUS ANIMASI */}
      <style>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: float 15s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      {/* BACKGROUND BLOBS (Halus & Interaktif) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-40 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      </div>
      
      {/* Background Dots */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      {/* Modals */}
      <TicketModal />
      <TrackingModal />

      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform duration-300">
              <FaCut className="text-lg" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">HairCut.</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 border-r border-slate-200 pr-5 mr-1 cursor-pointer group" onClick={() => setCurrentView('profile')}>
              <div className="text-right">
                <p className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors">Rafif Zidane</p>
                <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-0.5 flex items-center justify-end gap-1"><FaCrown/> Gold</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 group-hover:shadow-md transition-shadow">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md">
              <span className="hidden sm:inline">Logout</span> <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16 relative z-10">
        {currentView === 'hub' && renderHub()}
        {currentView === 'appointments' && renderAppointments()}
        {currentView === 'orders' && renderOrders()}
        {currentView === 'vouchers' && renderVouchers()}
        {currentView === 'profile' && renderProfile()}
      </main>

    </div>
  );
}