import React, { useState, useEffect } from 'react';
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { FaCrown, FaUser, FaUserEdit, FaTrashAlt, FaEnvelope, FaIdCard } from 'react-icons/fa';
import { usersAPI } from '../services/usersAPI';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk Modal Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: null, name: '', role: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await usersAPI.fetchUsers();
   
      const sortedData = (data || []).sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return 0;
      });
      setUsers(sortedData);
    } catch (error) {
      console.error("Gagal memuat user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus akun ${name}?`)) return;
    setIsLoading(true);
    try {
      await usersAPI.deleteUser(id);
      loadUsers();
    } catch (error) {
      alert("Gagal menghapus user: " + error.message);
      setIsLoading(false);
    }
  };

  // --- Fungsi terkait Edit ---
  const handleOpenEdit = (user) => {
    setEditData({ id: user.id, name: user.name, role: user.role || 'Admin' });
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    if (!editData.name.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }
    
    setIsSaving(true);
    try {
      // Kita hanya mengirimkan data yang boleh diedit (misal: nama dan role)
      await usersAPI.updateUser(editData.id, { 
        name: editData.name, 
        role: editData.role 
      });
      setIsModalOpen(false);
      loadUsers(); // Refresh tabel
    } catch (error) {
      alert("Gagal memperbarui user: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 w-full pb-10 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen p-4 md:p-8">
      <PageHeader title="User Management" breadcrumb={["Dashboard", "System Users"]} />

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/50 mt-6 transition-all duration-300">
        
        {/* Header Tabel */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
               <FaIdCard className="text-xl" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-800">System Access List</h3>
               <p className="text-sm text-slate-500">Kelola hak akses dan data akun pengguna</p>
             </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
             <span className="font-bold text-slate-800">{users.length}</span> Total Users
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Info</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Access Level</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Memuat data pengguna...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-500 font-medium">
                    Belum ada data akun terdaftar.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md uppercase ${user.role === 'admin' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
                            {user.name ? user.name.charAt(0) : '?'}
                          </div>
                          {user.role === 'admin' && (
                            <span className="absolute -bottom-1 -right-1 bg-yellow-400 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                              <FaCrown className="text-[10px] text-white" />
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaEnvelope className="text-slate-400 text-xs" />
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge type={user.role === 'admin' ? 'success' : 'secondary'} className="px-3 py-1">
                        <span className="flex items-center gap-1.5 uppercase text-[10px] font-black tracking-wider">
                          {user.role === 'admin' ? <FaCrown className="text-yellow-500" /> : <FaUser className="text-slate-400" />}
                          {user.role || 'customer'}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Tombol Edit */}
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <FaUserEdit />
                        </button>
                        {/* Tombol Hapus */}
                        <button 
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"
                          title="Hapus User"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT USER */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit System User">
        <div className="space-y-4 pt-2">
          {/* Input Nama */}
          <div className="group">
             <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                Full Name
             </label>
             <input 
                type="text" 
                name="name" 
                value={editData.name}
                onChange={handleEditChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all"
             />
          </div>

          {/* Select Role */}
          <div className="group">
             <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                Access Level (Role)
             </label>
             <select 
                name="role" 
                value={editData.role} 
                onChange={handleEditChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-800 transition-all cursor-pointer"
             >
               <option value="customer">Customer</option>
               <option value="admin">Administrator</option>
               <option value="kapster">Kapster / Barber</option>
             </select>
          </div>

          {/* Tombol Aksi Modal */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
            <Button 
              type="secondary" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-1"
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button 
              type="primary" 
              onClick={handleSaveEdit} 
              className="flex-1 bg-slate-800 hover:bg-slate-900"
              disabled={isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}