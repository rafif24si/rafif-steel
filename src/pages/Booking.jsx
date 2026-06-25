import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaCut, FaUserTie, FaCalendarCheck, 
  FaClock, FaCheckCircle, FaSpinner, FaChevronRight, FaStar, FaSpa, FaMagic, FaLeaf, FaWater 
} from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

export default function Booking() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    service: null,
    kapster: null,
    date: '', 
    time: null,
    price: 0
  });

  // PROTEKSI ROUTE
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/login-member', { state: { from: '/booking' } });
    }
  }, [navigate]);

  // DATA DUMMY LAYANAN - 9 ITEM
  const services = [
    { id: 1, name: 'Premium Haircut', price: 75000, duration: '45 Min', icon: FaCut, 
      bg: 'bg-blue-50', text: 'text-blue-500', hoverBg: 'group-hover:bg-blue-500', hoverText: 'group-hover:text-blue-700', borderHover: 'hover:border-blue-200', lightHover: 'group-hover:bg-blue-50/50', shadow: 'hover:shadow-blue-500/20' },
    { id: 2, name: 'Classic Shave', price: 50000, duration: '30 Min', icon: FaUserTie, 
      bg: 'bg-amber-50', text: 'text-amber-500', hoverBg: 'group-hover:bg-amber-500', hoverText: 'group-hover:text-amber-700', borderHover: 'hover:border-amber-200', lightHover: 'group-hover:bg-amber-50/50', shadow: 'hover:shadow-amber-500/20' },
    { id: 3, name: 'Hair Coloring', price: 150000, duration: '90 Min', icon: FaMagic, 
      bg: 'bg-purple-50', text: 'text-purple-500', hoverBg: 'group-hover:bg-purple-500', hoverText: 'group-hover:text-purple-700', borderHover: 'hover:border-purple-200', lightHover: 'group-hover:bg-purple-50/50', shadow: 'hover:shadow-purple-500/20' },
    { id: 4, name: 'Kids Haircut', price: 45000, duration: '30 Min', icon: FaCut, 
      bg: 'bg-emerald-50', text: 'text-emerald-500', hoverBg: 'group-hover:bg-emerald-500', hoverText: 'group-hover:text-emerald-700', borderHover: 'hover:border-emerald-200', lightHover: 'group-hover:bg-emerald-50/50', shadow: 'hover:shadow-emerald-500/20' },
    { id: 5, name: 'Hair Tattoo', price: 60000, duration: '40 Min', icon: FaCut, 
      bg: 'bg-rose-50', text: 'text-rose-500', hoverBg: 'group-hover:bg-rose-500', hoverText: 'group-hover:text-rose-700', borderHover: 'hover:border-rose-200', lightHover: 'group-hover:bg-rose-50/50', shadow: 'hover:shadow-rose-500/20' },
    { id: 6, name: 'Creambath', price: 85000, duration: '60 Min', icon: FaSpa, 
      bg: 'bg-indigo-50', text: 'text-indigo-500', hoverBg: 'group-hover:bg-indigo-500', hoverText: 'group-hover:text-indigo-700', borderHover: 'hover:border-indigo-200', lightHover: 'group-hover:bg-indigo-50/50', shadow: 'hover:shadow-indigo-500/20' },
    { id: 7, name: 'Gentleman Facial', price: 90000, duration: '45 Min', icon: FaLeaf, 
      bg: 'bg-teal-50', text: 'text-teal-500', hoverBg: 'group-hover:bg-teal-500', hoverText: 'group-hover:text-teal-700', borderHover: 'hover:border-teal-200', lightHover: 'group-hover:bg-teal-50/50', shadow: 'hover:shadow-teal-500/20' },
    { id: 8, name: 'Perm / Curly', price: 250000, duration: '120 Min', icon: FaWater, 
      bg: 'bg-cyan-50', text: 'text-cyan-500', hoverBg: 'group-hover:bg-cyan-500', hoverText: 'group-hover:text-cyan-700', borderHover: 'hover:border-cyan-200', lightHover: 'group-hover:bg-cyan-50/50', shadow: 'hover:shadow-cyan-500/20' },
    { id: 9, name: 'Scalp Treatment', price: 120000, duration: '60 Min', icon: FaSpa, 
      bg: 'bg-fuchsia-50', text: 'text-fuchsia-500', hoverBg: 'group-hover:bg-fuchsia-500', hoverText: 'group-hover:text-fuchsia-700', borderHover: 'hover:border-fuchsia-200', lightHover: 'group-hover:bg-fuchsia-50/50', shadow: 'hover:shadow-fuchsia-500/20' },
  ];

  const kapsters = [
    { id: 1, name: 'Andi Saputra', rating: '4.9', exp: '5 Thn', img: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, name: 'Budi Hartono', rating: '4.8', exp: '7 Thn', img: 'https://i.pravatar.cc/150?img=12' },
    { id: 3, name: 'Reza Pahlevi', rating: '4.9', exp: '4 Thn', img: 'https://i.pravatar.cc/150?img=13' },
    { id: 4, name: 'Dimas Anggara', rating: '4.7', exp: '3 Thn', img: 'https://i.pravatar.cc/150?img=14' },
    { id: 5, name: 'Tio Pratama', rating: '4.9', exp: '6 Thn', img: 'https://i.pravatar.cc/150?img=15' },
    { id: 6, name: 'Ryan Wijaya', rating: '4.8', exp: '30 Thn', img: 'https://i.pravatar.cc/150?img=17' },
  ];

  const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:30', '16:00', '17:30', '19:00', '20:00'];

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const formatDateToIndonesian = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleBack = () => {
    if (step > 1) prevStep();
    else navigate('/member-dashboard'); 
  };

  const handleServiceSelect = (service) => {
    setBookingData({ ...bookingData, service: service.name, price: service.price });
    nextStep();
  };

  const handleKapsterSelect = (kapster) => {
    setBookingData({ ...bookingData, kapster: kapster.name });
    nextStep();
  };

  const handleDateChange = (e) => {
    setBookingData({ ...bookingData, date: e.target.value, time: null });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const userEmail = localStorage.getItem('userEmail');
      
      const { error } = await supabase
        .from('haircut_bookings')
        .insert([{
          email: userEmail,
          layanan: bookingData.service,
          kapster: bookingData.kapster,
          tanggal: bookingData.date,
          waktu: bookingData.time,
          harga: bookingData.price.toString(), // konversi ke text jika kolom di DB adalah text
          status: 'Menunggu Konfirmasi'
        }]);

      if (error) throw error;
      
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Gagal melakukan booking", error);
      alert(`Terjadi kesalahan: ${error.message || error.details || 'Gagal memproses booking'}. Jika masalah berlanjut, periksa pengaturan RLS di Supabase Anda.`);
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // TAMPILAN SUKSES
  // ==========================================
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 selection:bg-slate-900 selection:text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none animate-[pulse_6s_infinite]"></div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] max-w-md w-full text-center transform transition-all animate-in zoom-in-95 duration-500 relative z-10">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm group hover:scale-110 transition-transform">
            <FaCheckCircle className="text-emerald-500 text-5xl animate-[bounce_2s_infinite]" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Booking Berhasil!</h2>
          <p className="text-slate-500 mb-8 font-medium">Jadwal Anda bersama <strong className="text-indigo-600">{bookingData.kapster}</strong> telah dikonfirmasi.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-100 shadow-inner">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Detail Reservasi</p>
            <p className="font-black text-slate-900 text-xl leading-tight mb-4">{bookingData.service}</p>
            <div className="space-y-3 pt-4 border-t border-slate-200/60">
              <p className="text-sm font-bold text-slate-600 flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100">
                <FaCalendarCheck className="text-emerald-500" /> {formatDateToIndonesian(bookingData.date)}
              </p>
              <p className="text-sm font-bold text-slate-600 flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100">
                <FaClock className="text-blue-500" /> {bookingData.time} WIB
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/member-dashboard')} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg hover:shadow-xl hover:-translate-y-1">
              Lihat Tiket di Dashboard
            </button>
            <button onClick={() => navigate('/')} className="w-full bg-white text-slate-600 border border-slate-200 font-bold py-4 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95">
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN FORM BOOKING (LANGKAH 1-4)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-slate-900 selection:text-white pb-20 relative overflow-hidden">
      
      {/* Background Dots Pattern */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* Header Booking */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button onClick={handleBack} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm group">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">Reservasi Jadwal</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 sm:hidden">Langkah {step}/4</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Langkah {step} dari 4</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-slate-900 shadow-sm' : 'w-2 bg-slate-200'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="animate-fade-in">
          
          {/* STEP 1: Pilih Layanan (KOTAK BESAR) */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tighter">Pilih Layanan</h2>
                <p className="text-slate-500 text-lg font-medium">Perawatan apa yang Anda butuhkan hari ini?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {services.map((service, idx) => (
                  <button 
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] text-left transition-all duration-300 group focus:outline-none flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[280px] relative overflow-hidden active:scale-[0.98] hover:-translate-y-2 ${service.borderHover} shadow-sm ${service.shadow}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className={`absolute inset-0 opacity-0 transition-colors duration-500 z-0 ${service.lightHover}`}></div>
                    
                    <div className="flex justify-between items-start w-full relative z-10">
                      <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl transition-all duration-500 shadow-sm border border-white group-hover:scale-110 group-hover:-rotate-12 group-hover:text-white ${service.bg} ${service.text} ${service.hoverBg}`}>
                        <service.icon />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-white transition-colors">{service.duration}</span>
                    </div>
                    
                    <div className="w-full relative z-10 mt-auto pt-6">
                      <h3 className={`font-black text-2xl text-slate-900 leading-tight mb-3 transition-colors duration-300 ${service.hoverText}`}>{service.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-base font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                          Rp {service.price.toLocaleString('id-ID')}
                        </p>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-slate-50 text-slate-400 border border-slate-100 group-hover:text-white ${service.hoverBg}`}>
                          <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Pilih Kapster */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tighter">Pilih Kapster</h2>
                <p className="text-slate-500 text-lg font-medium">Pilih profesional yang akan menangani gaya Anda.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {kapsters.map((kapster, idx) => (
                  <button 
                    key={kapster.id}
                    onClick={() => handleKapsterSelect(kapster)}
                    className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] text-center hover:border-blue-200 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] transition-all duration-300 group focus:outline-none active:scale-[0.98] hover:-translate-y-2 relative overflow-hidden"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 transition-colors duration-500 pointer-events-none"></div>
                    
                    <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-slate-50 group-hover:border-blue-100 transition-all duration-500 shadow-sm relative z-10">
                      <img src={kapster.img} alt={kapster.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mb-3 group-hover:text-blue-700 transition-colors relative z-10">{kapster.name}</h3>
                    
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <span className="flex items-center justify-center gap-1.5 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-lg border border-amber-100 text-[10px] font-black uppercase tracking-widest w-full">
                        <FaStar className="text-amber-400 text-sm" /> {kapster.rating}
                      </span>
                      <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold uppercase tracking-widest w-full">
                        Pengalaman: {kapster.exp}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Pilih Kalender & Waktu (LEBAR PENUH) */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tighter">Tentukan Jadwal</h2>
                  <p className="text-slate-500 text-lg font-medium">Pilih tanggal dari kalender dan slot waktu yang tersedia.</p>
                </div>
                <div className="hidden md:block">
                  <button 
                    onClick={nextStep}
                    disabled={!bookingData.date || !bookingData.time}
                    className="bg-slate-900 text-white font-bold py-4 px-10 rounded-full hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:scale-95 w-full sm:w-auto text-sm group"
                  >
                    Lanjut ke Konfirmasi <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Box Putih Lebar Penuh */}
              <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[3rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] mb-10 w-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
                  {/* Kolom Kiri: Pilih Tanggal */}
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-black border border-blue-100">1</div>
                      <h3 className="text-base font-black text-slate-800 uppercase tracking-widest">Pilih Tanggal</h3>
                    </div>
                    
                    <div className="relative group ml-0 md:ml-14">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <FaCalendarCheck className="text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl" />
                      </div>
                      <input 
                        type="date" 
                        min={getTodayDate()} 
                        value={bookingData.date}
                        onChange={handleDateChange}
                        className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl pl-16 pr-6 py-5 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-lg cursor-pointer hover:border-slate-300 shadow-sm"
                      />
                    </div>
                    
                    {bookingData.date && (
                      <div className="mt-4 ml-0 md:ml-14 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in zoom-in duration-300 flex items-start gap-3">
                        <FaCheckCircle className="text-emerald-500 text-xl mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Tanggal Dipilih</p>
                          <p className="text-sm font-black text-emerald-800 mt-0.5">{formatDateToIndonesian(bookingData.date)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Garis Pemisah Desktop */}
                  <div className="hidden lg:block lg:col-span-1 border-r-2 border-dashed border-slate-100 w-1"></div>

                  {/* Kolom Kanan: Pilih Waktu */}
                  <div className="lg:col-span-6">
                    <div className={`transition-all duration-700 ${bookingData.date ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-black border border-purple-100">2</div>
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-widest">Pilih Slot Waktu</h3>
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 ml-0 md:ml-14">
                        {availableTimes.map((time, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setBookingData({ ...bookingData, time: time })}
                            className={`py-4 rounded-2xl border-2 font-black text-base transition-all duration-300 ${
                              bookingData.time === time 
                                ? 'border-slate-900 bg-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] transform -translate-y-1 scale-105' 
                                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5 hover:shadow-sm'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Lanjut Mobile */}
              <div className="flex justify-end w-full md:hidden">
                <button 
                  onClick={nextStep}
                  disabled={!bookingData.date || !bookingData.time}
                  className="bg-slate-900 text-white font-bold py-5 px-12 rounded-full hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-3 shadow-lg w-full text-sm group"
                >
                  Lanjut ke Konfirmasi <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Konfirmasi Akhir (DIPISAH MENJADI DUA KOLOM LEBAR) */}
          {step === 4 && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter">Konfirmasi Booking</h2>
                <p className="text-slate-500 text-lg font-medium">Mohon periksa kembali detail pesanan Anda sebelum mengonfirmasi.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
                
                {/* Bagian Detail Reservasi */}
                <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8 md:p-12 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="flex items-center gap-6 pb-8 border-b border-slate-100 relative z-10">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-blue-100"><FaCut /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Layanan Pilihan</p>
                      <p className="font-black text-slate-900 text-2xl">{bookingData.service}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 pb-8 border-b border-slate-100 relative z-10">
                    <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-amber-100"><FaUserTie /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kapster Profesional</p>
                      <p className="font-black text-slate-900 text-2xl">{bookingData.kapster}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-emerald-100"><FaCalendarCheck /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jadwal Perawatan</p>
                      <p className="font-black text-slate-900 text-xl">
                        {formatDateToIndonesian(bookingData.date)} <span className="text-slate-300 mx-2">•</span> <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200">{bookingData.time} WIB</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bagian Total Harga & Tombol Aksi */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex-grow flex flex-col justify-center relative overflow-hidden shadow-xl">
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 relative z-10">Total Pembayaran</p>
                    <p className="text-5xl md:text-6xl font-black tracking-tighter mb-8 relative z-10">Rp {bookingData.price.toLocaleString('id-ID')}</p>
                    
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-3 rounded-xl w-fit relative z-10">
                      <FaCheckCircle className="text-emerald-400 text-lg" /> 
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">Bayar Langsung di Kasir</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-6 px-10 rounded-[2rem] hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-300 disabled:to-slate-300 transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.35)] hover:-translate-y-1 active:scale-95 text-base"
                  >
                    {isSubmitting ? (
                      <><FaSpinner className="animate-spin text-xl" /> Memproses Data...</>
                    ) : (
                      <><FaCheckCircle className="text-xl" /> Konfirmasi & Selesaikan Booking</>
                    )}
                  </button>

                  <button onClick={prevStep} className="w-full font-bold text-slate-500 hover:text-slate-900 transition-colors py-4 text-sm flex items-center justify-center gap-2 group">
                    <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" /> Kembali untuk Ubah Jadwal
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}