import FloatingChat from "./../components/FloatingChat";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCut, FaUserTie, FaRegCalendarCheck, FaStar, FaStarHalfAlt, FaRegStar,
  FaQuoteLeft, FaTicketAlt, FaShoppingBag, FaCheckCircle, FaHeart, FaRegHeart,
  FaArrowRight, FaPlay, FaInstagram, FaTwitter, FaYoutube, FaEye,
  FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaCrown, FaAward,
  FaShieldAlt, FaSmile, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaShoppingCart, FaGift, FaPercentage, FaFire, FaGem, FaRocket, FaPaperPlane,
  FaWhatsapp, FaSearch, FaPen, FaTrash
} from 'react-icons/fa';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "../lib/supabaseClient";

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
        <Icon className="text-gray-400 text-2xl md:text-3xl group-hover:scale-125 transition-transform duration-300" />
        <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{count}{suffix}</span>
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
        ctx.fillStyle = `rgba(156, 163, 175, ${p.opacity})`; // gray-400 particles
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resizeCanvas); };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.25 }} />;
};

// ============ PRODUCT CARD ============
const ProductCard = ({ product, index, onBuy }) => {
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
        <div className="bg-white rounded-[2rem] p-4 md:p-5 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-300 group cursor-pointer h-full relative overflow-hidden">
          
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
            {product.bestSeller && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <FaCrown className="text-[8px]" /> BEST SELLER
              </span>
            )}
            {product.isNew && (
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <FaFire className="text-[8px]" /> NEW
              </span>
            )}
            {product.discount && (
              <span className="bg-gradient-to-r from-red-400 to-pink-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <FaPercentage className="text-[8px]" /> {product.discount}% OFF
              </span>
            )}
          </div>

          <button onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100">
            {isLiked ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-gray-500 hover:text-red-500 transition-colors text-sm" />}
          </button>
          
          <div className="w-full aspect-square rounded-2xl mb-5 overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200">
            <img src={product.img} alt={product.name} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (product.stok > 0) onBuy(product); 
                }}
                disabled={product.stok <= 0}
                className={`w-full bg-white/95 backdrop-blur-sm text-black py-3 rounded-xl font-bold text-xs hover:bg-black hover:text-white transition-all duration-200 shadow-xl flex items-center justify-center gap-2 ${product.stok <= 0 ? 'opacity-50 cursor-not-allowed hover:bg-white/95 hover:text-black' : ''}`}
              >
                <FaShoppingCart className="text-sm" /> {product.stok > 0 ? 'Beli Sekarang' : 'Stok Habis'}
              </button>
            </div>
          </div>
          
          <div className="px-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{product.type}</p>
              <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                <FaShoppingCart className="text-[9px]" /> {product.sold}+
              </span>
            </div>
            
            <h4 className="font-bold text-gray-900 text-lg md:text-xl mb-3 leading-tight group-hover:text-black transition-colors duration-200">
              {product.name}
            </h4>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
              <span className="text-xs font-bold text-gray-700">{product.rating}</span>
              <span className="text-[10px] text-gray-400">({product.reviews})</span>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                {product.discount ? (
                  <div className="flex flex-col">
                    <span className="text-lg md:text-xl font-black text-red-600">
                      Rp {(discountedPrice).toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">{product.price}</span>
                  </div>
                ) : (
                  <p className="text-lg md:text-xl font-black text-gray-900 group-hover:text-black transition-colors duration-200">
                    {product.price}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${product.stok > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  Sisa Stok: {product.stok || 0}
                </span>
              </div>
              
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (product.stok > 0) onBuy(product); 
                }}
                disabled={product.stok <= 0}
                className={`w-10 h-10 rounded-xl text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 ${product.stok <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:scale-110 hover:shadow-lg'}`}
              >
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
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isBackToTopWhite, setIsBackToTopWhite] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedKapster, setSelectedKapster] = useState(null);
  
  // State untuk form Booking & Cek Status (Repurposed from Contact)
  const [bookingNama, setBookingNama] = useState('');
  const [bookingWa, setBookingWa] = useState('');
  const [bookingLayanan, setBookingLayanan] = useState('');
  const [bookingTanggal, setBookingTanggal] = useState('');
  const [contactStatus, setContactStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
  
  const [cekStatusResult, setCekStatusResult] = useState('');
  const [cekStatusError, setCekStatusError] = useState('');
  const [cekStatusData, setCekStatusData] = useState(null);

  // State untuk Checkout Produk
  const [buyingProduct, setBuyingProduct] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [buyStep, setBuyStep] = useState(1);
  const [productPromoInput, setProductPromoInput] = useState('');
  const [productPromoError, setProductPromoError] = useState('');
  const [isProductPromoLoading, setIsProductPromoLoading] = useState(false);

  // State untuk Auth & Testimoni
  const [userSession, setUserSession] = useState(null);
  const [reviewsData, setReviewsData] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ id: null, rating: 5, review: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // State untuk Dynamic Data
  const [dynamicServices, setDynamicServices] = useState([]);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [dynamicPromos, setDynamicPromos] = useState([]);
  const [dynamicKapsters, setDynamicKapsters] = useState([]);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(true);

  useEffect(() => {
    const fetchDynamicData = async () => {
      setIsLoadingDynamic(true);
      try {
        const [svcRes, prdRes, proRes, kapRes] = await Promise.all([
          supabase.from('services').select('*').order('created_at', { ascending: false }).limit(8),
          supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8),
          supabase.from('promos').select('*').eq('status', 'Aktif').not('code', 'ilike', 'RWD-%').order('created_at', { ascending: false }),
          supabase.from('kapsters').select('*')
        ]);
        
        if (svcRes.data) setDynamicServices(svcRes.data);
        if (prdRes.data) setDynamicProducts(prdRes.data);
        if (proRes.data) setDynamicPromos(proRes.data);
        if (kapRes.data) setDynamicKapsters(kapRes.data);
      } catch (e) {
        console.error("Error fetching dynamic data:", e);
      } finally {
        setIsLoadingDynamic(false);
      }
    };
    fetchDynamicData();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('haircut_reviews')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) setReviewsData(data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          setShowBackToTop(window.scrollY > 600);
          
          // Deteksi dark section untuk tombol back-to-top
          const darkSections = ['vouchers', 'footer'];
          let isOverDark = false;
          const buttonY = window.innerHeight - 110; 
          
          for (const id of darkSections) {
            const el = id === 'footer' ? document.querySelector('footer') : document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= buttonY && rect.bottom >= buttonY) {
                isOverDark = true;
                break;
              }
            }
          }
          setIsBackToTopWhite(isOverDark);
          
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Autofill email jika user sedang login
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setBuyerEmail(savedEmail);
      setBookingWa(savedEmail);
      setUserSession(savedEmail);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePromoClaim = (promo) => {
    // cek apakah ini promo produk
    if (promo.description && promo.description.toLowerCase().includes('produk')) {
      // Cari produk yang cocok
      let matchedProduct = null;
      for (const prod of dynamicProducts) {
        if (promo.description.toLowerCase().includes(prod.name.toLowerCase())) {
          matchedProduct = prod;
          break;
        }
      }
      if (!matchedProduct && dynamicProducts.length > 0) {
        matchedProduct = dynamicProducts[0]; // fallback
      }

      if (matchedProduct) {
        let originalPrice = matchedProduct.price;
        if (typeof originalPrice === 'string') {
          originalPrice = parseInt(originalPrice.replace(/\D/g, ''));
        }
        
        let discountVal = 0;
        if (promo.discount.includes('%')) {
          discountVal = (originalPrice * parseInt(promo.discount)) / 100;
        } else if (promo.discount.toLowerCase().includes('rp')) {
          discountVal = parseInt(promo.discount.replace(/\D/g, ''));
        }

        // Tampilkan modal produk dengan diskon khusus promo
        setBuyingProduct({
          ...matchedProduct,
          price: `Rp ${originalPrice.toLocaleString('id-ID')}`,
          discount: null, // override original discount
          promoCode: promo.code,
          promoDiscountVal: discountVal,
          finalPriceNum: Math.max(0, originalPrice - discountVal),
          originalPriceNum: originalPrice
        });
      } else {
        alert("Produk untuk promo ini tidak ditemukan.");
      }
    } else {
      // Promo layanan, navigasi ke booking
      navigate('/booking', { state: { promoCode: promo.code } });
    }
  };

  const handleApplyProductPromo = async (e) => {
    e.preventDefault();
    if (!productPromoInput) return;
    setIsProductPromoLoading(true);
    setProductPromoError('');
    
    try {
      const { data, error } = await supabase
        .from('promos')
        .select('*')
        .eq('code', productPromoInput.toUpperCase())
        .single();
        
      if (error || !data) throw new Error('Kode voucher tidak valid.');
      if (data.status !== 'Aktif' && data.status !== 'Active') throw new Error('Kode voucher sudah tidak aktif.');
      
      const originalPrice = buyingProduct.discount 
        ? parseInt(buyingProduct.price.replace(/\D/g, '')) * (1 - buyingProduct.discount / 100) 
        : parseInt(buyingProduct.price.replace(/\D/g, ''));
        
      let discountAmount = 0;
      if (data.discount.includes('%')) {
        discountAmount = (originalPrice * parseInt(data.discount)) / 100;
      } else if (data.discount.toLowerCase().includes('rp')) {
        discountAmount = parseInt(data.discount.replace(/\D/g, ''));
      }
      
      setBuyingProduct(prev => ({
        ...prev,
        promoCode: data.code,
        promoDiscountVal: discountAmount,
        finalPriceNum: Math.max(0, originalPrice - discountAmount),
        originalPriceNum: originalPrice
      }));
    } catch (err) {
      setProductPromoError(err.message);
    } finally {
      setIsProductPromoLoading(false);
    }
  };

  const handleBuyProduct = async (e) => {
    e.preventDefault();
    if (!buyerEmail || !buyingProduct) return;
    setIsBuying(true);
    
    try {
      const originalPrice = parseInt(buyingProduct.price.replace(/\D/g, ''));
      let finalPrice = originalPrice;
      if (buyingProduct.promoCode) {
        finalPrice = buyingProduct.finalPriceNum;
      } else if (buyingProduct.discount) {
        finalPrice = originalPrice * (1 - buyingProduct.discount / 100);
      }
      
      const qty = parseInt(buyQuantity) || 1;
      const totalFinalPrice = finalPrice * qty;
      
      const { error } = await supabase
        .from('product_orders')
        .insert([{
          email: buyerEmail,
          items: buyingProduct.name + ` (${qty}x)`,
          total_harga: totalFinalPrice,
          status: 'Diproses'
        }]);
        
      if (error) throw error;
      
      if (buyingProduct.id) {
        const { data: pData } = await supabase.from('products').select('stok').eq('id', buyingProduct.id).single();
        const currentStok = pData ? pData.stok : 0;
        if (currentStok >= qty) {
          await supabase.from('products').update({ stok: currentStok - qty }).eq('id', buyingProduct.id);
          
          setDynamicProducts(prev => prev.map(p => 
            p.id === buyingProduct.id ? { ...p, stok: currentStok - qty } : p
          ));
        }
      }

      if (buyingProduct.promoCode) {
        await supabase.from('promos').update({ status: 'Terpakai' }).eq('code', buyingProduct.promoCode);
      }
      
      setBuySuccess(true);
      setTimeout(() => {
        setBuySuccess(false);
        setBuyingProduct(null);
      }, 2000);
    } catch (error) {
      console.error("Error ordering product:", error);
      alert(`Gagal memesan produk: ${error.message || 'Kesalahan pada database'}. Pastikan tabel product_orders sudah dibuat.`);
    } finally {
      setIsBuying(false);
    }
  };

  const handleCekStatus = async (e) => {
    e.preventDefault();
    if (!userSession) {
      alert('Silakan login sebagai member terlebih dahulu untuk mengecek status pesanan.');
      navigate('/login-member');
      return;
    }
    if (!bookingWa) {
      setCekStatusError('Masukkan Email terlebih dahulu.');
      setTimeout(() => setCekStatusError(''), 3000);
      return;
    }
    
    // Validasi email di database
    try {
      const emailInput = bookingWa.toLowerCase().trim();
      const { data: userExists } = await supabase.from('users').select('id').eq('email', emailInput).single();
      if (!userExists) {
        alert("Email tidak terdata");
        navigate('/register-member');
        return;
      }
    } catch (err) {
      alert("Email tidak terdata");
      navigate('/register-member');
      return;
    }
    
    setContactStatus('submitting');
    setCekStatusError('');
    setCekStatusResult('');
    setCekStatusData(null);
    
    try {
      const emailInput = bookingWa.toLowerCase().trim();
      
      const { data: bookings, error: bookingsError } = await supabase
        .from('haircut_bookings')
        .select('*')
        .eq('email', emailInput)
        .order('created_at', { ascending: false });
        
      const { data: orders, error: ordersError } = await supabase
        .from('product_orders')
        .select('*')
        .eq('email', emailInput)
        .order('created_at', { ascending: false });
        
      if (bookingsError) throw bookingsError;
      if (ordersError) throw ordersError;
      
      if ((bookings && bookings.length > 0) || (orders && orders.length > 0)) {
        setContactStatus('success');
        setCekStatusData({ bookings: bookings || [], orders: orders || [] });
      } else {
        setContactStatus('idle');
        setCekStatusError('Tidak ada layanan atau produk yang di pesan.');
      }
    } catch (error) {
      console.error("Error checking status:", error);
      setContactStatus('idle');
      setCekStatusError('Gagal memeriksa status koneksi ke database.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userSession) return;
    setIsSubmittingReview(true);
    
    try {
      if (reviewForm.id) {
        // UPDATE
        const { error } = await supabase
          .from('haircut_reviews')
          .update({ rating: reviewForm.rating, review: reviewForm.review })
          .eq('id', reviewForm.id);
        if (error) throw error;
      } else {
        // CREATE
        const { error } = await supabase
          .from('haircut_reviews')
          .insert([{
            email: userSession,
            name: userSession.split('@')[0], 
            rating: reviewForm.rating,
            review: reviewForm.review
          }]);
        if (error) throw error;
      }
      
      const { data } = await supabase.from('haircut_reviews').select('*').order('created_at', { ascending: false });
      if (data) setReviewsData(data);
      
      setIsReviewModalOpen(false);
      setReviewForm({ id: null, rating: 5, review: '' });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(`Gagal menyimpan ulasan: ${error.message}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) return;
    try {
      const { error } = await supabase.from('haircut_reviews').delete().eq('id', id);
      if (error) throw error;
      setReviewsData(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(`Gagal menghapus ulasan: ${error.message}`);
    }
  };

  const menuLinks = [
    { href: "#about", label: "Tentang" },
    { href: "#services", label: "Layanan" },
    { href: "#styles", label: "Style" },
    { href: "#products", label: "Produk" },
    { href: "#vouchers", label: "Promo" },
    { href: "#kapsters", label: "Kapster" },
    { href: "#contact", label: "Status" },
    { href: "#reviews", label: "Ulasan" }
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

  // Data 20 Style Rambut Lokal HD dari folder public/img
  const hairStyles = [
    { name: "Textured Crop", img: "/img/s1.jpg" },
    { name: "Classic Pompadour", img: "/img/s2.jpg" },
    { name: "Modern Quiff", img: "/img/s3.jpg" },
    { name: "Clean Buzz Cut", img: "/img/s4.jpg" },
    { name: "Skin Fade", img: "/img/s5.jpg" },
    { name: "Executive Contour", img: "/img/s6.jpg" },
    { name: "Slick Back Fade", img: "/img/s7.jpg" },
    { name: "Modern Mullet", img: "/img/s8.jpg" },
    { name: "Side Part", img: "/img/s9.jpg" },
    { name: "French Crop", img: "/img/s10.jpg" },
    { name: "Icy White Dye", img: "/img/s11.jpg" },
    { name: "Wavy Long Quiff", img: "/img/s12.jpg" },
    { name: "Combed Back", img: "/img/s13.jpg" },
    { name: "Spiky Modern", img: "/img/s14.jpg" },
    { name: "Drop Fade", img: "/img/s15.jpg" },
    { name: "Two Block Cut", img: "/img/s16.jpg" },
    { name: "Afro Textured", img: "/img/s17.jpg" },
    { name: "Classic Taper", img: "/img/s18.jpg" },
    { name: "Bowl Cut Modern", img: "/img/s19.jpg" },
    { name: "Caesar Cut", img: "/img/s20.jpg" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans scroll-smooth selection:bg-gray-800 selection:text-white overflow-x-hidden">
      
      {/* Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-[88px] right-6 z-50 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        } ${
          isBackToTopWhite ? 'bg-white text-black hover:bg-zinc-200' : 'bg-gray-900 text-white hover:bg-black'
        }`}
        aria-label="Back to top"
      >
        <FaArrowRight className="transform -rotate-90" />
      </button>

      {/* WhatsApp CS Button */}
      <a 
        href="https://wa.me/6281234567890?text=Halo%20Haircut,%20saya%20ingin%20konsultasi%20atau%20booking%20jadwal%20potong%20rambut."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-green-600 transition-all duration-300 hover:scale-110"
        aria-label="Chat WhatsApp CS"
      >
        <FaWhatsapp className="text-2xl" />
      </a>

      {/* ============ LIQUID GLASS NAVBAR ============ */}
      <header className="fixed w-full z-50 flex justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <nav 
          className={`flex items-center justify-between transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled 
              ? 'w-[98%] max-w-7xl mt-4 md:mt-6 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-full px-6 md:px-8 py-3' 
              : 'w-full mt-0 bg-gradient-to-b from-[#0A0F1A]/90 to-transparent border-b border-transparent px-6 md:px-12 py-5 md:py-8 rounded-none'
          }`}
        >
          
          <Link to="/" className="flex items-center gap-3 group cursor-pointer z-50">
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full md:rounded-xl flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-[15deg] ${
              isScrolled 
                ? 'bg-gradient-to-br from-gray-900 to-black shadow-md shadow-gray-300' 
                : 'bg-white/10 backdrop-blur-md border border-white/20'
            }`}>
              <FaCut className={`text-base md:text-lg transition-colors duration-500 text-white`} />
            </div>
            <span className={`text-xl md:text-2xl font-black tracking-tight flex items-baseline transition-colors duration-500 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Hair<span className={isScrolled ? 'text-gray-500' : 'text-gray-400'}>Cut.</span>
            </span>
          </Link>
          
          <div className={`hidden lg:flex items-center gap-7 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors duration-500 ${
            isScrolled ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {menuLinks.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                onClick={(e) => {
                  e.preventDefault();
                  const targetId = item.href.substring(1);
                  const elem = document.getElementById(targetId);
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative py-2 group"
              >
                <span className={`transition-colors duration-300 ${isScrolled ? 'group-hover:text-black' : 'group-hover:text-white'}`}>
                  {item.label}
                </span>
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 ease-out group-hover:w-full rounded-full ${isScrolled ? 'bg-black' : 'bg-gray-400'}`} />
              </a>
            ))}
          </div>

         <div className="flex items-center gap-3 z-50">
            {/* Tombol Login Member (Ditambahkan) */}
            <Link 
              to="/login-member" 
              className={`hidden lg:inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-full transition-all duration-500 ease-out hover:-translate-y-0.5 shadow-lg ${
                isScrolled 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <span>Member</span>
              <FaUserTie className="text-[10px]" />
            </Link>

            {/* Tombol Login Admin (Diperbarui tampilannya agar beda dengan Member) */}
            <Link 
              to="/login" 
              className={`hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-500 ease-out hover:-translate-y-0.5 ${
                isScrolled 
                  ? 'bg-white text-gray-700 border border-gray-200 hover:border-gray-900 hover:text-black shadow-sm' 
                  : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-black shadow-lg'
              }`}
            >
              <span>Admin</span>
              <FaShieldAlt className="text-[10px]" />
            </Link>

            {/* Tombol Hamburger Mobile */}
            <button 
              className={`lg:hidden p-2.5 text-xl rounded-full transition-all duration-300 ${
                isScrolled ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white border border-white/20'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <div 
            className={`absolute top-full left-0 w-full mt-3 bg-white/95 backdrop-blur-2xl shadow-2xl rounded-[2rem] border border-gray-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden flex flex-col overflow-hidden ${
              isMobileMenuOpen ? 'max-h-[600px] opacity-100 translate-y-0 visible' : 'max-h-0 opacity-0 -translate-y-4 invisible'
            }`}
          >
            <div className="p-4 flex flex-col gap-2">
              {menuLinks.map((item) => (
                <a 
                  key={item.label}
                  href={item.href} 
                  onClick={(e) => {
                    e.preventDefault();
                    const targetId = item.href.substring(1);
                    const elem = document.getElementById(targetId);
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-widest hover:text-black hover:bg-gray-100 rounded-2xl transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
              <div className="px-2 pt-4 mt-2 border-t border-gray-200 flex flex-col gap-3">
                <Link 
                  to="/login-member"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-black text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-colors duration-300"
                >
                  <FaUserTie className="text-sm" /> Login Member
                </Link>
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-800 font-bold py-4 rounded-2xl border border-gray-200 hover:bg-gray-200 transition-colors duration-300"
                >
                  <FaShieldAlt className="text-sm" /> Login Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ============ HERO SECTION ============ */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-[kenburns_20s_ease-in-out_infinite alternate]"
          style={{ backgroundImage: "url('/img/bb6.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#0A0F1A]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center mt-16 md:mt-24">
          <FadeInSection delay={0}>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gray-300 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-8 md:mb-12 shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
              The Premium Standard
            </div>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black text-white text-center leading-[1.1] md:leading-tight mb-8 md:mb-10 tracking-tighter drop-shadow-2xl">
              Grooming <br className="hidden sm:block" />
              <span className="italic font-serif font-light text-gray-300">Eksklusif.</span>
            </h1>
          </FadeInSection>

          <FadeInSection delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4 sm:px-0">
              <Link 
                to={userSession ? "/booking" : "/login-member"} 
                state={{ from: '/booking' }}
                className="group w-full sm:w-auto px-10 py-4 font-bold text-black bg-white rounded-full transition-all duration-500 hover:bg-gray-200 hover:-translate-y-1 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Booking Sekarang
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a 
                href="#services" 
                className="group w-full sm:w-auto px-10 py-4 font-bold text-white bg-black/30 backdrop-blur-md border border-white/30 rounded-full hover:bg-white/20 transition-all duration-500 hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                Lihat Layanan
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ============ ABOUT SECTION ============ */}
      <section id="about" className="py-20 md:py-32 px-4 md:px-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #9CA3AF 1px, transparent 1px), radial-gradient(circle at 75% 75%, #9CA3AF 1px, transparent 1px)', backgroundSize: '70px 70px' }} />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
          <div className="w-full lg:w-1/2 relative">
            <FadeInSection delay={0}>
              <TiltCard maxTilt={5}>
                <div className="relative rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 aspect-[4/3] md:aspect-[16/10] lg:aspect-square">
                  <img src="/img/bb2.jpg" alt="HairCut Interior" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </TiltCard>
            </FadeInSection>
            <FadeInSection delay={200} className="absolute -bottom-6 -right-2 md:-bottom-8 md:-right-6">
              <div className="bg-white/95 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 rounded-full flex items-center justify-center">
                    <FaAward className="text-white text-xl md:text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg md:text-xl">Est. 2024</h4>
                    <p className="text-xs md:text-sm font-medium text-gray-500">Premium Quality</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
          <div className="w-full lg:w-1/2">
            <FadeInSection delay={100} direction="right">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-4 md:mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" /> Tentang HairCut
              </span>
            </FadeInSection>
            <FadeInSection delay={150} direction="right">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
                Cerita Di Balik <br/>
                <span className="text-gray-500">Keahlian Kami.</span>
              </h2>
            </FadeInSection>
            <FadeInSection delay={200} direction="right">
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6 font-medium">
                Berdiri sejak 2024, HairCut lahir dari visi menciptakan ruang eksklusif bagi pria untuk bersantai, menikmati pelayanan kelas satu, dan tampil dengan versi terbaik diri mereka.
              </p>
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
                {[
                  { icon: FaShieldAlt, text: "Higienis" },
                  { icon: FaAward, text: "Bersertifikasi" },
                  { icon: FaSmile, text: "Maskulin" },
                  { icon: FaStar, text: "Klasik & Modern" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 md:gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group cursor-pointer">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm border border-gray-200">
                      <item.icon className="text-gray-700 text-sm" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link to="/login-member" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-all duration-200 hover:-translate-y-1 shadow-lg text-sm">
                  Daftar Member <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ============ SERVICES SECTION ============ */}
      <section id="services" className="py-20 md:py-32 px-4 md:px-12 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto">
          <FadeInSection delay={0}>
            <div className="text-center mb-12 md:mb-20">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-4">
                <FaCut className="text-xs" /> Our Services
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Layanan <span className="text-gray-500">Signature</span>
              </h2>
              <p className="text-gray-500 mt-3 md:mt-4 text-base md:text-lg max-w-2xl mx-auto">
                Pengalaman grooming premium dari ujung rambut hingga wajah.
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {isLoadingDynamic ? (
              <div className="col-span-full text-center py-10 font-bold text-slate-500">Loading Services...</div>
            ) : dynamicServices.map((service, idx) => {
              const isFeatured = idx === 0; // Highlight the first one
              const categoryLabels = ['Premium', 'Signature', 'Classic', 'Exclusive', 'Express', 'Special'];
              const displayCategory = categoryLabels[idx % categoryLabels.length];
              
              return (
                <FadeInSection delay={idx * 80} key={idx} direction="scale" duration={600}>
                  <TiltCard maxTilt={6} className="h-full">
                    <div className={`relative p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] transition-all duration-300 group cursor-pointer h-full flex flex-col ${isFeatured ? 'bg-gray-900 shadow-xl border border-gray-800' : 'bg-white shadow-md hover:shadow-xl border border-gray-200'}`}>
                      <div className={`absolute top-0 right-0 text-[10px] md:text-xs font-black px-4 md:px-5 py-1.5 md:py-2 rounded-bl-2xl shadow-sm ${isFeatured ? 'bg-white text-black' : 'bg-gray-100 text-gray-700'}`}>
                        {displayCategory}
                      </div>
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-5 md:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${isFeatured ? 'bg-white/10' : 'bg-gray-100'}`}>
                        <FaCut className={`text-xl md:text-2xl ${isFeatured ? 'text-white' : 'text-gray-800'}`} />
                      </div>
                      <h3 className={`text-xl font-bold mb-3 ${isFeatured ? 'text-white' : 'text-gray-900'}`}>{service.name}</h3>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 flex-grow"><FaClock /><span>{service.duration || '30 Min'}</span></div>
                      
                      <div className={`pt-4 border-t mt-auto flex flex-col gap-4 ${isFeatured ? 'border-gray-800' : 'border-gray-100'}`}>
                        <span className={`font-black text-2xl ${isFeatured ? 'text-white' : 'text-gray-900'}`}>Rp {service.price?.toLocaleString('id-ID')}</span>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedService({
                                title: service.name,
                                desc: service.description,
                                duration: service.duration,
                                price: `Rp ${service.price?.toLocaleString('id-ID')}`
                            }); 
                          }} 
                          className={`w-full py-3 text-sm font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-md flex items-center justify-center gap-2 ${isFeatured ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-black'}`}
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODAL LAYANAN */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black mb-2">{selectedService?.title}</DialogTitle>
            <DialogDescription className="text-gray-400 text-sm leading-relaxed">
              {selectedService?.desc}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex justify-between items-center bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 text-gray-300">
                <FaClock className="text-gray-500" /> 
                <span className="text-sm font-medium">Estimasi Waktu</span>
              </div>
              <span className="font-bold">{selectedService?.duration}</span>
            </div>
            
            <div className="flex justify-between items-center bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 text-gray-300">
                <FaCut className="text-gray-500" /> 
                <span className="text-sm font-medium">Harga Layanan</span>
              </div>
              <span className="font-black text-lg">{selectedService?.price}</span>
            </div>
          </div>
          
          <div className="mt-8 flex gap-3">
            <Link 
              to="/booking" 
              state={{ preSelectedService: selectedService }}
              onClick={(e) => {
                if (!userSession) {
                  e.preventDefault();
                  alert('Silakan login sebagai member terlebih dahulu untuk memesan layanan.');
                  navigate('/login-member');
                }
              }}
              className="flex-1 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Booking Sekarang <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL KAPSTER */}
      <Dialog open={!!selectedKapster} onOpenChange={(open) => !open && setSelectedKapster(null)}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4 text-left">
              <img src={selectedKapster?.img_url || 'https://i.pravatar.cc/150'} alt={selectedKapster?.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-700" />
              <div>
                <DialogTitle className="text-2xl font-black">{selectedKapster?.name}</DialogTitle>
                <div className="text-emerald-400 text-sm font-bold mt-1">{selectedKapster?.specialty || 'Senior Barber'}</div>
              </div>
            </div>
            <DialogDescription className="text-gray-400 text-sm leading-relaxed text-left">
              {selectedKapster?.description || 'Profesional berpengalaman yang siap memberikan pelayanan maksimal untuk penampilan terbaik Anda.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 mt-4 text-left">
            <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
              <span className="text-gray-400 text-sm">Pengalaman</span>
              <span className="font-bold">{selectedKapster?.experience || '3 Tahun'}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
              <span className="text-gray-400 text-sm">Jadwal Shift</span>
              <span className="font-bold text-right text-sm">{selectedKapster?.shift_days || 'Senin-Minggu'}<br/><span className="text-xs text-gray-500">{selectedKapster?.shift_hours || '10:00-20:00'}</span></span>
            </div>
            <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700">
              <span className="text-gray-400 text-sm">Tarif Mulai</span>
              <span className="font-black text-lg text-emerald-400">Rp {selectedKapster?.base_price?.toLocaleString('id-ID') || '50.000'}</span>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <Link 
              to="/booking" 
              onClick={(e) => {
                if (!userSession) {
                  e.preventDefault();
                  alert('Silakan login sebagai member terlebih dahulu untuk memesan layanan.');
                  navigate('/login-member');
                }
              }}
              className="flex w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors items-center justify-center gap-2"
            >
              Booking {selectedKapster?.name?.split(' ')[0]} <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </DialogContent>
      </Dialog>

    {/* ============ STYLE SECTION (Animasi Vertical Marquee) ============ */}
      <section id="styles" className="py-20 md:py-32 px-4 md:px-12 bg-white relative border-t border-gray-100 overflow-hidden">
        
     {/* CSS Khusus untuk Animasi Marquee */}
        <style>{`
          @keyframes marqueeUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          @keyframes marqueeDown {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }
          
          /* WAKTU DIPERCEPAT MENJADI 15s (sebelumnya 30s) */
          .animate-marquee-up {
            animation: marqueeUp 10s linear infinite; 
          }
          .animate-marquee-down {
            animation: marqueeDown 10s linear infinite;
          }

          /* Pause animasi saat di hover (Opsional, agar user bisa melihat detail) */
          .pause-marquee:hover .animate-marquee-up,
          .pause-marquee:hover .animate-marquee-down {
            animation-play-state: paused;
          }
        `}</style>

        <div className="max-w-7xl mx-auto">
          <FadeInSection delay={0}>
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-4">
                <FaStar className="text-yellow-500" /> Inspiration
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                Model Rambut <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800">Pria</span>
              </h2>
              <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                Temukan gaya rambut yang paling sesuai dengan karakter dan bentuk wajah Anda.
              </p>
            </div>
          </FadeInSection>

          {/* Area Scrolling Marquee */}
          <FadeInSection delay={100}>
            {/* Menggunakan flex dan height tetap agar gambar bisa scroll di dalamnya */}
            <div className="flex gap-4 md:gap-6 h-[500px] md:h-[700px] overflow-hidden pause-marquee relative">
              
              {/* Efek Gradasi Putih Atas & Bawah agar scroll terlihat lebih smooth */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

              {/* Kolom 1 (Bergerak ke Atas) */}
              <div className="flex-1 flex flex-col gap-4 md:gap-6 animate-marquee-up">
                {/* Kita render 2 kali (asli & duplikat) agar scroll tidak pernah putus */}
                {[...hairStyles.slice(0, 4), ...hairStyles.slice(0, 4)].map((style, idx) => (
                  <div key={idx} className="w-full">
                    <TiltCard maxTilt={5}>
                      <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 cursor-pointer shadow-sm">
                        <img src={style.img} alt={style.name} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{style.name}</h3>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>

              {/* Kolom 2 (Bergerak ke Bawah) */}
              <div className="flex-1 flex flex-col gap-4 md:gap-6 animate-marquee-down">
                {[...hairStyles.slice(4, 8), ...hairStyles.slice(4, 8)].map((style, idx) => (
                  <div key={idx} className="w-full">
                    <TiltCard maxTilt={5}>
                      <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100 cursor-pointer shadow-sm">
                        <img src={style.img} alt={style.name} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{style.name}</h3>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>

              {/* Kolom 3 (Bergerak ke Atas) - Disembunyikan di Mobile kecil */}
              <div className="hidden sm:flex flex-1 flex-col gap-4 md:gap-6 animate-marquee-up">
                {[...hairStyles.slice(8, 12), ...hairStyles.slice(8, 12)].map((style, idx) => (
                  <div key={idx} className="w-full">
                    <TiltCard maxTilt={5}>
                      <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 cursor-pointer shadow-sm">
                        <img src={style.img} alt={style.name} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{style.name}</h3>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>

              {/* Kolom 4 (Bergerak ke Bawah) - Disembunyikan di Tablet ke bawah */}
              <div className="hidden md:flex flex-1 flex-col gap-4 md:gap-6 animate-marquee-down">
                {[...hairStyles.slice(12, 16), ...hairStyles.slice(12, 16)].map((style, idx) => (
                  <div key={idx} className="w-full">
                    <TiltCard maxTilt={5}>
                      <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100 cursor-pointer shadow-sm">
                        <img src={style.img} alt={style.name} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{style.name}</h3>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>

              {/* Kolom 5 (Bergerak ke Atas) - Hanya muncul di Desktop Besar */}
              <div className="hidden lg:flex flex-1 flex-col gap-4 md:gap-6 animate-marquee-up">
                {[...hairStyles.slice(16, 20), ...hairStyles.slice(16, 20)].map((style, idx) => (
                  <div key={idx} className="w-full">
                    <TiltCard maxTilt={5}>
                      <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 cursor-pointer shadow-sm">
                        <img src={style.img} alt={style.name} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{style.name}</h3>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>

            </div>
          </FadeInSection>
        </div>
      </section>
         

      {/* ============ PROMO SECTION ============ */}



      <section id="vouchers" className="py-20 md:py-28 px-4 md:px-12 bg-zinc-800 relative overflow-hidden border-t border-zinc-700">



        <div className="absolute inset-0 opacity-10">



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



              <p className="text-gray-300 text-base md:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">



                Daftar sebagai member HairCut sekarang dan nikmati diskon kunjungan pertama serta potongan harga produk eksklusif.



              </p>



              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">



                <Link to="/register" className="px-6 py-3.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all duration-200 hover:-translate-y-1 shadow-xl text-sm flex items-center justify-center gap-2">



                  <FaRocket className="text-gray-800" /> Daftar & Klaim <FaArrowRight className="text-xs" />



                </Link>



                <button className="px-6 py-3.5 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-200 hover:-translate-y-1 text-sm flex items-center justify-center gap-2">



                  <FaPercentage /> Lihat Semua Promo



                </button>



              </div>



            </FadeInSection>



          </div>



          <div className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-5">
            {isLoadingDynamic ? (
              <div className="col-span-full text-center py-10 font-bold text-white">Loading Promos...</div>
            ) : dynamicPromos.map((promo, idx) => {
              const colors = [
                { color: "yellow", borderColor: "border-yellow-400", dotColor: "bg-yellow-400" },
                { color: "emerald", borderColor: "border-emerald-400", dotColor: "bg-emerald-400" },
                { color: "blue", borderColor: "border-blue-400", dotColor: "bg-blue-400" },
                { color: "purple", borderColor: "border-purple-400", dotColor: "bg-purple-400" },
              ];
              const style = colors[idx % colors.length];
              
              return (
                <FadeInSection delay={idx * 150} direction="right" key={idx} duration={500}>
                  <TiltCard maxTilt={3}>
                    <div className={`bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 flex items-center justify-between border-l-[10px] md:border-l-[14px] ${style.borderColor} shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}>
                      <div className={`absolute -left-[12px] md:-left-[16px] top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 ${style.dotColor} rounded-full animate-pulse`} />
                      <div className="flex flex-col gap-1 flex-1">
                        <p className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Promo Khusus</p>
                        <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1">{promo.discount} {promo.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{promo.description || '*Syarat dan ketentuan berlaku'}</p>
                        <div className="flex items-center justify-between gap-3 mt-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-[10px]">
                            <span className="text-gray-500">Kode:</span>
                            <span className="font-bold text-black">{promo.code}</span>
                          </span>
                          <button 
                            onClick={(e) => { e.preventDefault(); handlePromoClaim(promo); }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg text-white ${style.dotColor} hover:brightness-90 transition-all shadow-sm whitespace-nowrap`}
                          >
                            Klaim Voucher
                          </button>
                        </div>
                      </div>
                      <div className="text-4xl md:text-5xl opacity-20 group-hover:opacity-30 transition-opacity duration-200">
                        {style.color === 'yellow' ? <FaTicketAlt className="text-yellow-500" /> : <FaShoppingBag className={`text-${style.color}-500`} />}
                      </div>
                    </div>
                  </TiltCard>
                </FadeInSection>
              );
            })}
          </div>



        </div>



      </section>

      {/* ============ PRODUCTS SECTION ============ */}
      <section id="products" className="py-20 md:py-32 px-4 md:px-12 bg-gray-50 relative overflow-hidden border-t border-gray-200">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #9CA3AF 1.5px, transparent 1.5px), radial-gradient(circle at 80% 20%, #9CA3AF 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInSection delay={0}>
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-4 text-center md:text-left">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-4 border border-gray-200 shadow-sm">
                  <FaShoppingBag className="text-xs" /> Our Collection
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  HairCare <span className="text-gray-400">Products</span>
                </h2>
                <p className="text-gray-500 mt-3 text-base md:text-lg font-medium">Bawa pulang gaya andalan Anda dengan produk premium pilihan.</p>
              </div>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
            {isLoadingDynamic ? (
              <div className="col-span-full text-center py-10 font-bold text-slate-500">Loading Products...</div>
            ) : dynamicProducts.map((prod, idx) => (
              <ProductCard 
                key={idx} 
                product={{
                  ...prod,
                  price: typeof prod.price === 'number' ? `Rp ${prod.price.toLocaleString('id-ID')}` : prod.price,
                  img: prod.image_url || prod.img_url || prod.img || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                  type: prod.category || prod.type || 'Treatment',
                  rating: prod.rating || 4.8,
                  reviews: prod.reviews || 120,
                  sold: prod.sold || 350
                }} 
                index={idx} 
                onBuy={(product) => {
                  if (!userSession) {
                    alert('Silakan login sebagai member terlebih dahulu untuk membeli produk.');
                    navigate('/login-member');
                    return;
                  }
                  setBuyingProduct(product);
                  setBuyQuantity(1);
                  setBuyStep(1);
                  setProductPromoInput('');
                  setProductPromoError('');
                }}
              />
            ))}
          </div>
          
          <FadeInSection delay={300}>
            <div className="text-center mt-12 md:mt-16">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <FaShoppingBag className="text-gray-600 text-xl" />
                <p className="text-sm font-semibold text-gray-700">
                  Gratis ongkir untuk pembelian di atas <span className="text-black font-black">Rp 200.000</span>
                </p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ============ KAPSTERS SECTION ============ */}
      <section id="kapsters" className="py-20 md:py-32 px-4 md:px-12 bg-white relative overflow-hidden border-t border-gray-200">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInSection delay={0}>
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-4">
                <FaCut className="text-gray-500" /> Expert Team
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800">Kapsters</span>
              </h2>
              <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                Pilih kapster profesional kami yang siap memberikan pengalaman grooming terbaik untuk Anda.
              </p>
            </div>
          </FadeInSection>

          <style>{`
            @keyframes marqueeLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marqueeRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            
            .animate-marquee-left {
              animation: marqueeLeft 90s linear infinite;
            }
            .animate-marquee-right {
              animation: marqueeRight 90s linear infinite;
            }

            .pause-marquee-hover:hover .animate-marquee-left,
            .pause-marquee-hover:hover .animate-marquee-right {
              animation-play-state: paused;
            }
          `}</style>

          <div className="w-full overflow-hidden pause-marquee-hover relative">
            {/* Gradasi Kiri Kanan untuk efek smooth */}
            <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {isLoadingDynamic ? (
              <div className="text-center py-10 font-bold text-slate-500">Loading Kapsters...</div>
            ) : dynamicKapsters.length === 0 ? (
              <div className="text-center py-10 font-bold text-slate-500">Belum ada kapster.</div>
            ) : (
              <div className="flex flex-col gap-6 md:gap-8">
                {/* Baris 1: Bergerak ke Kiri */}
                <div className="flex gap-6 md:gap-8 w-max animate-marquee-left">
                  {/* Kita duplicate agar tidak pernah putus scrollnya */}
                  {[...dynamicKapsters.filter((_, i) => i % 2 === 0), ...dynamicKapsters.filter((_, i) => i % 2 === 0), ...dynamicKapsters.filter((_, i) => i % 2 === 0), ...dynamicKapsters.filter((_, i) => i % 2 === 0)].map((kapster, idx) => (
                    <div key={`r1-${idx}`} className="w-[220px] md:w-[280px] flex-shrink-0">
                      <TiltCard maxTilt={5} className="h-full">
                        <div className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] bg-gray-100 shadow-sm border border-gray-100">
                          <img src={kapster.img_url || 'https://i.pravatar.cc/150'} alt={kapster.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300" />
                          <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="flex items-center gap-1.5 mb-1 opacity-80">
                              <FaStar className="text-amber-400 text-xs" />
                              <span className="text-white text-xs font-bold">4.8</span>
                              <span className="text-gray-300 text-[10px] mx-1">•</span>
                              <span className="text-gray-300 text-[10px] uppercase font-bold tracking-wider">{kapster.experience || '3 THN'}</span>
                            </div>
                            <h3 className="text-white font-black text-xl md:text-2xl leading-tight mb-1">{kapster.name}</h3>
                            <p className="text-gray-300 text-sm font-medium mb-4">{kapster.specialty || 'Senior Barber'}</p>
                            
                            <button 
                              onClick={() => setSelectedKapster(kapster)}
                              className="w-full bg-white/10 hover:bg-white text-white hover:text-black font-bold py-2.5 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 text-sm"
                            >
                              Lihat Detail
                            </button>
                          </div>
                        </div>
                      </TiltCard>
                    </div>
                  ))}
                </div>

                {/* Baris 2: Bergerak ke Kanan */}
                {dynamicKapsters.length > 1 && (
                  <div className="flex gap-6 md:gap-8 w-max animate-marquee-right">
                    {[...dynamicKapsters.filter((_, i) => i % 2 !== 0), ...dynamicKapsters.filter((_, i) => i % 2 !== 0), ...dynamicKapsters.filter((_, i) => i % 2 !== 0), ...dynamicKapsters.filter((_, i) => i % 2 !== 0)].map((kapster, idx) => (
                      <div key={`r2-${idx}`} className="w-[220px] md:w-[280px] flex-shrink-0">
                        <TiltCard maxTilt={5} className="h-full">
                          <div className="group relative rounded-[2rem] overflow-hidden aspect-[4/5] bg-gray-100 shadow-sm border border-gray-100">
                            <img src={kapster.img_url || 'https://i.pravatar.cc/150'} alt={kapster.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300" />
                            <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              <div className="flex items-center gap-1.5 mb-1 opacity-80">
                                <FaStar className="text-amber-400 text-xs" />
                                <span className="text-white text-xs font-bold">4.8</span>
                                <span className="text-gray-300 text-[10px] mx-1">•</span>
                                <span className="text-gray-300 text-[10px] uppercase font-bold tracking-wider">{kapster.experience || '3 THN'}</span>
                              </div>
                              <h3 className="text-white font-black text-xl md:text-2xl leading-tight mb-1">{kapster.name}</h3>
                              <p className="text-gray-300 text-sm font-medium mb-4">{kapster.specialty || 'Senior Barber'}</p>
                              
                              <button 
                                onClick={() => setSelectedKapster(kapster)}
                                className="w-full bg-white/10 hover:bg-white text-white hover:text-black font-bold py-2.5 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 text-sm"
                              >
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        </TiltCard>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ CONTACT SECTION (SPLIT LAYOUT) ============ */}
      <section id="contact" className="py-20 md:py-32 relative bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row border border-gray-100">
            
            {/* LEFT: Info Column (Dark) */}
            <div className="w-full lg:w-5/12 p-10 md:p-16 bg-zinc-900 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
              
              <FadeInSection delay={0} direction="right">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-8 border border-white/20 backdrop-blur-md shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Let's Connect
                </span>
                
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
                  Hubungi <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">HairCut.</span>
                </h2>
                
                <p className="text-gray-400 text-base md:text-lg mb-12 leading-relaxed max-w-sm">
                  Punya pertanyaan tentang layanan atau ingin konsultasi gaya rambut? Tim expert kami siap membantu Anda tampil maksimal.
                </p>

                <div className="space-y-8 relative">
                  <div className="absolute left-[23px] top-[24px] bottom-[24px] w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden md:block" />

                  {[
                    { icon: FaMapMarkerAlt, title: "Headquarters", detail: "Jl. Premium Barbershop No. 123", subDetail: "Jakarta Selatan, 12345" },
                    { icon: FaPhone, title: "Direct Line", detail: "+62 812 3456 7890", subDetail: "Senin - Minggu (09:00 - 21:00)" },
                    { icon: FaEnvelope, title: "Email Address", detail: "hello@haircut.id", subDetail: "Kami membalas dalam 24 jam" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-6 group relative z-10">
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0 border border-zinc-800 shadow-lg group-hover:scale-110 group-hover:bg-white group-hover:border-white transition-all duration-500 overflow-hidden">
                        <item.icon className="text-gray-400 text-lg group-hover:text-black transition-colors duration-500 group-hover:rotate-12" />
                      </div>
                      <div className="pt-1">
                        <h4 className="font-bold text-white mb-1.5 tracking-wide text-lg group-hover:text-gray-300 transition-colors">{item.title}</h4>
                        <p className="text-sm font-medium text-gray-300">{item.detail}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.subDetail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeInSection>
            </div>

            {/* RIGHT: Form Column (Light) */}
            <div className="w-full lg:w-7/12 p-10 md:p-16 bg-white relative">
              <FadeInSection delay={200} direction="left">
                
                <div className="mb-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Cek Status Booking</h3>
                  <p className="text-gray-500 text-sm">Masukkan Email atau No WA Anda untuk masuk ke Dashboard Member dan melihat status antrean.</p>
                </div>
                
                <form className="space-y-8" onSubmit={handleCekStatus}>
                  <div className="relative group">
                    <input 
                      type="text" 
                      id="email"
                      required
                      value={bookingWa}
                      onChange={(e) => setBookingWa(e.target.value)}
                      disabled={contactStatus !== 'idle'}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all peer text-sm" 
                      placeholder="contoh@email.com / 081234567890" 
                    />
                    <label htmlFor="email" className="absolute -top-6 left-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-all">
                      Email / Nomor WA
                    </label>
                    {cekStatusResult && (
                      <p className="absolute -bottom-6 left-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                        {cekStatusResult}
                      </p>
                    )}
                    {cekStatusError && (
                      <p className="absolute -bottom-6 left-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                        {cekStatusError}
                      </p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={contactStatus !== 'idle'}
                    className={`w-full font-black uppercase tracking-widest rounded-2xl py-5 transition-all duration-300 flex items-center justify-center gap-3 text-xs group mt-4 ${
                      contactStatus === 'idle' 
                        ? 'bg-black text-white hover:bg-zinc-800 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-1' 
                        : contactStatus === 'submitting'
                          ? 'bg-gray-200 text-gray-500 cursor-wait'
                          : 'bg-green-500 text-white shadow-[0_10px_20px_rgba(34,197,94,0.2)]'
                    }`}
                  >
                    {contactStatus === 'idle' && (
                      <>Cek Status Sekarang <FaSearch className="transition-transform duration-300 group-hover:scale-110" /></>
                    )}
                    {contactStatus === 'submitting' && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                        Memeriksa Data...
                      </div>
                    )}
                    {contactStatus === 'success' && (
                      <>Mengalihkan... <FaCheckCircle className="text-lg" /></>
                    )}
                  </button>
                </form>

                {/* HASIL CEK STATUS RENDER DISINI */}
                {cekStatusData && (
                  <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {cekStatusData.bookings.length > 0 && (
                      <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FaCut className="text-black"/> Jadwal Booking Aktif</h4>
                        <div className="space-y-3">
                          {cekStatusData.bookings.map(b => (
                            <div key={b.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                              <div>
                                <p className="text-xs font-bold text-gray-800">{b.layanan}</p>
                                <p className="text-[10px] text-gray-500">{b.tanggal} • {b.waktu} • {b.kapster}</p>
                              </div>
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase">{b.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {cekStatusData.orders.length > 0 && (
                      <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FaShoppingBag className="text-black"/> Pesanan Produk</h4>
                        <div className="space-y-3">
                          {cekStatusData.orders.map(o => (
                            <div key={o.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                              <div>
                                <p className="text-xs font-bold text-gray-800 line-clamp-1">{o.items}</p>
                                <p className="text-[10px] text-gray-500">Rp {o.total_harga} • Resi: {o.resi || '-'}</p>
                              </div>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase">{o.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </FadeInSection>
            </div>
            
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIAL SECTION ============ */}
      <section id="reviews" className="py-20 md:py-32 bg-white relative border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <FadeInSection delay={0}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 gap-6">
              <div className="text-center md:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 font-bold rounded-full text-[10px] md:text-xs tracking-widest uppercase mb-4">
                  <FaStar className="text-yellow-500" /> Ulasan Pelanggan
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                  Apa Kata <span className="text-gray-500">Mereka</span>
                </h2>
              </div>
              {userSession && (
                <button 
                  onClick={() => {
                    setReviewForm({ id: null, rating: 5, review: '' });
                    setIsReviewModalOpen(true);
                  }}
                  className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg"
                >
                  <FaPen className="text-xs" /> Tulis Ulasan
                </button>
              )}
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(reviewsData.length > 0 ? reviewsData : testimonials).map((rev, idx) => (
              <FadeInSection key={rev.id || idx} delay={idx * 100}>
                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow relative group h-full flex flex-col">
                  
                  {/* Invisible CRUD */}
                  {userSession && rev.email === userSession && (
                    <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setReviewForm({ id: rev.id, rating: rev.rating, review: rev.review });
                          setIsReviewModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <FaPen className="text-sm" />
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(rev.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < rev.rating ? "text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-4 leading-relaxed">"{rev.review}"</p>
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-black text-gray-400 shadow-sm border border-gray-100">
                      {rev.avatar || (rev.name ? rev.name.substring(0, 2).toUpperCase() : "HC")}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{rev.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{rev.role || "Member"}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-black text-gray-400 py-12 md:py-16 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <FaCut className="text-black text-lg" />
                </div>
                <span className="text-xl font-black tracking-tight text-white">HairCut.</span>
              </div>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-4">Premium barbershop experience since 2024.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-600 text-xs" /><span>Jl. Premium Barbershop No. 123, Jakarta</span></div>
                <div className="flex items-center gap-2"><FaPhone className="text-gray-600 text-xs" /><span>+62 123 4567 89</span></div>
                <div className="flex items-center gap-2"><FaEnvelope className="text-gray-600 text-xs" /><span>info@haircut.id</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Menu</h4>
              <div className="flex flex-col gap-2">
                {menuLinks.map(link => (
                  <a key={link.label} href={link.href} className="text-gray-500 hover:text-white transition-colors duration-150 text-sm">{link.label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Ikuti Kami</h4>
              <div className="flex gap-3 mb-5">
                {[FaInstagram, FaTwitter, FaYoutube].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-150"><Icon /></a>
                ))}
              </div>
              <h4 className="font-bold text-white mb-2 text-sm">Jam Operasional</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span>Sen - Jum</span><span className="text-gray-500">09:00 - 21:00</span></div>
                <div className="flex justify-between"><span>Sabtu</span><span className="text-gray-500">10:00 - 20:00</span></div>
                <div className="flex justify-between"><span>Minggu</span><span className="text-gray-500">11:00 - 18:00</span></div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">© 2026 HairCut Barbershop. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-150">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-150">Terms</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-150">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
      <FloatingChat />
      
      {/* MODAL TULIS ULASAN */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative border border-slate-100">
            <div className="bg-slate-800 p-6 text-center text-white relative">
              <button 
                onClick={() => setIsReviewModalOpen(false)} 
                className="absolute top-3 right-3 p-3 z-50 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              >
                <FaTimes className="text-white text-lg" />
              </button>
              <h3 className="text-2xl font-black tracking-widest pt-4">{reviewForm.id ? "Edit Ulasan" : "Tulis Ulasan"}</h3>
            </div>
            <div className="p-8">
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-6 text-center">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Rating Anda</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <FaStar className={`text-3xl ${reviewForm.rating >= star ? "text-yellow-400" : "text-gray-200"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Ulasan</label>
                  <textarea 
                    required 
                    rows={4}
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-all resize-none" 
                    placeholder="Bagaimana pengalaman Anda?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-all flex justify-center items-center gap-2 disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {isSubmittingReview ? "Menyimpan..." : "Simpan Ulasan"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* MODAL CHECKOUT PRODUK */}
      {buyingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative border border-slate-100">
            <div className="bg-slate-800 p-6 text-center text-white relative overflow-hidden">
              <button 
                onClick={() => setBuyingProduct(null)} 
                className="absolute top-3 right-3 p-3 z-50 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              >
                <FaTimes className="text-white text-lg" />
              </button>
              <h3 className="text-2xl font-black tracking-widest relative z-10 pt-4">Checkout</h3>
            </div>
            <div className="p-8">
              <div className="flex gap-4 items-center mb-6 border-b border-gray-100 pb-6">
                <img src={buyingProduct.img} alt={buyingProduct.name} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">{buyingProduct.name}</h4>
                  {buyingProduct.promoCode ? (
                    <div className="mt-1">
                      <p className="text-xs text-emerald-600 font-bold">
                        Rp {(buyingProduct.finalPriceNum * buyQuantity).toLocaleString('id-ID')}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-gray-400 line-through">Rp {(buyingProduct.originalPriceNum * buyQuantity).toLocaleString('id-ID')}</p>
                        <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{buyingProduct.promoCode} Applied</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600 font-bold mt-1">
                      Rp {((buyingProduct.discount ? (parseInt(buyingProduct.price.replace(/\D/g, '')) * (1 - buyingProduct.discount / 100)) : parseInt(buyingProduct.price.replace(/\D/g, ''))) * buyQuantity).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (buyStep === 1) {
                  // Validasi email
                  try {
                    const { data: userExists } = await supabase.from('users').select('id').eq('email', buyerEmail).single();
                    if (!userExists) {
                      alert("Email tidak terdata");
                      navigate('/register-member');
                      return;
                    }
                    setBuyStep(2);
                  } catch (err) {
                    alert("Email tidak terdata");
                    navigate('/register-member');
                  }
                } else {
                  handleBuyProduct(e);
                }
              }}>
                {buyStep === 1 ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Jumlah Pembelian</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="number" 
                          min="1" 
                          max={buyingProduct.stok || 1}
                          required 
                          value={buyQuantity}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 1;
                            if (val > (buyingProduct.stok || 1)) val = buyingProduct.stok || 1;
                            if (val < 1) val = 1;
                            setBuyQuantity(val);
                          }}
                          className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                        />
                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Sisa Stok: {buyingProduct.stok || 0}</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email Pemesan</label>
                      <input 
                        type="email" 
                        required 
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                        placeholder="Masukkan email Anda"
                      />
                      <p className="text-[10px] text-gray-400 mt-2">Gunakan email ini pada fitur <strong>Cek Status Booking</strong> untuk melacak pesanan.</p>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-all flex justify-center items-center gap-2"
                    >
                      Lanjut <FaArrowRight className="text-sm" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Kode Voucher Diskon</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={productPromoInput}
                          onChange={(e) => setProductPromoInput(e.target.value)}
                          className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-black uppercase" 
                          placeholder="Contoh: RWD-XXXX"
                        />
                        <button
                          type="button"
                          onClick={handleApplyProductPromo}
                          disabled={isProductPromoLoading || !productPromoInput}
                          className="bg-gray-900 text-white px-4 rounded-xl text-sm font-bold disabled:bg-gray-200"
                        >
                          {isProductPromoLoading ? 'Cek...' : 'Pakai'}
                        </button>
                      </div>
                      {productPromoError && <p className="text-red-500 text-xs mt-2">{productPromoError}</p>}
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setBuyStep(1)}
                        className="w-1/3 bg-gray-100 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all"
                      >
                        Kembali
                      </button>
                      <button 
                        type="submit" 
                        disabled={isBuying || buySuccess}
                        className="w-2/3 bg-black text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-all flex justify-center items-center gap-2 disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        {isBuying ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 
                         buySuccess ? <FaCheckCircle className="text-emerald-500" /> : <FaShoppingCart />}
                        {isBuying ? 'Memproses...' : buySuccess ? 'Berhasil Dipesan!' : 'Beli Sekarang'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}