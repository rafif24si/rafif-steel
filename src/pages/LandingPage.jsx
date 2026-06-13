import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCut, FaUserTie, FaRegCalendarCheck, FaStar, 
  FaQuoteLeft, FaTicketAlt, FaShoppingBag, FaCheckCircle,
  FaArrowRight, FaPlay, FaInstagram, FaTwitter, FaYoutube
} from 'react-icons/fa';

// --- KOMPONEN ANIMASI SCROLL (DITINGKATKAN) ---
const FadeInSection = ({ children, delay = 0, className = "", direction = "up" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.disconnect();
    };
  }, []);

  const getTransform = () => {
    switch(direction) {
      case 'left': return 'translate-x-16';
      case 'right': return '-translate-x-16';
      case 'down': return '-translate-y-16';
      default: return 'translate-y-16';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 translate-x-0 scale-100' 
          : `opacity-0 ${getTransform()} scale-[0.97]`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- KOMPONEN TILT CARD ---
const TiltCard = ({ children, className = "" }) => {
  const cardRef = useRef();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      {children}
    </div>
  );
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans scroll-smooth selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* ============ NAVBAR ============ */}
      <div className={`fixed w-full z-50 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'top-4 md:top-6 px-4 md:px-8' : 'top-0 px-0'}`}>
        <nav className={`mx-auto flex items-center justify-between transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
            ? 'max-w-5xl bg-white/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/50 rounded-full px-8 py-4' 
            : 'w-full bg-gradient-to-b from-[#0A0F1A]/80 to-transparent border-b border-transparent px-6 md:px-12 py-6'
        }`}>
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? 'bg-gradient-to-br from-[#101623] to-slate-800 shadow-slate-400/20' : 'bg-white/10 backdrop-blur-md border border-white/20'
            }`}>
              <FaCut className={`text-lg group-hover:-rotate-12 transition-transform duration-500 ${isScrolled ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`text-2xl font-black tracking-tight flex items-baseline transition-colors duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'text-[#101623]' : 'text-white'}`}>
              Hair<span className={isScrolled ? 'text-blue-600' : 'text-blue-400'}>Cut.</span>
            </span>
          </Link>
          
          {/* MENU DESKTOP */}
          <div className={`hidden md:flex items-center gap-10 text-[13px] font-bold tracking-widest uppercase transition-colors duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
            {[
              { href: "#about", label: "Tentang" },
              { href: "#services", label: "Layanan" },
              { href: "#products", label: "Produk" },
              { href: "#vouchers", label: "Promo" }
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="relative py-2 group"
              >
                <span className={`transition-colors duration-300 ${isScrolled ? 'group-hover:text-blue-600' : 'group-hover:text-white'}`}>
                  {item.label}
                </span>
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${isScrolled ? 'bg-blue-600' : 'bg-blue-400'}`} />
              </a>
            ))}
          </div>

          {/* BUTTON LOGIN */}
          <div>
            <Link 
              to="/login" 
              className={`relative overflow-hidden group px-8 py-3.5 text-sm font-bold rounded-full transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-lg hover:-translate-y-0.5 inline-block ${
                isScrolled 
                  ? 'bg-[#101623] text-white hover:bg-blue-600 hover:shadow-blue-600/30' 
                  : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-[#101623] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                Login Admin
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isScrolled ? 'from-blue-600 to-indigo-600' : 'from-white/0 to-white/10'}`} />
            </Link>
          </div>
        </nav>
      </div>

      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 overflow-hidden bg-[#0A0F1A] flex items-center justify-center min-h-[95vh]">
        {/* Background dengan efek grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(30deg, #fff 1px, transparent 1px),
                            linear-gradient(-30deg, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.12] mix-blend-luminosity"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-[#0A0F1A]/40 to-transparent" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto mt-10">
          <FadeInSection delay={0}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-xl text-blue-300 text-xs font-bold tracking-[0.2em] uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Redefining Men's Excellence
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.1] mb-8 tracking-tighter drop-shadow-2xl">
              Elevate Your <br className="hidden md:block" />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
                  Signature Style.
                </span>
                {/* Decorative underline */}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4 Q50 0, 100 4 Q150 8, 200 4" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </FadeInSection>

          <FadeInSection delay={400}>
            <p className="text-lg md:text-xl text-slate-300 mb-12 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Sebuah mahakarya dalam setiap potongan. HairCut memadukan teknik klasik dan inovasi modern untuk menghadirkan pengalaman  yang tak tertandingi.
            </p>
          </FadeInSection>

          <FadeInSection delay={600}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                to="/register" 
                className="group px-10 py-4 w-full sm:w-auto text-center font-bold text-white bg-blue-600 rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:-translate-y-1 hover:bg-blue-500"
              >
                <span className="flex items-center gap-3">
                  Booking Jadwal
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
              <a 
                href="#about" 
                className="group px-10 py-4 w-full sm:w-auto text-center font-bold text-white bg-white/5 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/15 transition-all duration-500 hover:-translate-y-1"
              >
                <span className="flex items-center gap-3">
                  <FaPlay className="text-blue-400 text-xs" />
                  Kenali Kami
                </span>
              </a>
            </div>
          </FadeInSection>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2 animate-bounce">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ TENTANG PERUSAHAAN ============ */}
      <section id="about" className="py-32 px-6 md:px-12 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #3B82F6 1px, transparent 1px), radial-gradient(circle at 75% 75%, #3B82F6 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="w-full lg:w-1/2 relative group">
            <FadeInSection delay={0}>
              <TiltCard>
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/60 aspect-[4/5] md:aspect-[16/10] lg:aspect-square">
                  <img 
                    src="public/img/bb2.jpg" 
                    alt="HairCut Barbershop Interior" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </TiltCard>
            </FadeInSection>
            
            <FadeInSection delay={300} className="absolute -bottom-8 -right-4 md:-right-8">
              <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
                    <FaStar className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-xl">Est. 2024</h4>
                    <p className="text-sm font-medium text-slate-500">Premium Quality</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>

          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <FadeInSection delay={100} direction="right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-full text-xs tracking-widest uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Tentang HairCut
              </div>
            </FadeInSection>

            <FadeInSection delay={200} direction="right">
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-8 leading-tight">
                Cerita Di Balik <br/>
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Keahlian Kami.
                  </span>
                </span>
              </h2>
            </FadeInSection>

            <FadeInSection delay={300} direction="right">
              <p className="text-slate-500 text-lg leading-relaxed mb-6 font-medium">
                Berdiri sejak tahun 2024, HairCut lahir dari visi sederhana: menciptakan ruang eksklusif di mana para pria bisa bersantai, menikmati pelayanan kelas satu, dan keluar dengan versi terbaik dari diri mereka.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Teknik cukur klasik dipadukan gaya modern",
                  "Peralatan steril, higienis, dan premium",
                  <span key="3"><span className="italic">Kapster</span> berpengalaman & bersertifikasi</span>,
                  "Suasana ruangan yang nyaman dan maskulin"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-slate-700 font-semibold group hover:translate-x-2 transition-transform duration-300">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                      <FaCheckCircle className="text-emerald-500 group-hover:text-white transition-colors duration-300 text-sm" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ============ LAYANAN ============ */}
      <section id="services" className="py-32 px-6 md:px-12 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <FadeInSection delay={0}>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                Layanan <span className="text-blue-600">Signature</span> Kami
              </h2>
              <p className="text-slate-500 mt-5 text-lg font-medium">
                Pengalaman grooming total dari ujung rambut hingga wajah.
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaCut className="text-3xl" />,
                title: "Hot Towel Shave",
                desc: "Cukur kumis/jenggot tradisional dengan handuk hangat, krim cukur khusus, dan aftershave menyegarkan.",
                price: "Rp 50k",
                color: "blue",
                bgHover: "from-blue-50 to-blue-100",
                iconColor: "text-blue-600",
                iconBg: "bg-blue-50/80",
                iconBgHover: "group-hover:bg-blue-600",
                iconTextHover: "group-hover:text-white"
              },
              {
                icon: <FaUserTie className="text-3xl" />,
                title: "Gentleman Haircut",
                desc: "Konsultasi gaya, cuci rambut, potong presisi, pijat ringan, dan styling menggunakan pomade premium kami.",
                price: "Rp 75k",
                color: "emerald",
                bgHover: "from-emerald-50 to-teal-50",
                iconColor: "text-emerald-400",
                iconBg: "bg-white/5",
                iconBgHover: "group-hover:bg-emerald-500",
                iconTextHover: "group-hover:text-white",
                featured: true
              },
              {
                icon: <FaRegCalendarCheck className="text-3xl" />,
                title: "Hair Coloring",
                desc: "Pewarnaan rambut profesional untuk menutupi uban atau tampil beda dengan tren warna terkini.",
                price: "Rp 150k",
                color: "amber",
                bgHover: "from-amber-50 to-yellow-50",
                iconColor: "text-amber-500",
                iconBg: "bg-amber-50/80",
                iconBgHover: "group-hover:bg-amber-500",
                iconTextHover: "group-hover:text-white"
              }
            ].map((service, idx) => (
              <FadeInSection delay={idx * 200} key={idx}>
                <TiltCard>
                  <div className={`relative p-10 rounded-[2.5rem] transition-all duration-500 group cursor-pointer h-full ${
                    service.featured 
                      ? 'bg-gradient-to-b from-[#101623] to-[#1a2333] shadow-[0_20px_50px_-15px_rgba(16,22,35,0.4)] border border-slate-700' 
                      : 'bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.15)] border border-slate-100'
                  }`}>
                    {service.featured && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-black px-6 py-2 rounded-bl-2xl shadow-lg">
                        POPULER
                      </div>
                    )}
                    
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 backdrop-blur-sm ${
                      service.featured ? `${service.iconBg} border border-white/10` : service.iconBg
                    } ${service.iconBgHover}`}>
                      <span className={`${service.iconColor} ${service.iconTextHover} transition-colors duration-500`}>
                        {service.icon}
                      </span>
                    </div>
                    
                    <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                      service.featured ? 'text-white group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-blue-600'
                    }`}>
                      {service.title}
                    </h3>
                    
                    <p className={`leading-relaxed mb-8 font-medium ${
                      service.featured ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {service.desc}
                    </p>
                    
                    <div className={`pt-6 border-t mt-auto ${
                      service.featured ? 'border-slate-700/50' : 'border-slate-100'
                    }`}>
                      <span className={`font-black text-3xl ${
                        service.featured ? 'text-emerald-400' : 'text-slate-800'
                      }`}>
                        {service.price}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VOUCHER/PROMO ============ */}
      <section id="vouchers" className="py-28 px-6 md:px-12 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                            radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          <div className="w-full lg:w-1/2 text-white">
            <FadeInSection delay={0} direction="left">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
                <FaTicketAlt className="text-yellow-400" /> Promo Eksklusif
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
                Klaim Voucher <br/>Spesial Anda!
              </h2>
              <p className="text-blue-100 text-xl mb-10 leading-relaxed font-medium max-w-lg">
                Daftar sebagai member di aplikasi HairCut sekarang dan nikmati potongan harga untuk kunjungan pertama serta diskon pembelian produk.
              </p>
              <Link 
                to="/register" 
                className="group px-8 py-4 font-bold text-blue-700 bg-white rounded-full hover:bg-slate-50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 inline-flex items-center gap-3"
              >
                Daftar & Klaim Sekarang
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </FadeInSection>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {[
              {
                discount: "Diskon 20%",
                title: "Haircut",
                desc: "*Berlaku untuk transaksi pertama",
                category: "New Member",
                color: "yellow",
                icon: <FaTicketAlt className="text-6xl" />,
                borderColor: "border-yellow-400",
                dotColor: "bg-yellow-400",
                iconColor: "text-yellow-100",
                iconHoverColor: "group-hover:text-yellow-400",
                iconRotation: "group-hover:rotate-12"
              },
              {
                discount: "Potongan 15k",
                title: "Pomade",
                desc: "*Berlaku semua varian",
                category: "Product Promo",
                color: "emerald",
                icon: <FaShoppingBag className="text-6xl" />,
                borderColor: "border-emerald-400",
                dotColor: "bg-emerald-400",
                iconColor: "text-emerald-100",
                iconHoverColor: "group-hover:text-emerald-400",
                iconRotation: "group-hover:-rotate-12"
              }
            ].map((promo, idx) => (
              <FadeInSection delay={idx * 200} direction="right" key={idx}>
                <TiltCard>
                  <div className={`bg-white rounded-3xl p-8 flex items-center justify-between border-l-[16px] ${promo.borderColor} shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-pointer`}>
                    {/* Decorative dots */}
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full shadow-inner" />
                    <div className={`absolute -left-[20px] top-1/2 -translate-y-1/2 w-4 h-4 ${promo.dotColor} rounded-full`} />
                    
                    <div className="pr-8">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        {promo.category}
                      </p>
                      <h4 className="text-3xl font-black text-slate-800 mb-2 leading-tight">
                        {promo.discount} <br/>{promo.title}
                      </h4>
                      <p className="text-slate-500 text-sm font-medium">{promo.desc}</p>
                    </div>
                    
                    <div className="h-24 border-l-2 border-dashed border-slate-200 mr-8" />
                    
                    <span className={`${promo.iconColor} ${promo.iconHoverColor} transition-all duration-500 mr-4 transform ${promo.iconRotation}`}>
                      {promo.icon}
                    </span>
                  </div>
                </TiltCard>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUK ============ */}
      <section id="products" className="py-32 px-6 md:px-12 bg-[#F8FAFC] relative">
        <div className="max-w-7xl mx-auto">
          <FadeInSection delay={0}>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                  HairCare <span className="text-blue-600">Products</span>
                </h2>
                <p className="text-slate-500 mt-4 text-lg font-medium">
                  Bawa pulang gaya andalan Anda dengan produk pilihan kami.
                </p>
              </div>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Matte Clay Pomade", price: "Rp 120.000", type: "Strong Hold", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
              { name: "Water Based Pomade", price: "Rp 100.000", type: "Medium Hold", img: "https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
              { name: "Hair Tonic Ginseng", price: "Rp 85.000", type: "Treatment", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
              { name: "Beard Oil Premium", price: "Rp 95.000", type: "Beard Care", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" }
            ].map((prod, idx) => (
              <FadeInSection delay={idx * 150} key={idx}>
                <TiltCard>
                  <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] transition-all duration-500 group cursor-pointer h-full">
                    <div className="w-full aspect-square rounded-[1.5rem] mb-6 overflow-hidden relative bg-slate-100">
                      <img 
                        src={prod.img} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" 
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="px-3 pb-2 text-center md:text-left">
                      <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-2">
                        {prod.type}
                      </p>
                      <h4 className="font-bold text-slate-800 text-xl mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {prod.price}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-32 px-6 md:px-12 bg-[#0A0F1A] text-white relative overflow-hidden border-t border-slate-800/50">
        {/* Background dots */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInSection delay={0}>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
                Apa Kata <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Mereka?</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                Review nyata dari pelanggan setia HairCut Barbershop.
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Reza Rahardian", role: "Aktor", review: "Tempatnya nyaman banget, kapsternya ramah dan ngerti banget model rambut yang cocok sama bentuk muka saya. Bakal jadi langganan tetap!" },
              { name: "Bima Arya", role: "Pengusaha", review: "Booking via aplikasinya gampang banget jadi gak perlu antre berjam-jam. Hasil potongan rapi, alat-alatnya juga bersih dan higienis." },
              { name: "Daniel Mananta", role: "Presenter", review: "Hot towel shave-nya juara! Bener-bener rileks setelah seharian kerja. Harga sebanding banget sama kualitas pelayanan yang dikasih." }
            ].map((testi, idx) => (
              <FadeInSection delay={idx * 200} key={idx}>
                <TiltCard>
                  <div className="bg-[#111827]/80 backdrop-blur-xl p-10 rounded-[2.5rem] relative border border-slate-800/60 hover:border-slate-600 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)] transition-all duration-500 group h-full flex flex-col">
                    <FaQuoteLeft className="text-6xl text-slate-800 absolute top-8 right-8 opacity-50 group-hover:text-blue-900/40 transition-colors duration-500" />
                    
                    <div className="flex text-yellow-400 mb-8 text-base gap-1">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                    
                    <p className="text-slate-300 italic mb-10 leading-relaxed text-lg font-medium relative z-10">
                      "{testi.review}"
                    </p>
                    
                    <div className="flex items-center gap-5 pt-6 border-t border-slate-800/80 mt-auto">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-300">
                        {testi.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{testi.name}</h4>
                        <p className="text-sm text-slate-500 font-medium">{testi.role}</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#05080F] text-slate-400 py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                  <FaCut className="text-slate-500 text-lg" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">HairCut.</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Premium barbershop experience since 2024.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="font-bold text-white mb-4">Menu</h4>
              <div className="flex flex-col gap-2">
                {['Tentang', 'Layanan', 'Produk', 'Promo'].map(link => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium">
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="text-center md:text-right">
              <h4 className="font-bold text-white mb-4">Ikuti Kami</h4>
              <div className="flex gap-4 justify-center md:justify-end">
                {[FaInstagram, FaTwitter, FaYoutube].map((Icon, idx) => (
                  <a 
                    key={idx} 
                    href="#" 
                    className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <Icon className="text-lg" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-sm font-medium text-slate-500">
              © 2026 HairCut Barbershop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}