import React, { useState, useEffect, useRef } from 'react';
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import { FaSearch, FaEllipsisV, FaIdBadge, FaCrown, FaStar, FaMedal, FaPhoneAlt } from 'react-icons/fa';

export default function Customers() {
  // Menggunakan 30 data dummy dari file CSV yang dilampirkan
  const [customers, setCustomers] = useState([
    { id: "BS-CRM-001", name: "Dimas Pratama", email: "dimas45@gmail.com", phone: "081239958838", role: "Gold" },
    { id: "BS-CRM-002", name: "Roni Simanjuntak", email: "roni13@gmail.com", phone: "081236687537", role: "Classic" },
    { id: "BS-CRM-003", name: "Rio Kusuma", email: "rio37@gmail.com", phone: "081255176955", role: "Classic" },
    { id: "BS-CRM-004", name: "Zaki Saputra", email: "zaki80@gmail.com", phone: "081294374605", role: "Classic" },
    { id: "BS-CRM-005", name: "Zaki Setiawan", email: "zaki68@gmail.com", phone: "081258966946", role: "Classic" },
    { id: "BS-CRM-006", name: "Aldi Tanjung", email: "aldi58@gmail.com", phone: "081295899313", role: "Gold" },
    { id: "BS-CRM-007", name: "Rafif Nugraha", email: "rafif82@gmail.com", phone: "081252235350", role: "Classic" },
    { id: "BS-CRM-008", name: "Zainal Lubis", email: "zainal84@gmail.com", phone: "081258586340", role: "Classic" },
    { id: "BS-CRM-009", name: "Ilham Saputra", email: "ilham59@gmail.com", phone: "081289978790", role: "Classic" },
    { id: "BS-CRM-010", name: "Dimas Kurniawan", email: "dimas65@gmail.com", phone: "081270897765", role: "VIP" },
    { id: "BS-CRM-011", name: "Taufik Sanjaya", email: "taufik77@gmail.com", phone: "081290388981", role: "Classic" },
    { id: "BS-CRM-012", name: "Budi Purnama", email: "budi72@gmail.com", phone: "081281498611", role: "Gold" },
    { id: "BS-CRM-013", name: "Agus Harahap", email: "agus95@gmail.com", phone: "081260119651", role: "Classic" },
    { id: "BS-CRM-014", name: "Ahmad Saputra", email: "ahmad90@gmail.com", phone: "081240728046", role: "Gold" },
    { id: "BS-CRM-015", name: "Gilang Subagja", email: "gilang70@gmail.com", phone: "081235556386", role: "Gold" },
    { id: "BS-CRM-016", name: "Ihsan Purnama", email: "ihsan53@gmail.com", phone: "081243374088", role: "Classic" },
    { id: "BS-CRM-017", name: "Aditya Alatas", email: "aditya79@gmail.com", phone: "081222517517", role: "Classic" },
    { id: "BS-CRM-018", name: "Dafa Zulkarnain", email: "dafa68@gmail.com", phone: "081266775103", role: "Gold" },
    { id: "BS-CRM-019", name: "Dani Wijaya", email: "dani16@gmail.com", phone: "081273993471", role: "Classic" },
    { id: "BS-CRM-020", name: "Dimas Wibowo", email: "dimas82@gmail.com", phone: "081287701200", role: "Gold" },
    { id: "BS-CRM-021", name: "Gilang Setiawan", email: "gilang60@gmail.com", phone: "081296637649", role: "Classic" },
    { id: "BS-CRM-022", name: "Taufik Nugraha", email: "taufik74@gmail.com", phone: "081227778019", role: "Gold" },
    { id: "BS-CRM-023", name: "Vito Kurniawan", email: "vito94@gmail.com", phone: "081228024248", role: "Gold" },
    { id: "BS-CRM-024", name: "Dafa Ginting", email: "dafa72@gmail.com", phone: "081216818112", role: "Classic" },
    { id: "BS-CRM-025", name: "Vito Mahendra", email: "vito64@gmail.com", phone: "081211297845", role: "VIP" },
    { id: "BS-CRM-026", name: "Agus Nasution", email: "agus15@gmail.com", phone: "081238195995", role: "Classic" },
    { id: "BS-CRM-027", name: "Aldi Subagja", email: "aldi32@gmail.com", phone: "081213326769", role: "Gold" },
    { id: "BS-CRM-028", name: "Rizky Utama", email: "rizky70@gmail.com", phone: "081236786211", role: "Classic" },
    { id: "BS-CRM-029", name: "Rio Utama", email: "rio18@gmail.com", phone: "081247463522", role: "Classic" },
    { id: "BS-CRM-030", name: "Zainal Setiawan", email: "zainal14@gmail.com", phone: "081290070438", role: "Gold" }
  ]);

  // State bawaan UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const nameInputRef = useRef(null); 

  // State untuk form penambahan pelanggan baru
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (isModalOpen && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [isModalOpen]); 

  // Fungsi Tambah Data (Berjalan di frontend tanpa Supabase)
  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name.trim() || !newClient.phone.trim()) {
      alert("Nama dan Nomor HP wajib diisi!");
      return;
    }

    const clientData = {
      id: `BS-CRM-0${customers.length + 1}`,
      name: newClient.name,
      email: newClient.email || "-",
      phone: newClient.phone,
      role: "Classic" // Level membership default untuk pelanggan baru
    };

    setCustomers([clientData, ...customers]); // Tambahkan ke paling atas tabel
    setIsModalOpen(false); // Tutup modal
    setNewClient({ name: "", email: "", phone: "" }); // Kosongkan form
    alert("Pelanggan baru berhasil ditambahkan!");
  };

  // Fungsi Delete Data (Berjalan di frontend)
  const handleDelete = (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus data pelanggan ini?");
    if (!konfirmasi) return;

    // Filter keluar data yang ID-nya sama dengan yang dihapus
    setCustomers(customers.filter(cust => cust.id !== id));
    alert("Data berhasil dihapus!");
  };

  // Penyesuaian Badge Membership (Berdasarkan CSV Anda: VIP, Gold, Classic)
  const getBadgeType = (role) => {
    if (role === 'VIP') return 'success'; // Hijau
    if (role === 'Gold') return 'warning'; // Kuning
    return 'secondary'; // Abu-abu
  };

  const getLoyaltyIcon = (role) => {
    if (role === 'VIP') return <FaCrown className="text-yellow-500" />;
    if (role === 'Gold') return <FaMedal className="text-amber-500" />;
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
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-500 font-medium">
                    Pelanggan tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr 
                    key={cust.id} 
                    className="border-b border-gray-50 hover:bg-slate-50/80 transition-all duration-200 group relative"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md uppercase ${
                            cust.role === 'VIP' ? 'bg-gradient-to-br from-yellow-500 to-amber-600' : 
                            cust.role === 'Gold' ? 'bg-gradient-to-br from-amber-300 to-yellow-500 text-slate-800' : 
                            'bg-gradient-to-br from-slate-700 to-slate-800'
                          }`}>
                            {cust.name ? cust.name.charAt(0) : '?'}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">{cust.name}</span>
                          <span className="text-[10px] font-bold tracking-widest text-slate-400">{cust.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium text-sm mb-1">
                        <FaPhoneAlt className="text-slate-400 text-xs" /> {cust.phone}
                      </div>
                      <div className="text-slate-400 text-xs">{cust.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Badge type={getBadgeType(cust.role)}>
                          <span className="flex items-center gap-1.5 uppercase text-[10px] font-black tracking-wider">
                            {getLoyaltyIcon(cust.role)}
                            {cust.role || 'Classic'}
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