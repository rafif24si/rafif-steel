import React, { useState, useEffect, useRef } from 'react';
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import { FaSearch, FaEllipsisV, FaIdBadge, FaCrown, FaStar, FaMedal, FaPhoneAlt } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State bawaan UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const nameInputRef = useRef(null); 

  // State untuk form penambahan pelanggan baru
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('customers_view').select('*').order('last_order_date', { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [isModalOpen]); 

  // Fungsi Tambah Data
  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!newClient.name.trim() || !newClient.email.trim()) {
      alert("Nama dan Email wajib diisi!");
      return;
    }

    try {
      // Kita insert ke tabel users
      const { error } = await supabase.from('users').insert([{
        name: newClient.name,
        email: newClient.email,
        password: "defaultpassword123", // dummy password
        role: "customer"
      }]);
      
      if (error) throw error;
      
      alert("Pelanggan baru berhasil ditambahkan!");
      setIsModalOpen(false);
      setNewClient({ name: "", email: "", phone: "" });
      fetchCustomers();
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan pelanggan: " + error.message);
    }
  };

  // Fungsi Delete Data (Berjalan di frontend)
  const handleDelete = (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus data pelanggan ini?");
    if (!konfirmasi) return;

    // Filter keluar data yang ID-nya sama dengan yang dihapus
    setCustomers(customers.filter(cust => cust.id !== id));
    alert("Data berhasil dihapus!");
  };

  // Penyesuaian Badge Membership
  const getBadgeType = (role) => {
    if (role?.includes('Platinum')) return 'success';
    if (role?.includes('Gold')) return 'warning';
    if (role?.includes('Silver')) return 'primary';
    return 'secondary';
  };

  const getLoyaltyIcon = (role) => {
    if (role?.includes('Platinum')) return <FaCrown className="text-yellow-500" />;
    if (role?.includes('Gold')) return <FaMedal className="text-amber-500" />;
    return <FaStar className="text-slate-400" />;
  };

  // Filter pencarian berdasarkan nama, email, atau nomor HP
  const filteredCustomers = customers.filter(cust => 
    (cust.name && cust.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cust.email && cust.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cust.phone && cust.phone.includes(searchTerm))
  );

  return (
    <div className="flex-1 w-full pb-10 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen p-4 md:p-8">
      <PageHeader title="Customers Database" breadcrumb={["Dashboard", "Client List"]}>
        <Button 
          type="dark" 
          onClick={() => setIsModalOpen(true)} 
          className="shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-slate-800 text-white border-none"
        >
          + Add New Client
        </Button>
      </PageHeader>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/50 mt-6 transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-600 transition-colors" />
            <input
              type="text"
              placeholder="Cari nama, email, atau no HP..."
              className="pl-12 pr-4 py-3 bg-gray-50 rounded-2xl w-full outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-300 placeholder:text-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-gray-50 px-4 py-2 rounded-2xl">
              <FaIdBadge className="text-slate-500" />
              <span className="font-bold text-slate-800">{filteredCustomers.length}</span> clients
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client Detail</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Membership Level</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-10">Loading...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-10">No customers found.</td></tr>
              ) : (
                filteredCustomers.map((cust, index) => (
                  <tr 
                    key={cust.email || index} 
                    className="border-b border-gray-50 hover:bg-slate-50 transition-all duration-200 group relative"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold shadow-sm">
                          {(cust.name || 'G').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{cust.name || 'Guest'}</p>
                          <p className="text-xs text-slate-500">{cust.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaPhoneAlt className="text-slate-400 text-xs" />
                        <span className="text-sm font-medium">{cust.phone || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Badge type={getBadgeType(cust.membership_level)}>
                          <span className="flex items-center gap-1.5 font-bold">
                            {getLoyaltyIcon(cust.membership_level)} {cust.membership_level}
                          </span>
                        </Badge>
                        <span className="text-xs text-slate-400">{cust.total_orders} Orders</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="flex justify-end">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                          <FaEllipsisV className="text-gray-400 group-hover/btn:text-slate-600" />
                        </button>
                        {/* Quick edit dropdown */}
                        <div className="absolute right-6 mt-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <button 
                            onClick={() => alert("Fitur edit akan segera hadir!")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 font-semibold"
                          >
                            Edit Data
                          </button>
                          <button 
                            onClick={() => handleDelete(cust.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                          >
                            Hapus Client
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Client">
        <form onSubmit={handleAddClient} className="space-y-4">
          <div className="group">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
               Full Name *
            </label>
            <input 
              ref={nameInputRef}
              type="text" 
              placeholder="Contoh: Budi Santoso"
              value={newClient.name}
              onChange={(e) => setNewClient({...newClient, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all"
              required
            />
          </div>
          
          <div className="group">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
               Nomor HP *
            </label>
            <input 
              type="text" 
              placeholder="Contoh: 08123456789"
              value={newClient.phone}
              onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all"
              required
            />
          </div>

          <div className="group">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
               Email (Opsional)
            </label>
            <input 
              type="email" 
              placeholder="Contoh: budi@gmail.com"
              value={newClient.email}
              onChange={(e) => setNewClient({...newClient, email: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all"
            />
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
            <Button 
              type="secondary" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleAddClient} 
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white"
            >
              Save Client
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}