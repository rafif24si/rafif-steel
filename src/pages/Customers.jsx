import React, { useState, useEffect, useRef } from 'react';
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import { FaSearch, FaEllipsisV, FaIdBadge, FaCrown, FaStar, FaMedal } from 'react-icons/fa';
import { usersAPI } from '../services/usersAPI'; // Import API Supabase yang sudah kita buat

export default function Customers() {
  // State untuk mengelola data dari Supabase
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // State bawaan UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const nameInputRef = useRef(null); 

  // Mengambil data dari Supabase saat komponen pertama kali dimuat
  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (isModalOpen && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [isModalOpen]); 

  // Fungsi Fetch Data
  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await usersAPI.fetchUsers();
      setCustomers(data || []); // Pastikan set array
    } catch (err) {
      setError("Gagal memuat data pelanggan.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Delete Data
  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus akun ini?");
    if (!konfirmasi) return;

    try {
      setIsLoading(true);
      await usersAPI.deleteUser(id);
      alert("Data berhasil dihapus!");
      loadCustomers(); // Refresh tabel setelah hapus
    } catch (err) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Penyesuaian Badge Role / Membership
  const getBadgeType = (role) => {
    if (role === 'admin') return 'success';
    return 'warning';
  };

  const getLoyaltyIcon = (role) => {
    if (role === 'admin') return <FaCrown className="text-yellow-500" />;
    return <FaMedal className="text-amber-700" />;
  };

  // Filter pencarian berdasarkan nama atau email
  const filteredCustomers = customers.filter(cust => 
    (cust.name && cust.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (cust.email && cust.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 w-full pb-10 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen p-4 md:p-8">
      <PageHeader title="Customers Database" breadcrumb={["Dashboard", "Client List"]}>
        <Button 
          type="dark" 
          onClick={() => setIsModalOpen(true)} 
          className="shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          + Add New Client
        </Button>
      </PageHeader>

      {/* Menampilkan pesan error jika ada */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/50 mt-6 transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-600 transition-colors" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              className="pl-12 pr-4 py-3 bg-gray-50 rounded-2xl w-full outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-300 placeholder:text-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-gray-50 px-4 py-2 rounded-2xl">
              <FaIdBadge className="text-slate-500" />
              <span className="font-medium">{filteredCustomers.length}</span> clients
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">Memuat data pelanggan...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">Belum ada pelanggan terdaftar.</td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr 
                    key={cust.id} 
                    className="border-b border-gray-50 hover:bg-slate-50 transition-all duration-200 group relative"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold shadow-md uppercase">
                            {cust.name ? cust.name.charAt(0) : '?'}
                          </div>
                          {cust.role === 'admin' && (
                            <span className="absolute -bottom-0.5 -right-0.5 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                              <FaCrown className="text-[8px] text-white" />
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 block">{cust.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600">{cust.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Badge type={getBadgeType(cust.role)}>
                          <span className="flex items-center gap-1.5 uppercase text-xs font-bold">
                            {getLoyaltyIcon(cust.role)}
                            {cust.role || 'customer'}
                          </span>
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                          <FaEllipsisV className="text-gray-400 group-hover/btn:text-slate-600 transition-colors" />
                        </button>
                        {/* Quick edit dropdown */}
                        <div className="absolute right-0 mt-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <button 
                            onClick={() => alert("Fitur edit akan segera hadir!")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(cust.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
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
        <div className="space-y-4">
          <InputField 
            ref={nameInputRef} 
            label="Full Name" 
            name="name" 
            placeholder="Nama Lengkap" 
          />
          <InputField label="Email" type="email" name="email" placeholder="client@email.com" />
          <InputField label="Password" type="password" name="password" placeholder="••••••••" />
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button 
              type="primary" 
              onClick={() => alert("Gunakan halaman Register untuk menambah akun baru!")} 
              className="flex-1"
            >
              Save Client
            </Button>
            <Button type="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}