import FloatingChat from "./../components/FloatingChat";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCut, FaUserTie, FaRegCalendarCheck, FaStar, FaStarHalfAlt, FaRegStar,
  FaQuoteLeft, FaTicketAlt, FaShoppingBag, FaCheckCircle, FaHeart, FaRegHeart,
  FaArrowRight, FaPlay, FaInstagram, FaTwitter, FaYoutube, FaEye,
  FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaCrown, FaAward,
  FaShieldAlt, FaSmile, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaShoppingCart, FaGift, FaPercentage, FaFire, FaGem, FaRocket
} from 'react-icons/fa';

// ============ CUSTOM HOOKS ============
const useCountUp = (end, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, startCounting]);
  return count;
};

// ============ ANIMASI SCROLL ============
const FadeInSection = ({ children, delay = 0, className = "", direction = "up", duration = 800 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const currentRef = domRef.current;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: "0px 0px -50px 0px"
    });
    
    if (currentRef) observer.observe(currentRef);
    return () => { 
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const getTransform = () => {
    switch(direction) {
      case 'left': return 'translate3d(40px, 0, 0)';
      case 'right': return 'translate3d(-40px, 0, 0)';
      case 'down': return 'translate3d(0, -40px, 0)';
      case 'scale': return 'scale3d(0.92, 0.92, 1)';
      default: return 'translate3d(0, 40px, 0)';
    }
  };

  return (
    <div 
      ref={domRef}
      className={`transform-gpu ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0) scale3d(1, 1, 1)' : getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

// ============ 3D TILT CARD ============
const TiltCard = ({ children, className = "", maxTilt = 8 }) => {
  const cardRef = useRef();
  const rafRef = useRef();
  const [style, setStyle] = useState({ 
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)', 
    glare: { opacity: 0 } 
  });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      
      setStyle({
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1)`,
        glare: {
          background: `radial-gradient(circle at ${(x/rect.width)*100}% ${(y/rect.height)*100}%, rgba(255,255,255,0.25) 0%, transparent 70%)`,
          opacity: 0.12
        }
      });
    });
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStyle({ 
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)', 
      glare: { opacity: 0 } 
    });
  }, []);

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div 
      ref={cardRef} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out ${className}`}
      style={{ transform: style.transform, transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200" 
        style={{ ...style.glare, borderRadius: 'inherit' }} />
      {children}
    </div>
  );
};

// ============ STATS COUNTER ============
const StatsCounter = ({ end, label, icon: Icon, suffix = "+" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const count = useCountUp(end, 2500, isVisible);
  const ref = useRef();

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); } 
      },
      { threshold: 0.3 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-3xl md:text-5xl font-black text-white mb-2 flex items-center justify-center gap-2">
        <Icon className="text-blue-400 text-2xl md:text-3xl group-hover:scale-125 transition-transform duration-300" />
        <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{count}{suffix}</span>
      </div>
      <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
};

// ============ PARTICLE BACKGROUND ============
const ParticleBackground = () => {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5, speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2, opacity: Math.random() * 0.3 + 0.1,
    }));
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`; ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resizeCanvas); };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.35 }} />;
};

