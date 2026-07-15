import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    price: 0,
    email: (() => {
      let e = localStorage.getItem('userEmail');
      const uStr = localStorage.getItem('user');
      if (uStr && !e) {
        try { e = JSON.parse(uStr).email; } catch (err) {}
      }
      return e || '';
    })()
  });

  const [services, setServices] = useState([]);
  const [kapsters, setKapsters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const [promoCodeInput, setPromoCodeInput] = useState(location.state?.promoCode || '');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isPromoLoading, setIsPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);

  // Auto apply promo if passed from LandingPage
  useEffect(() => {
    if (location.state?.promoCode && step === 4 && !appliedPromo) {
      handleApplyPromo(location.state.promoCode);
    }
  }, [location.state?.promoCode, step]);

  // Handle pre-selected service from LandingPage
  useEffect(() => {
    if (location.state?.preSelectedService && step === 1) {
      const preSelected = location.state.preSelectedService;
      const priceValue = parseInt(preSelected.price.replace(/[^\d]/g, '')) || 0;
      setBookingData(prev => ({
        ...prev,
        service: preSelected.title,
        price: priceValue
      }));
      setStep(2); // Skip straight to Kapster selection
    }
  }, [location.state?.preSelectedService, step]);

  // Handle pre-selected kapster from LandingPage
  useEffect(() => {
    if (location.state?.preSelectedKapster && !bookingData.kapster) {
      const preSelected = location.state.preSelectedKapster;
      setBookingData(prev => ({
        ...prev,
        kapster: preSelected.name
      }));
    }
  }, [location.state?.preSelectedKapster]);

  // PROTEKSI ROUTE & FETCH DATA
  useEffect(() => {
    let userEmail = localStorage.getItem('userEmail');
    const userStr = localStorage.getItem('user');
    if (userStr && !userEmail) {
      try { userEmail = JSON.parse(userStr).email; } catch (err) {}
    }

    if (!userEmail) {
      navigate('/login', { state: { from: '/booking' } });
      return;
    }

    const fetchData = async () => {
      try {
        const { data: userExists } = await supabase.from('users').select('id').eq('email', userEmail).single();
        if (!userExists) {
          localStorage.removeItem('userEmail');
          alert("Email tidak terdata. Silakan login atau register kembali.");
          navigate('/register');
          return;
        }
      } catch (err) {
        localStorage.removeItem('userEmail');
        alert("Email tidak terdata. Silakan login atau register kembali.");
        navigate('/register');
        return;
      }

      setIsLoading(true);
      const [servicesRes, kapstersRes] = await Promise.all([
        supabase.from('services').select('*'),
        supabase.from('kapsters').select('*')
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (kapstersRes.data) setKapsters(kapstersRes.data);
      setIsLoading(false);
    };

    fetchData();
  }, [navigate]);

  // Fetch booked times for selected kapster and date
  // KOMENTAR DEMO: Mengambil jadwal/waktu yang sudah di-booking orang lain pada tanggal dan kapster yang dipilih, agar slot waktunya tidak bisa dipilih lagi.
  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (step === 3 && bookingData.date && bookingData.kapster) {
        try {
          const { data, error } = await supabase
            .from('haircut_bookings')
            .select('waktu, status')
            .eq('tanggal', bookingData.date)
            .eq('kapster', bookingData.kapster);
            
          if (!error && data) {
            const activeBookings = data.filter(b => b.status && !b.status.toLowerCase().includes('batal') && !b.status.toLowerCase().includes('cancel'));
            setBookedTimes(activeBookings.map(b => b.waktu));
          }
        } catch (err) {
          console.error("Error fetching booked times", err);
        }
      }
    };
    fetchBookedTimes();
  }, [bookingData.date, bookingData.kapster, step]);

  const serviceStyles = [
    { icon: FaCut, bg: 'bg-blue-50', text: 'text-blue-500', hoverBg: 'group-hover:bg-blue-500', hoverText: 'group-hover:text-blue-700', borderHover: 'hover:border-blue-200', lightHover: 'group-hover:bg-blue-50/50', shadow: 'hover:shadow-blue-500/20' },
    { icon: FaUserTie, bg: 'bg-amber-50', text: 'text-amber-500', hoverBg: 'group-hover:bg-amber-500', hoverText: 'group-hover:text-amber-700', borderHover: 'hover:border-amber-200', lightHover: 'group-hover:bg-amber-50/50', shadow: 'hover:shadow-amber-500/20' },
    { icon: FaMagic, bg: 'bg-purple-50', text: 'text-purple-500', hoverBg: 'group-hover:bg-purple-500', hoverText: 'group-hover:text-purple-700', borderHover: 'hover:border-purple-200', lightHover: 'group-hover:bg-purple-50/50', shadow: 'hover:shadow-purple-500/20' },
    { icon: FaCut, bg: 'bg-emerald-50', text: 'text-emerald-500', hoverBg: 'group-hover:bg-emerald-500', hoverText: 'group-hover:text-emerald-700', borderHover: 'hover:border-emerald-200', lightHover: 'group-hover:bg-emerald-50/50', shadow: 'hover:shadow-emerald-500/20' },
    { icon: FaCut, bg: 'bg-rose-50', text: 'text-rose-500', hoverBg: 'group-hover:bg-rose-500', hoverText: 'group-hover:text-rose-700', borderHover: 'hover:border-rose-200', lightHover: 'group-hover:bg-rose-50/50', shadow: 'hover:shadow-rose-500/20' },
    { icon: FaSpa, bg: 'bg-indigo-50', text: 'text-indigo-500', hoverBg: 'group-hover:bg-indigo-500', hoverText: 'group-hover:text-indigo-700', borderHover: 'hover:border-indigo-200', lightHover: 'group-hover:bg-indigo-50/50', shadow: 'hover:shadow-indigo-500/20' },
    { icon: FaLeaf, bg: 'bg-teal-50', text: 'text-teal-500', hoverBg: 'group-hover:bg-teal-500', hoverText: 'group-hover:text-teal-700', borderHover: 'hover:border-teal-200', lightHover: 'group-hover:bg-teal-50/50', shadow: 'hover:shadow-teal-500/20' },
    { icon: FaWater, bg: 'bg-cyan-50', text: 'text-cyan-500', hoverBg: 'group-hover:bg-cyan-500', hoverText: 'group-hover:text-cyan-700', borderHover: 'hover:border-cyan-200', lightHover: 'group-hover:bg-cyan-50/50', shadow: 'hover:shadow-cyan-500/20' },
    { icon: FaSpa, bg: 'bg-fuchsia-50', text: 'text-fuchsia-500', hoverBg: 'group-hover:bg-fuchsia-500', hoverText: 'group-hover:text-fuchsia-700', borderHover: 'hover:border-fuchsia-200', lightHover: 'group-hover:bg-fuchsia-50/50', shadow: 'hover:shadow-fuchsia-500/20' }
  ];

  const availableTimes = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const formatDateToIndonesian = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleNextFromStep3 = async () => {
    if (!bookingData.email) {
      alert("Masukkan email Anda terlebih dahulu.");
      return;
    }
    
    // Validasi email di database sebelum pindah ke step 4
    try {
      const emailInput = bookingData.email.toLowerCase().trim();
      const { data: userExists } = await supabase.from('users').select('id').eq('email', emailInput).single();
      
      if (!userExists) {
        alert("Email tidak terdata");
        navigate('/register');
        return;
      }
      
      nextStep();
    } catch (error) {
      alert("Email tidak terdata");
      navigate('/register');
    }
  };

  const handleBack = () => {
    if (step === 3 && location.state?.preSelectedKapster) {
      setStep(1); // Go back to service selection if kapster is pre-selected
    } else if (step > 1) {
      prevStep();
    } else {
      navigate('/member-dashboard'); 
    }
  };

  const [dateError, setDateError] = useState('');

  const handleServiceSelect = (service) => {
    setBookingData({ ...bookingData, service: service.name, price: service.price });
    
    // Jika kapster sudah terisi dari awal (via LandingPage), langsung lompat ke step 3
    if (bookingData.kapster || location.state?.preSelectedKapster) {
      setStep(3);
    } else {
      nextStep();
    }
  };

  const handleKapsterSelect = (kapster) => {
    setBookingData({ ...bookingData, kapster: kapster.name });
    setDateError(''); // Reset date error if changing kapster
    nextStep();
  };

  const parseAvailableDays = (shiftDaysStr) => {
    if (!shiftDaysStr) return [0,1,2,3,4,5,6];
    
    const daysMap = { 'senin': 1, 'selasa': 2, 'rabu': 3, 'kamis': 4, 'jumat': 5, 'sabtu': 6, 'minggu': 0 };
    let str = shiftDaysStr.toLowerCase().trim();
    if (str === 'setiap hari' || str === 'all days' || str === 'tiap hari') return [0,1,2,3,4,5,6];
    
    if (str.includes('-')) {
        let parts = str.split('-');
        if (parts.length === 2) {
            let start = parts[0].trim();
            let end = parts[1].trim();
            if (daysMap[start] !== undefined && daysMap[end] !== undefined) {
                let startIdx = daysMap[start];
                let endIdx = daysMap[end];
                let available = [];
                let current = startIdx;
                available.push(current);
                while (current !== endIdx) {
                    current = (current + 1) % 7;
                    available.push(current);
                }
                return available;
            }
        }
    }
    
    if (str.includes(',')) {
        let parts = str.split(',').map(s => s.trim());
        let available = [];
        parts.forEach(p => { if (daysMap[p] !== undefined) available.push(daysMap[p]); });
        if (available.length > 0) return available;
    }
    
    if (daysMap[str] !== undefined) return [daysMap[str]];
    return [0,1,2,3,4,5,6];
  };

  const handleDateChange = (e) => {
    setDateError('');
    const selectedDateStr = e.target.value;
    if (!selectedDateStr) {
      setBookingData({ ...bookingData, date: '', time: null });
      return;
    }

    const selectedKapsterObj = kapsters.find(k => k.name === bookingData.kapster);
    if (selectedKapsterObj && selectedKapsterObj.shift_days) {
      const allowedDays = parseAvailableDays(selectedKapsterObj.shift_days);
      const selectedDate = new Date(selectedDateStr);
      const selectedDayOfWeek = selectedDate.getDay(); 

      if (!allowedDays.includes(selectedDayOfWeek)) {
        setDateError(`Maaf, ${bookingData.kapster} tidak bertugas pada hari tersebut. Jadwal shift: ${selectedKapsterObj.shift_days}`);
        setBookingData({ ...bookingData, date: '', time: null });
        return;
      }
    }
    
    setBookingData({ ...bookingData, date: selectedDateStr, time: null });
  };

  // KOMENTAR DEMO: Mengecek ke database apakah kode promo yang dimasukkan valid/aktif. Jika ya, hitung potongan harga dan simpan statenya.
  const handleApplyPromo = async (codeToApply = promoCodeInput) => {
    if (!codeToApply) return;
    setIsPromoLoading(true);
    setPromoError('');
    
    try {
      const { data, error } = await supabase
        .from('promos')
        .select('*')
        .eq('code', codeToApply.toUpperCase())
        .single();
        
      if (error || !data) {
        throw new Error('Kode promo tidak ditemukan.');
      }
      if (data.status !== 'Aktif' && data.status !== 'Active') {
        throw new Error('Kode promo sudah tidak aktif.');
      }
      
      let discountAmount = 0;
      if (data.discount.includes('%')) {
        const percentage = parseInt(data.discount.replace('%', ''));
        discountAmount = (bookingData.price * percentage) / 100;
      } else if (data.discount.toLowerCase().includes('rp')) {
        const amountStr = data.discount.replace(/[^\d]/g, '');
        discountAmount = parseInt(amountStr);
      }
      
      setAppliedPromo({
        ...data,
        discountAmount: discountAmount
      });
    } catch (err) {
      setPromoError(err.message);
      setAppliedPromo(null);
    } finally {
      setIsPromoLoading(false);
    }
  };

  // KOMENTAR DEMO: Proses Submit Booking. Menyimpan data pemesanan ke tabel 'haircut_bookings' beserta harga akhir (setelah dipotong promo jika ada).
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const finalHarga = appliedPromo ? Math.max(0, bookingData.price - appliedPromo.discountAmount) : bookingData.price;
    
    try {
      const { error } = await supabase
        .from('haircut_bookings')
        .insert([{
          email: bookingData.email,
          layanan: bookingData.service,
          kapster: bookingData.kapster,
          tanggal: bookingData.date,
          waktu: bookingData.time,
          harga: finalHarga.toString(),
          status: 'Menunggu Konfirmasi'
        }]);

      if (error) throw error;
      
      // Update promo if applied
      if (appliedPromo) {
        await supabase.from('promos').update({ status: 'Terpakai' }).eq('code', appliedPromo.code);
      }
      
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
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Langkah {step} dari 4</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-slate-900 shadow-sm' : 'w-2 bg-slate-200'}`}></div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/')} 
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md"
            >
              <span>Beranda</span>
            </button>
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
                {isLoading ? (
                  <div className="col-span-full text-center py-10 font-bold text-slate-500">Loading...</div>
                ) : services.map((service, idx) => {
                  const style = serviceStyles[idx % serviceStyles.length];
                  return (
                    <button 
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className={`bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] text-left transition-all duration-300 group focus:outline-none flex flex-col justify-between aspect-square md:aspect-auto md:min-h-[280px] relative overflow-hidden active:scale-[0.98] hover:-translate-y-2 ${style.borderHover} shadow-sm ${style.shadow}`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className={`absolute inset-0 opacity-0 transition-colors duration-500 z-0 ${style.lightHover}`}></div>
                      
                      <div className="flex justify-between items-start w-full relative z-10">
                        <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl transition-all duration-500 shadow-sm border border-white group-hover:scale-110 group-hover:-rotate-12 group-hover:text-white ${style.bg} ${style.text} ${style.hoverBg}`}>
                          <style.icon />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-white transition-colors">{service.duration || '30 Min'}</span>
                      </div>
                      
                      <div className="w-full relative z-10 mt-auto pt-6">
                        <h3 className={`font-black text-2xl text-slate-900 leading-tight mb-3 transition-colors duration-300 ${style.hoverText}`}>{service.name}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-base font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                            Rp {service.price?.toLocaleString('id-ID')}
                          </p>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-slate-50 text-slate-400 border border-slate-100 group-hover:text-white ${style.hoverBg}`}>
                            <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
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
                {isLoading ? (
                  <div className="col-span-full text-center py-10 font-bold text-slate-500">Loading...</div>
                ) : kapsters.map((kapster, idx) => (
                  <button 
                    key={kapster.id}
                    onClick={() => handleKapsterSelect(kapster)}
                    className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] text-center hover:border-blue-200 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] transition-all duration-300 group focus:outline-none active:scale-[0.98] hover:-translate-y-2 relative overflow-hidden"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 transition-colors duration-500 pointer-events-none"></div>
                    
                    <div className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-slate-50 group-hover:border-blue-100 transition-all duration-500 shadow-sm relative z-10">
                      <img src={kapster.img_url || 'https://i.pravatar.cc/150'} alt={kapster.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mb-3 group-hover:text-blue-700 transition-colors relative z-10">{kapster.name}</h3>
                    
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <span className="flex items-center justify-center gap-1.5 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-lg border border-amber-100 text-[10px] font-black uppercase tracking-widest w-full">
                        <FaStar className="text-amber-400 text-sm" /> 4.8
                      </span>
                      <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold uppercase tracking-widest w-full">
                        Pengalaman: {kapster.experience || '3 Tahun'}
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
                    onClick={handleNextFromStep3}
                    disabled={!bookingData.date || !bookingData.time || !bookingData.email}
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
                      {(() => {
                        const selectedKapsterObj = kapsters.find(k => k.name === bookingData.kapster);
                        return (
                          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest pl-2">
                            Jadwal Shift: {selectedKapsterObj?.shift_days || 'Setiap Hari'}
                          </p>
                        );
                      })()}
                    </div>
                    
                    {dateError && (
                      <div className="mt-4 ml-0 md:ml-14 p-4 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in zoom-in duration-300 flex items-start gap-3">
                        <div className="text-red-500 mt-0.5 font-bold">!</div>
                        <div>
                          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Jadwal Tidak Tersedia</p>
                          <p className="text-sm font-bold text-red-800 mt-0.5">{dateError}</p>
                        </div>
                      </div>
                    )}
                    
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
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 ml-0 md:ml-14 mb-8">
                        {availableTimes.map((time, idx) => {
                          const isBooked = bookedTimes.includes(time);
                          let isPastTime = false;
                          
                          if (bookingData.date === getTodayDate()) {
                            const now = new Date();
                            const currentHour = now.getHours();
                            const currentMinute = now.getMinutes();
                            
                            const [timeHour, timeMinute] = time.split(':').map(Number);
                            
                            if (timeHour < currentHour || (timeHour === currentHour && timeMinute < currentMinute)) {
                              isPastTime = true;
                            }
                          }

                          let isOutsideShift = false;
                          const selectedKapsterObj = kapsters.find(k => k.name === bookingData.kapster);
                          if (selectedKapsterObj && selectedKapsterObj.shift_hours) {
                              const shiftParts = selectedKapsterObj.shift_hours.split('-');
                              if (shiftParts.length === 2) {
                                  const startShift = shiftParts[0].trim().replace(/wib/i, '').trim();
                                  const endShift = shiftParts[1].trim().replace(/wib/i, '').trim();
                                  const [shiftStartHour] = startShift.split(':').map(Number);
                                  const [shiftEndHour] = endShift.split(':').map(Number);
                                  const [timeHour] = time.split(':').map(Number);
                                  
                                  if (timeHour < shiftStartHour || timeHour > shiftEndHour) {
                                      isOutsideShift = true;
                                  }
                              }
                          }
                          
                          const isDisabled = isBooked || isPastTime || isOutsideShift;

                          
                          return (
                            <button 
                              key={idx}
                              disabled={isDisabled}
                              onClick={() => setBookingData({ ...bookingData, time: time })}
                              className={`py-4 rounded-2xl border-2 font-black text-base transition-all duration-300 ${
                                isDisabled ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through' :
                                bookingData.time === time 
                                  ? 'border-slate-900 bg-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] transform -translate-y-1 scale-105' 
                                  : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5 hover:shadow-sm'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg font-black border border-orange-100">3</div>
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-widest">Konfirmasi Email</h3>
                      </div>
                      
                      <div className="ml-0 md:ml-14">
                        <input 
                          type="email" 
                          required 
                          value={bookingData.email}
                          onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                          className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm rounded-2xl px-6 py-4 focus:outline-none focus:border-orange-400 focus:bg-white transition-all font-semibold" 
                          placeholder="Masukkan email Anda"
                        />
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Email ini akan diverifikasi saat Anda melanjutkan ke Konfirmasi.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Lanjut Mobile */}
              <div className="flex justify-end w-full md:hidden">
                <button 
                  onClick={handleNextFromStep3}
                  disabled={!bookingData.date || !bookingData.time || !bookingData.email}
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
                  {/* Input Promo Code */}
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Punya Kode Voucher?</p>
                    <div className="flex gap-3">
                      <input 
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                        placeholder="Masukkan kode promo"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 uppercase"
                      />
                      <button 
                        onClick={() => handleApplyPromo()}
                        disabled={isPromoLoading || !promoCodeInput}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black disabled:bg-slate-300 transition-colors"
                      >
                        {isPromoLoading ? 'Cek...' : 'Terapkan'}
                      </button>
                    </div>
                    {promoError && <p className="text-red-500 text-xs font-bold mt-2">{promoError}</p>}
                    {appliedPromo && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                        <FaCheckCircle className="text-emerald-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-emerald-800">Promo Berhasil Digunakan!</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Diskon: {appliedPromo.discount} ({appliedPromo.title})</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex-grow flex flex-col justify-center relative overflow-hidden shadow-xl">
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    
                    {appliedPromo ? (
                      <>
                        <div className="flex justify-between items-center mb-2 relative z-10">
                          <span className="text-sm text-slate-400">Subtotal</span>
                          <span className="text-sm text-slate-300 line-through">Rp {bookingData.price.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 relative z-10">
                          <span className="text-sm text-emerald-400">Diskon Promo</span>
                          <span className="text-sm font-bold text-emerald-400">- Rp {appliedPromo.discountAmount.toLocaleString('id-ID')}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Total Pembayaran</p>
                        <p className="text-5xl md:text-6xl font-black tracking-tighter mb-8 relative z-10">
                          Rp {Math.max(0, bookingData.price - appliedPromo.discountAmount).toLocaleString('id-ID')}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 relative z-10">Total Pembayaran</p>
                        <p className="text-5xl md:text-6xl font-black tracking-tighter mb-8 relative z-10">Rp {bookingData.price.toLocaleString('id-ID')}</p>
                      </>
                    )}
                    
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