import React, { useState, useEffect } from 'react';
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import { FaSearch, FaTicketAlt, FaEllipsisV, FaPlus, FaCut, FaShoppingBag, FaPercentage, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

export default function Promo() {
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
      title: "", code: "", discount: "", description: "", valid_until: "", status: "Aktif"
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('promos').select('*').order('created_at', { ascending: false });
    if (!error && data) setPromos(data);
    setIsLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            title: formData.title,
            code: formData.code,
            discount: formData.discount,
            description: formData.description,
            valid_until: formData.valid_until,
            status: formData.status
        };
        
        if (isEditMode) {
            await supabase.from('promos').update(payload).eq('id', currentId);
        } else {
            await supabase.from('promos').insert([payload]);
        }
        setIsModalOpen(false);
        fetchPromos();
    } catch (err) {
        console.error("Error saving promo:", err);
        alert("Gagal menyimpan promo. Pastikan kode unik.");
    }
  };

  const handleEdit = (promo) => {
    setIsEditMode(true);
    setCurrentId(promo.id);
    setFormData({
        title: promo.title,
        code: promo.code,
        discount: promo.discount,
        description: promo.description || '',
        valid_until: promo.valid_until,
        status: promo.status || 'Aktif'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus promo ini?")) {
        await supabase.from('promos').delete().eq('id', id);
        fetchPromos();
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ title: "", code: "", discount: "", description: "", valid_until: "", status: "Aktif" });
    setIsModalOpen(true);
  };

  const filteredPromos = promos.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 w-full pb-10 bg-[#F5F3FF] min-h-screen p-4 md:p-8 font-sans">
      <PageHeader title="Promo Management" breadcrumb={["Dashboard", "Promos & Vouchers"]}>
        <button 
          onClick={openAddModal} 
          className="shadow-lg shadow-violet-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl border-none flex items-center gap-2 font-bold"
        >
          <FaPlus /> Add New Promo
        </button>
      </PageHeader>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-3xl shadow-sm p-4 mt-6 mb-8 border border-gray-100 flex items-center">
        <FaSearch className="text-gray-400 ml-3 mr-3" />
        <input
          type="text"
          placeholder="Cari nama promo atau kode voucher..."
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* PROMO GRID - TICKET STYLE */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-slate-500 font-bold">Loading...</div>
      ) : filteredPromos.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-500 font-bold">Belum ada promo, silakan tambah.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPromos.map(promo => (
            <div key={promo.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col relative group">
              {/* Ticket Cutout Effect */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#F5F3FF] rounded-full -translate-y-1/2 border-r border-gray-100"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#F5F3FF] rounded-full -translate-y-1/2 border-l border-gray-100"></div>
              
              <div className="p-6 border-b-2 border-dashed border-gray-100 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm bg-violet-50 text-violet-500`}>
                    <FaTicketAlt className="text-xl" />
                  </div>
                  <Badge type={promo.status === 'Aktif' || promo.status === 'Active' ? 'success' : 'secondary'} className="px-3 py-1">
                    {promo.status}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{promo.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  Target: <span className="font-semibold text-gray-700">{promo.description || '-'}</span>
                </p>
                <p className="text-xs text-red-500 mt-1 font-semibold">Valid Until: {promo.valid_until}</p>
              </div>

              <div className="p-6 bg-gray-50/50 flex-1 flex flex-col justify-between relative">
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Promo Code</p>
                  <div className="inline-block px-4 py-2 bg-gray-200/70 border border-gray-300 border-dashed rounded-xl font-mono font-bold text-gray-800 tracking-wider">
                    {promo.code}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Discount</p>
                    <p className="text-2xl font-black text-violet-600">{promo.discount}</p>
                  </div>
                </div>

                {/* Action Dropdown Hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => handleEdit(promo)} className="w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 hover:scale-110 transition-all">
                    <FaEdit className="text-xs" />
                  </button>
                  <button onClick={() => handleDelete(promo.id)} className="w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah/Edit Promo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                    <FaTimes />
                </button>
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Promo' : 'Tambah Promo Baru'}</h2>
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Judul Promo</label>
                        <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Cth: Diskon Merdeka" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Kode Voucher</label>
                            <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none uppercase font-mono" placeholder="MERDEKA45" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Diskon</label>
                            <input required type="text" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Cth: 20% / Rp 15.000" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi / Target</label>
                        <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Cth: Berlaku untuk semua layanan" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Berlaku Sampai</label>
                            <input required type="date" value={formData.valid_until} onChange={e => setFormData({...formData, valid_until: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                            <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none">
                                <option value="Aktif">Aktif</option>
                                <option value="Expired">Expired</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="mt-4 bg-violet-600 text-white font-bold py-3 rounded-xl hover:bg-violet-700 transition-colors">
                        {isEditMode ? 'Simpan Perubahan' : 'Tambah Promo'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}