// ============ PRODUCT CARD ============
const ProductCard = ({ product, index }) => {
  const [isLiked, setIsLiked] = useState(false);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => {
      if (i < Math.floor(rating)) return <FaStar key={i} className="text-yellow-400 text-xs" />;
      if (i < rating) return <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />;
      return <FaRegStar key={i} className="text-yellow-400 text-xs" />;
    });
  };

  const originalPrice = parseInt(product.price.replace(/\D/g, ''));
  const discountedPrice = product.discount ? originalPrice * (1 - product.discount / 100) : null;

  return (
    <FadeInSection delay={index * 100} direction="scale" duration={600}>
      <TiltCard maxTilt={8} className="h-full">
        <div className="bg-white rounded-[2rem] p-4 md:p-5 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.2)] transition-all duration-300 group cursor-pointer h-full relative overflow-hidden">
          
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
            {product.bestSeller && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-1">
                <FaCrown className="text-[8px]" /> BEST SELLER
              </span>
            )}
            {product.isNew && (
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-1">
                <FaFire className="text-[8px]" /> NEW
              </span>
            )}
            {product.discount && (
              <span className="bg-gradient-to-r from-red-400 to-pink-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-red-500/20 flex items-center gap-1">
                <FaPercentage className="text-[8px]" /> {product.discount}% OFF
              </span>
            )}
          </div>

          <button onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100">
            {isLiked ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-slate-500 hover:text-red-500 transition-colors text-sm" />}
          </button>
          
          <div className="w-full aspect-square rounded-2xl mb-5 overflow-hidden relative bg-gradient-to-br from-slate-50 to-slate-100">
            <img src={product.img} alt={product.name} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button className="w-full bg-white/95 backdrop-blur-sm text-slate-800 py-3 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-xl flex items-center justify-center gap-2">
                <FaEye className="text-sm" /> Quick View
              </button>
            </div>
          </div>
          
          <div className="px-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.type}</p>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <FaShoppingCart className="text-[9px]" /> {product.sold}+
              </span>
            </div>
            
            <h4 className="font-bold text-slate-800 text-lg md:text-xl mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-200">
              {product.name}
            </h4>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
              <span className="text-xs font-bold text-slate-700">{product.rating}</span>
              <span className="text-[10px] text-slate-400">({product.reviews})</span>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                {product.discount ? (
                  <div className="flex flex-col">
                    <span className="text-lg md:text-xl font-black text-red-500">
                      Rp {(discountedPrice).toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-slate-400 line-through">{product.price}</span>
                  </div>
                ) : (
                  <p className="text-lg md:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                    {product.price}
                  </p>
                )}
              </div>
              
              <button className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                <FaShoppingCart className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </TiltCard>
    </FadeInSection>
  );
};

