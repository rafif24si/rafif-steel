import React, { useState } from 'react';
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import { FaSearch, FaTicketAlt, FaEllipsisV, FaPlus, FaCut, FaShoppingBag, FaPercentage } from 'react-icons/fa';

export default function Promo() {
  // Data dummy promo yang selaras dengan Layanan dan Produk Anda
  const [promos, setPromos] = useState([
    {
      id: "PRM-001",
      title: "New Member 20% Off",
      code: "NEWHAIR20",
      target: "Gentleman Haircut",
      type: "service",
      discount: "20%",
      status: "Active",
      validUntil: "31 Des 2026",
      usage: 145
    },
    {
      id: "PRM-002",
      title: "Potongan 15K Pomade",
      code: "POMADE15K",
      target: "Semua Pomade",
      type: "product",
      discount: "Rp 15.000",
      status: "Active",
      validUntil: "30 Jun 2026",
      usage: 89
    },
    {
      id: "PRM-003",
      title: "Coloring Special",
      code: "COLORME10",
      target: "Hair Coloring",
      type: "service",
      discount: "10%",
      status: "Expired",
      validUntil: "1 Jan 2026",
      usage: 412
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPromo, setNewPromo] = useState({ title: "", code: "", target: "Gentleman Haircut", type: "service", discount: "", validUntil: "" });

  const handleAddPromo = (e) => {
    e.preventDefault();
    if (!newPromo.title || !newPromo.code || !newPromo.discount) {
      alert("Mohon lengkapi semua field yang wajib!");
      return;
    }

    const promoData = {
      id: `PRM-00${promos.length + 1}`,
      ...newPromo,
      status: "Active",
      usage: 0
    };

    setPromos([promoData, ...promos]);
    setIsModalOpen(false);
    setNewPromo({ title: "", code: "", target: "Gentleman Haircut", type: "service", discount: "", validUntil: "" });
    alert("Promo baru berhasil ditambahkan!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus promo ini?")) {
      setPromos(promos.filter(p => p.id !== id));
    }
  };

  const filteredPromos = promos.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 w-full pb-10 bg-[#F5F3FF] min-h-screen p-4 md:p-8 font-sans">
      <PageHeader title="Promo Management" breadcrumb={["Dashboard", "Promos & Vouchers"]}>
        <Button 
          type="primary" 
          onClick={() => setIsModalOpen(true)} 
          className="shadow-lg shadow-violet-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-violet-600 hover:bg-violet-700 text-white border-none flex items-center gap-2"
        >
          <FaPlus /> Add New Promo
        </Button>
      </PageHeader>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-3xl shadow-sm p-4 mt-6 mb-8 border border-gray-100 flex items-center">
        <FaSearch className="text-gray-400 ml-3 mr-3" />
        <input
          type="text"
          placeholder="Cari nama promo atau kode voucher..."
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* PROMO GRID - TICKET STYLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPromos.map(promo => (
          <div key={promo.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col relative group">
            {/* Ticket Cutout Effect */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#F5F3FF] rounded-full -translate-y-1/2 border-r border-gray-100"></div>
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#F5F3FF] rounded-full -translate-y-1/2 border-l border-gray-100"></div>
            
            <div className="p-6 border-b-2 border-dashed border-gray-100 relative">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${promo.type === 'service' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                  {promo.type === 'service' ? <FaCut className="text-xl" /> : <FaShoppingBag className="text-xl" />}
                </div>
                <Badge type={promo.status === 'Active' ? 'success' : 'secondary'} className="px-3 py-1">
                  {promo.status}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{promo.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                Target: <span className="font-semibold text-gray-700">{promo.target}</span>
              </p>
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
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Used</p>
                  <p className="text-sm font-bold text-gray-700">{promo.usage} times</p>
                </div>
              </div>

              {/* Action Dropdown Hover */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(promo.id)} className="w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all">
                  <FaEllipsisV className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPromos.length === 0 && (
        <div className="text-center py-20 text-gray-500 font-medium">
          Tidak ada promo yang ditemukan.
        </div>
      )}

      {/* MODAL ADD PROMO */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Promo">
        <form onSubmit={handleAddPromo} className="space-y-4">
          <div className="group">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Nama Promo</label>
            <input 
              type="text" placeholder="Contoh: Diskon Kemerdekaan" required
              value={newPromo.title} onChange={(e) => setNewPromo({...newPromo, title: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Kode Voucher</label>
              <input 
                type="text" placeholder="MERDEKA45" required
                value={newPromo.code} onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-violet-500 transition-all uppercase"
              />
            </div>
            <div className="group">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Potongan</label>
              <input 
                type="text" placeholder="20% atau Rp 15.000" required
                value={newPromo.discount} onChange={(e) => setNewPromo({...newPromo, discount: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Tipe Promo</label>
              <select 
                value={newPromo.type} onChange={(e) => setNewPromo({...newPromo, type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 transition-all"
              >
                <option value="service">Layanan (Service)</option>
                <option value="product">Produk (Product)</option>
              </select>
            </div>
            <div className="group">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Target Item</label>
              <select 
                value={newPromo.target} onChange={(e) => setNewPromo({...newPromo, target: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 transition-all"
              >
                {newPromo.type === 'service' ? (
                  <>
                    <option value="Semua Layanan">Semua Layanan</option>
                    <option value="Gentleman Haircut">Gentleman Haircut</option>
                    <option value="Hot Towel Shave">Hot Towel Shave</option>
                    <option value="Hair Coloring">Hair Coloring</option>
                  </>
                ) : (
                  <>
                    <option value="Semua Produk">Semua Produk</option>
                    <option value="Semua Pomade">Semua Pomade</option>
                    <option value="Beard Oil Premium">Beard Oil Premium</option>
                    <option value="Hair Tonic">Hair Tonic</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Berlaku Sampai</label>
            <input 
              type="date" required
              value={newPromo.validUntil} onChange={(e) => setNewPromo({...newPromo, validUntil: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
            <Button type="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Batal</Button>
            <Button type="primary" onClick={handleAddPromo} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white border-none">Simpan Promo</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}