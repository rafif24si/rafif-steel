import React, { useState, useEffect } from 'react';
import PageHeader from "../components/PageHeader";
import { supabase } from '../lib/supabaseClient';
import { FaStar, FaTrash, FaSearch } from 'react-icons/fa';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  // KOMENTAR DEMO: Mengambil daftar seluruh ulasan pelanggan dari tabel 'haircut_reviews', diurutkan dari ulasan yang paling baru
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('haircut_reviews')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // KOMENTAR DEMO: Menghapus ulasan tertentu dari database
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) return;
    
    try {
      const { error } = await supabase
        .from('haircut_reviews')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setReviews(reviews.filter(r => r.id !== id));
      alert("Ulasan berhasil dihapus.");
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Gagal menghapus ulasan.");
    }
  };

  const filteredReviews = reviews.filter(r => 
    (r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.review && r.review.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 w-full pb-10 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen p-4 md:p-8">
      <PageHeader title="Customer Reviews" breadcrumb={["Dashboard", "Reviews"]}>
        <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-2xl shadow-sm">
          Total: <span className="text-slate-800">{reviews.length}</span> ulasan
        </div>
      </PageHeader>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mt-6 border border-white/50 transition-all duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="relative w-full sm:w-96 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-600 transition-colors" />
            <input
              placeholder="Cari nama atau ulasan..."
              className="pl-12 pr-4 py-3 bg-gray-50 rounded-2xl w-full outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-300 placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-10 text-slate-500">Memuat data ulasan...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Tidak ada ulasan ditemukan.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Hapus Ulasan"
                  >
                    <FaTrash />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                      {review.name ? review.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{review.name || 'Anonymous'}</h4>
                      <p className="text-xs text-slate-500">
                        {new Date(review.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic">"{review.review}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