// ============ MAIN LANDING PAGE ============
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          setShowBackToTop(window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const menuLinks = [
    { href: "#about", label: "Tentang" },
    { href: "#services", label: "Layanan" },
    { href: "#products", label: "Produk" },
    { href: "#vouchers", label: "Promo" }
  ];

  const testimonials = [
    { name: "Reza Rahardian", role: "Aktor", rating: 5, review: "Tempatnya nyaman banget, kapsternya ramah dan ngerti banget model rambut yang cocok sama bentuk muka saya. Bakal jadi langganan tetap!", avatar: "RR" },
    { name: "Bima Arya", role: "Pengusaha", rating: 5, review: "Booking via aplikasinya gampang banget jadi gak perlu antre berjam-jam. Hasil potongan rapi, alat-alatnya juga bersih dan higienis.", avatar: "BA" },
    { name: "Daniel Mananta", role: "Presenter", rating: 5, review: "Hot towel shave-nya juara! Bener-bener rileks setelah seharian kerja. Harga sebanding banget sama kualitas pelayanan yang dikasih.", avatar: "DM" }
  ];

  const products = [
    { name: "Matte Clay Pomade", price: "Rp 120.000", type: "Strong Hold", rating: 4.9, reviews: 234, sold: 1250, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", bestSeller: true, isNew: false, discount: null },
    { name: "Water Based Pomade", price: "Rp 100.000", type: "Medium Hold", rating: 4.7, reviews: 189, sold: 980, img: "https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", bestSeller: false, isNew: true, discount: null },
    { name: "Hair Tonic Ginseng", price: "Rp 85.000", type: "Treatment", rating: 4.8, reviews: 156, sold: 720, img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", bestSeller: false, isNew: false, discount: 15 },
    { name: "Beard Oil Premium", price: "Rp 95.000", type: "Beard Care", rating: 4.9, reviews: 92, sold: 540, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", bestSeller: false, isNew: false, discount: null }
  ];

  // ============ ROUNDED NAVBAR STYLES ============
  const navbarStyle = {
    maxWidth: isScrolled ? '72rem' : '100%',
    borderRadius: '28px',
    padding: isScrolled ? '8px 24px' : '16px 24px',
    marginTop: isScrolled ? '12px' : '0px',
    background: isScrolled 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.72) 25%, rgba(255,255,255,0.84) 50%, rgba(255,255,255,0.68) 75%, rgba(255,255,255,0.88) 100%)'
      : 'linear-gradient(135deg, rgba(10,15,26,0.92) 0%, rgba(10,15,26,0.78) 25%, rgba(10,15,26,0.86) 50%, rgba(10,15,26,0.72) 75%, rgba(10,15,26,0.9) 100%)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    boxShadow: isScrolled 
      ? '0 8px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7), 0 0 0 1px rgba(255,255,255,0.5)'
      : '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.15)',
    border: isScrolled 
      ? '1px solid rgba(255,255,255,0.6)' 
      : '1px solid rgba(255,255,255,0.12)',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans scroll-smooth selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-blue-500 transition-all duration-300 hover:scale-110 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <FaArrowRight className="transform -rotate-90" />
      </button>

      {/* ============ LIQUID GLASS NAVBAR - SELALU ROUNDED ============ */}
      <header className="fixed w-full z-50 px-3 md:px-6 transition-all duration-500 ease-out">
        <nav className="mx-auto transition-all duration-500 ease-out relative overflow-hidden"
          style={navbarStyle}>
          
          {/* Liquid shine effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 'inherit' }}>
            <div 
              className="absolute -top-1/2 -left-1/4 w-1/2 h-[200%] opacity-25"
              style={{
                background: isScrolled 
                  ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                transform: 'rotate(25deg)',
                animation: 'liquidShine 3.5s ease-in-out infinite',
              }}
            />
          </div>

          {/* Animated gradient border */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 'inherit',
              opacity: isScrolled ? 0.4 : 0.2,
              background: 'linear-gradient(270deg, #6366f1, #8b5cf6, #a78bfa, #6366f1)',
              backgroundSize: '300% 300%',
              animation: 'gradientMove 4s ease infinite',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: '1.5px',
            }}
          />
          
          <div className="relative z-10 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group cursor-pointer flex-shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:rotate-6"
                style={{
                  background: isScrolled 
                    ? 'linear-gradient(135deg, #101623, #1e293b)' 
                    : 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
                  border: isScrolled ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  boxShadow: isScrolled ? '0 4px 15px rgba(0,0,0,0.12)' : '0 4px 15px rgba(0,0,0,0.05)',
                }}
              >
                <FaCut className="text-white text-lg" />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight transition-colors duration-300 whitespace-nowrap"
                style={{ color: isScrolled ? '#101623' : '#ffffff' }}
              >
                Hair<span style={{ color: isScrolled ? '#2563eb' : '#60a5fa' }}>Cut.</span>
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-[12px] font-bold tracking-widest uppercase transition-all duration-300"
              style={{ color: isScrolled ? '#6b7280' : '#cbd5e1' }}
            >
              {menuLinks.map((item) => (
                <a key={item.label} href={item.href} className="relative py-2 group">
                  <span className="transition-colors duration-200"
                    style={{ color: 'inherit' }}
                    onMouseEnter={(e) => e.target.style.color = isScrolled ? '#2563eb' : '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = ''}
                  >
                    {item.label}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-200 group-hover:w-full rounded-full"
                    style={{ 
                      background: isScrolled 
                        ? 'linear-gradient(90deg, #2563eb, #6366f1)' 
                        : 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                      boxShadow: isScrolled ? '0 0 8px rgba(37,99,235,0.4)' : '0 0 8px rgba(96,165,250,0.3)',
                    }}
                  />
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link 
                to="/login" 
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3 text-xs md:text-sm font-bold rounded-full transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: isScrolled 
                    ? 'linear-gradient(135deg, #101623, #1e293b)' 
                    : 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))',
                  color: '#ffffff',
                  border: isScrolled ? 'none' : '1px solid rgba(255,255,255,0.25)',
                  boxShadow: isScrolled 
                    ? '0 4px 15px rgba(0,0,0,0.1)' 
                    : '0 4px 15px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = isScrolled 
                    ? 'linear-gradient(135deg, #2563eb, #6366f1)' 
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))';
                  e.target.style.color = isScrolled ? '#ffffff' : '#101623';
                  e.target.style.boxShadow = '0 8px 25px rgba(37,99,235,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = isScrolled 
                    ? 'linear-gradient(135deg, #101623, #1e293b)' 
                    : 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))';
                  e.target.style.color = '#ffffff';
                  e.target.style.boxShadow = isScrolled ? '0 4px 15px rgba(0,0,0,0.1)' : '0 4px 15px rgba(0,0,0,0.05)';
                }}
              >
                Login Admin <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <button 
                className="md:hidden p-2 text-2xl rounded-xl transition-all duration-200"
                style={{ color: isScrolled ? '#374151' : '#ffffff' }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>

            {/* Mobile Menu */}
            <div 
              className="absolute top-full left-0 w-full mt-2 md:hidden transition-all duration-300 ease-out overflow-hidden"
              style={{
                maxHeight: isMobileMenuOpen ? '400px' : '0px',
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              <div className="mx-2 py-3 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255,255,255,0.7)',
                }}
              >
                {menuLinks.map((item) => (
                  <a key={item.label} href={item.href} onClick={() => setIsMobileMenuOpen(false)} 
                    className="block px-6 py-3 text-sm font-bold text-slate-600 uppercase tracking-widest hover:text-blue-600 transition-colors duration-150"
                    style={{ background: 'transparent' }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(239,246,255,0.6)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="px-6 pt-3 pb-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} 
                    className="block text-center w-full text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}
                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #1d4ed8, #4f46e5)'}
                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #2563eb, #6366f1)'}
                  >
                    Login Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* CSS Animations */}
      <style>{`
        @keyframes liquidShine {
          0%, 100% { transform: translateX(-100%) rotate(25deg); }
          50% { transform: translateX(200%) rotate(25deg); }
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-28 pb-16 md:pt-44 md:pb-28 lg:pt-52 lg:pb-32 px-4 md:px-8 overflow-hidden bg-[#0A0F1A] flex items-center justify-center min-h-[95vh]">
        <ParticleBackground />
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(30deg, #fff 1px, transparent 1px), linear-gradient(-30deg, #fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        </div>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08] mix-blend-luminosity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-[#0A0F1A]/30 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <FadeInSection delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/25 bg-blue-500/8 backdrop-blur-xl text-blue-300 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mb-6 md:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <FaGem className="text-blue-400 text-[10px]" /> Premium Barbershop Experience
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </FadeInSection>
          
          <FadeInSection delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.15] md:leading-[1.05] mb-6 md:mb-8 tracking-tighter">
              Elevate Your <br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
                  Signature Style.
                </span>
                <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full" viewBox="0 0 200 6" fill="none">
                  <path d="M0 3 Q50 0, 100 3 Q150 6, 200 3" stroke="url(#heroGradient)" strokeWidth="2" fill="none" />
                  <defs>
                    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
          </FadeInSection>

          <FadeInSection delay={200}>
            <p className="text-sm sm:text-base md:text-xl text-slate-300 mb-8 md:mb-12 font-medium max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
              Mahakarya dalam setiap potongan. HairCut memadukan teknik klasik dan inovasi modern untuk menghadirkan pengalaman grooming yang tak tertandingi.
            </p>
          </FadeInSection>

          <FadeInSection delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <Link to="/register" className="group px-8 py-4 w-full sm:w-auto text-center font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:-translate-y-1 hover:from-blue-500 hover:to-blue-400">
                <span className="flex items-center justify-center gap-2">
                  <FaRocket className="group-hover:translate-x-1 transition-transform duration-200" />
                  Booking Sekarang
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>
              <a href="#about" className="group px-8 py-4 w-full sm:w-auto text-center font-bold text-white bg-white/5 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                <span className="flex items-center justify-center gap-2">
                  <FaPlay className="text-blue-400 text-xs" /> Kenali Kami
                </span>
              </a>
            </div>
          </FadeInSection>

          <FadeInSection delay={400}>
            <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto mt-14 md:mt-20">
              <StatsCounter end={5000} label="Pelanggan Puas" icon={FaSmile} />
              <StatsCounter end={15} label="Master Barber" icon={FaCut} />
              <StatsCounter end={4} label="Tahun Berkarya" icon={FaAward} suffix="" />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ============ ABOUT SECTION ============ */}
      <section id="about" className="py-20 md:py-32 px-4 md:px-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #3B82F6 1px, transparent 1px), radial-gradient(circle at 75% 75%, #3B82F6 1px, transparent 1px)', backgroundSize: '70px 70px' }} />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
          <div className="w-full lg:w-1/2 relative">
            <FadeInSection delay={0}>
              <TiltCard maxTilt={5}>
                <div className="relative rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 aspect-[4/3] md:aspect-[16/10] lg:aspect-square">
                  <img src="/img/bb2.jpg" alt="HairCut Interior" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </TiltCard>
            </FadeInSection>
            <FadeInSection delay={200} className="absolute -bottom-6 -right-2 md:-bottom-8 md:-right-6">
              <div className="bg-white/95 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border border-white hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                    <FaAward className="text-blue-600 text-xl md:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg md:text-xl">Est. 2024</h4>
                    <p className="text-xs md:text-sm font-medium text-slate-500">Premium Quality Guaranteed</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
          <div className="w-full lg:w-1/2">
            <FadeInSection delay={100} direction="right">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-4 md:mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> Tentang HairCut
              </span>
            </FadeInSection>
            <FadeInSection delay={150} direction="right">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-6 leading-tight">
                Cerita Di Balik <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Keahlian Kami.</span>
              </h2>
            </FadeInSection>
            <FadeInSection delay={200} direction="right">
              <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-6 font-medium">
                Berdiri sejak 2024, HairCut lahir dari visi menciptakan ruang eksklusif bagi pria untuk bersantai, menikmati pelayanan kelas satu, dan tampil dengan versi terbaik diri mereka.
              </p>
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
                {[
                  { icon: FaShieldAlt, text: "Peralatan Steril & Higienis" },
                  { icon: FaAward, text: "Kapster Bersertifikasi" },
                  { icon: FaSmile, text: "Suasana Nyaman & Maskulin" },
                  { icon: FaStar, text: "Teknik Klasik & Modern" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 md:gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors duration-200 group cursor-pointer">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
                      <item.icon className="text-blue-500 text-sm" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all duration-200 hover:-translate-y-1 shadow-lg text-sm">
                  Booking Sekarang <FaArrowRight className="text-xs" />
                </Link>
                <a href="#services" className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:-translate-y-1 text-sm">
                  Layanan Kami
                </a>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ============ SERVICES SECTION ============ */}
      <section id="services" className="py-20 md:py-32 px-4 md:px-12 bg-slate-50/80 relative">
        <div className="max-w-7xl mx-auto">
          <FadeInSection delay={0}>
            <div className="text-center mb-12 md:mb-20">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-4">
                <FaCut className="text-xs" /> Our Services
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                Layanan <span className="text-blue-600">Signature</span>
              </h2>
              <p className="text-slate-500 mt-3 md:mt-4 text-base md:text-lg max-w-2xl mx-auto">
                Pengalaman grooming premium dari ujung rambut hingga wajah.
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: FaCut, title: "Hot Towel Shave", desc: "Pengalaman cukur premium dengan handuk hangat aromaterapi, krim cukur Italia, dan pijat wajah relaksasi.", price: "Rp 50k", duration: "30 min", badge: "Best Value", featured: false },
              { icon: FaCrown, title: "Royal Haircut", desc: "Potongan presisi master barber, keramas premium, steam towel, pijat kepala & bahu, styling eksklusif.", price: "Rp 75k", duration: "45 min", badge: "Most Popular", featured: true },
              { icon: FaUserTie, title: "Natural Coloring", desc: "Pewarnaan organik bebas amonia, konsultasi personal, perawatan pasca-coloring untuk rambut sehat.", price: "Rp 150k", duration: "60 min", badge: "Premium", featured: false }
            ].map((service, idx) => (
              <FadeInSection delay={idx * 80} key={idx} direction="scale" duration={600}>
                <TiltCard maxTilt={6} className="h-full">
                  <div className={`relative p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] transition-all duration-300 group cursor-pointer h-full ${service.featured ? 'bg-gradient-to-b from-[#101623] to-[#1a2333] shadow-[0_25px_60px_-15px_rgba(16,22,35,0.5)] border border-slate-700/50' : 'bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_-15px_rgba(37,99,235,0.2)] border border-slate-100'}`}>
                    <div className={`absolute top-0 right-0 text-[10px] md:text-xs font-black px-4 md:px-5 py-1.5 md:py-2 rounded-bl-2xl shadow-lg ${service.featured ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                      {service.badge}
                    </div>
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-5 md:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${service.featured ? 'bg-white/10' : 'bg-blue-50'}`}>
                      <service.icon className={`text-xl md:text-2xl ${service.featured ? 'text-emerald-400' : 'text-blue-600'}`} />
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold mb-3 ${service.featured ? 'text-white' : 'text-slate-800'}`}>{service.title}</h3>
                    <p className={`text-sm leading-relaxed mb-4 ${service.featured ? 'text-slate-400' : 'text-slate-500'}`}>{service.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-5"><FaClock /><span>{service.duration}</span></div>
                    <div className={`pt-4 border-t ${service.featured ? 'border-slate-700/50' : 'border-slate-100'}`}>
                      <span className={`font-black text-2xl md:text-3xl ${service.featured ? 'text-emerald-400' : 'text-slate-800'}`}>{service.price}</span>
                    </div>
                  </div>
                </TiltCard>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROMO SECTION ============ */}
      <section id="vouchers" className="py-20 md:py-28 px-4 md:px-12 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 relative overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 opacity-8">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">
          <div className="w-full lg:w-1/2 text-white text-center lg:text-left">
            <FadeInSection delay={0} direction="left">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 md:mb-6 border border-white/20">
                <FaGift className="text-yellow-400" /> Promo Eksklusif
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 md:mb-6 leading-[1.15]">
                Klaim Voucher <br className="hidden md:block"/>Spesial Anda!
              </h2>
              <p className="text-blue-100 text-base md:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Daftar sebagai member HairCut sekarang dan nikmati diskon kunjungan pertama serta potongan harga produk eksklusif.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/register" className="px-6 py-3.5 bg-white text-blue-700 font-bold rounded-full hover:bg-slate-50 transition-all duration-200 hover:-translate-y-1 shadow-xl text-sm flex items-center justify-center gap-2">
                  <FaRocket className="text-blue-600" /> Daftar & Klaim <FaArrowRight className="text-xs" />
                </Link>
                <button className="px-6 py-3.5 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-200 hover:-translate-y-1 text-sm flex items-center justify-center gap-2">
                  <FaPercentage /> Lihat Semua Promo
                </button>
              </div>
            </FadeInSection>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-5">
            {[
              { discount: "Diskon 20%", title: "First Haircut", desc: "*Berlaku untuk transaksi pertama", category: "New Member", code: "WELCOME20", color: "yellow", borderColor: "border-yellow-400", dotColor: "bg-yellow-400" },
              { discount: "Potongan 15k", title: "Pomade", desc: "*Berlaku semua varian", category: "Product Promo", code: "POMADE15", color: "emerald", borderColor: "border-emerald-400", dotColor: "bg-emerald-400" }
            ].map((promo, idx) => (
              <FadeInSection delay={idx * 150} direction="right" key={idx} duration={500}>
                <TiltCard maxTilt={3}>
                  <div className={`bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 flex items-center justify-between border-l-[10px] md:border-l-[14px] ${promo.borderColor} shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}>
                    <div className={`absolute -left-[12px] md:-left-[16px] top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 ${promo.dotColor} rounded-full animate-pulse`} />
                    <div>
                      <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{promo.category}</p>
                      <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 mb-1">{promo.discount} {promo.title}</h4>
                      <p className="text-xs text-slate-500 mb-2">{promo.desc}</p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full text-[10px]">
                        <span className="text-slate-400">Kode:</span>
                        <span className="font-bold text-blue-600">{promo.code}</span>
                      </span>
                    </div>
                    <div className="text-4xl md:text-5xl opacity-20 group-hover:opacity-30 transition-opacity duration-200">
                      {promo.color === 'yellow' ? <FaTicketAlt className="text-yellow-500" /> : <FaShoppingBag className="text-emerald-500" />}
                    </div>
                  </div>
                </TiltCard>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUCTS SECTION ============ */}
      <section id="products" className="py-20 md:py-32 px-4 md:px-12 bg-gradient-to-b from-[#F8FAFC] to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #6366F1 1.5px, transparent 1.5px), radial-gradient(circle at 80% 20%, #3B82F6 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInSection delay={0}>
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-4 text-center md:text-left">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-4">
                  <FaShoppingBag className="text-xs" /> Our Collection
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                  HairCare <span className="relative">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Products</span>
                    <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 4" fill="none">
                      <path d="M0 2 Q50 0, 100 2" stroke="url(#productGradient)" strokeWidth="2" fill="none" />
                      <defs><linearGradient id="productGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#4F46E5" /></linearGradient></defs>
                    </svg>
                  </span>
                </h2>
                <p className="text-slate-500 mt-3 text-base md:text-lg font-medium">Bawa pulang gaya andalan Anda dengan produk premium pilihan.</p>
              </div>
              <Link to="/products" className="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-lg text-sm">
                Lihat Semua Produk <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
            {products.map((prod, idx) => (
              <ProductCard key={idx} product={prod} index={idx} />
            ))}
          </div>
          
          <FadeInSection delay={300}>
            <div className="text-center mt-12 md:mt-16">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <FaShoppingBag className="text-blue-600 text-xl" />
                <p className="text-sm font-semibold text-slate-700">
                  Gratis ongkir untuk pembelian di atas <span className="text-blue-600 font-black">Rp 200.000</span>
                </p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20 md:py-32 px-4 md:px-12 bg-[#0A0F1A] text-white relative overflow-hidden border-t border-slate-800/50">
        <ParticleBackground />
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeInSection delay={0}>
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-xl rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 border border-white/10 text-blue-300">
                <FaStar className="text-yellow-400 text-[10px]" /> Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
                Apa Kata <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Mereka?</span>
              </h2>
              <p className="text-slate-400 text-base">Review nyata dari pelanggan setia.</p>
            </div>
          </FadeInSection>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                {testimonials.map((testi, idx) => (
                  <div key={idx} className="w-full flex-shrink-0 px-4">
                    <TiltCard>
                      <div className="bg-[#111827]/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] relative border border-slate-800/60 hover:border-slate-600 transition-all duration-300">
                        <FaQuoteLeft className="text-6xl md:text-8xl text-slate-800 absolute top-6 right-8 opacity-40" />
                        <div className="flex text-yellow-400 mb-6 text-lg gap-1">
                          {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                        </div>
                        <p className="text-slate-300 italic mb-8 text-lg md:text-xl leading-relaxed relative z-10">"{testi.review}"</p>
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-800/80">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30">{testi.avatar}</div>
                          <div>
                            <h4 className="font-bold text-white text-lg">{testi.name}</h4>
                            <p className="text-sm text-slate-500">{testi.role}</p>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200">
              <FaChevronLeft />
            </button>
            <button onClick={() => setActiveTestimonial(prev => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200">
              <FaChevronRight />
            </button>
            
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button key={idx} onClick={() => setActiveTestimonial(idx)}
                  className={`transition-all duration-200 rounded-full ${idx === activeTestimonial ? 'w-8 h-2.5 bg-blue-500' : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-500'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-20 md:py-28 px-4 md:px-12 bg-gradient-to-br from-slate-900 to-[#0A0F1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #60A5FA 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeInSection delay={0} direction="scale" duration={600}>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Siap Untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Transformasi?</span>
            </h2>
            <p className="text-slate-300 text-base md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan pria yang telah mempercayakan gaya mereka. Booking sekarang dan dapatkan diskon 20%!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-8 py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-full hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1 text-base flex items-center justify-center gap-2">
                <FaRocket /> Booking Sekarang
              </Link>
              <a href="tel:+62123456789" className="px-8 py-4 font-bold text-white border-2 border-white/20 rounded-full hover:bg-white/10 transition-all duration-200 hover:-translate-y-1 text-base flex items-center justify-center gap-2">
                <FaPhone /> Hubungi Kami
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#05080F] text-slate-400 py-12 md:py-16 px-4 md:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                  <FaCut className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tight text-white">HairCut.</span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-4">Premium barbershop experience since 2024.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500 text-xs" /><span>Jl. Premium No. 123, Jakarta</span></div>
                <div className="flex items-center gap-2"><FaPhone className="text-blue-500 text-xs" /><span>+62 123 4567 89</span></div>
                <div className="flex items-center gap-2"><FaEnvelope className="text-blue-500 text-xs" /><span>info@haircut.id</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Menu</h4>
              <div className="flex flex-col gap-2">
                {menuLinks.map(link => (
                  <a key={link.label} href={link.href} className="text-slate-500 hover:text-blue-400 transition-colors duration-150 text-sm">{link.label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Ikuti Kami</h4>
              <div className="flex gap-3 mb-5">
                {[FaInstagram, FaTwitter, FaYoutube].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-150"><Icon /></a>
                ))}
              </div>
              <h4 className="font-bold text-white mb-2 text-sm">Jam Operasional</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span>Sen - Jum</span><span className="text-slate-300">09:00 - 21:00</span></div>
                <div className="flex justify-between"><span>Sabtu</span><span className="text-slate-300">10:00 - 20:00</span></div>
                <div className="flex justify-between"><span>Minggu</span><span className="text-slate-300">11:00 - 18:00</span></div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© 2026 HairCut Barbershop. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <a href="#" className="text-slate-500 hover:text-white transition-colors duration-150">Privacy</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors duration-150">Terms</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors duration-150">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
      <FloatingChat />
    </div>
  );
}