import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaTag, FaBox, FaMoneyBillWave, 
  FaStar, FaShieldAlt, FaTruckLoading, FaWarehouse, FaCheckCircle
} from "react-icons/fa";

// 1. DATA LOKAL BARBERSHOP (Sama dengan yang ada di halaman Products.jsx agar sinkron)
const barbershopProducts = Array.from({ length: 30 }, (_, index) => {
  const categories = ['Hair Care', 'Shaving', 'Styling', 'Tools', 'Body Care'];
  const products = [
    { title: 'Matte Clay Pomade', cat: 'Styling', brand: 'Smith Pomade', price: 120000, desc: 'Pomade dengan daya tahan kuat dan hasil akhir matte natural. Cocok untuk gaya rambut tekstur.' },
    { title: 'Wahl Cordless Senior', cat: 'Tools', brand: 'Wahl Professional', price: 2500000, desc: 'Mesin cukur legendaris tanpa kabel dengan performa motor yang sangat kuat untuk pemakaian profesional.' },
    { title: 'Aftershave Cologne', cat: 'Shaving', brand: 'The Shave Factory', price: 85000, desc: 'Menyegarkan kulit setelah bercukur dan mencegah iritasi dengan aroma maskulin yang tahan lama.' },
    { title: 'Hair Tonic Anti-Dandruff', cat: 'Hair Care', brand: 'Chief', price: 65000, desc: 'Menghilangkan ketombe dan memperkuat akar rambut agar tidak mudah rontok.' },
    { title: 'Profoil Lithium Shaver', cat: 'Tools', brand: 'Andis', price: 1850000, desc: 'Finishing tool terbaik untuk hasil cukuran yang sangat licin dan halus tanpa iritasi kulit.' },
  ];
  
  const baseProduct = products[index % products.length];

  return {
    id: (index + 1).toString(),
    code: `PRD-${(index + 1).toString().padStart(4, '0')}`,
    title: `${baseProduct.title} Vol. ${Math.floor(index / 5) + 1}`,
    category: baseProduct.cat,
    brand: baseProduct.brand,
    price: baseProduct.price,
    stock: Math.floor(Math.random() * 50) + 5,
    description: baseProduct.desc,
    rating: (Math.random() * (5 - 4) + 4).toFixed(1),
    // Placeholder gambar produk barbershop profesional
    thumbnail: `https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400&auto=format&fit=crop`
  };
});

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // KOMENTAR DEMO: Mengambil ID produk dari URL, lalu mencari datanya di array/database untuk ditampilkan secara lengkap di halaman ini
    // 2. MENGAMBIL DATA DARI ARRAY LOKAL, BUKAN DARI API DUMMYJSON
    const foundProduct = barbershopProducts.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-hijau/20 border-t-hijau rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-400 font-bold animate-pulse">MENCARI PRODUK BARBER...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-[#F8F9FA] min-h-screen font-barlow">
      {/* Header Navigasi */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-gray-500 hover:text-slate-800 transition-all"
        >
          <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-all">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-bold text-sm">Kembali ke Inventori</span>
        </button>
        <div className="px-5 py-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-sm font-black text-gray-800">{product.code}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SISI KIRI: Visual Produk */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-slate-100 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors"></div>
            
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="relative z-10 w-full max-w-[320px] rounded-3xl object-cover drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
            />
            
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-lg flex items-center gap-2">
              <FaStar className="text-amber-400" />
              <span className="font-black text-gray-800">{product.rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><FaTruckLoading /></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Pengiriman</p>
                  <p className="text-xs font-bold text-gray-700">Instan</p>
               </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center"><FaShieldAlt /></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Jaminan</p>
                  <p className="text-xs font-bold text-gray-700">Original</p>
               </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Informasi Detail */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-slate-200">
              <FaTag className="text-[8px]" /> {product.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
              {product.title}
            </h1>
            
            <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-xl font-medium">
              {product.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
               <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-blue-200 transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm text-blue-500 flex items-center justify-center text-xl group-hover:bg-blue-500 group-hover:text-white transition-all"><FaBox /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manufaktur</p>
                    <p className="font-extrabold text-gray-800">{product.brand}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-orange-200 transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm text-orange-500 flex items-center justify-center text-xl group-hover:bg-orange-500 group-hover:text-white transition-all"><FaWarehouse /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stok Gudang</p>
                    <p className="font-extrabold text-gray-800">{product.stock} Unit</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-10 border-t border-gray-100">
               <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Harga Satuan</p>
                  <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                    Rp {product.price.toLocaleString('id-ID')}
                  </h3>
               </div>
               <button className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 transform hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                  <FaCheckCircle /> UPDATE INVENTORI
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}