import React, { useState, useEffect } from 'react';
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { FaSearch, FaFilter, FaFileDownload, FaEllipsisV, FaEye, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableKapsters, setAvailableKapsters] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    name: '',
    service: '',
    kapster: '',
    price: ''
  });

  const fetchOptions = async () => {
    try {
      const [svcRes, kapRes] = await Promise.all([
        supabase.from('services').select('*'),
        supabase.from('kapsters').select('*')
      ]);
      if (svcRes.data) setAvailableServices(svcRes.data);
      if (kapRes.data) setAvailableKapsters(kapRes.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchOptions();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // KOMENTAR DEMO: Mengambil data dari dua tabel sekaligus: haircut_bookings (pesanan jasa) dan product_orders (pesanan barang)
      const { data: bookings, error: err1 } = await supabase.from('haircut_bookings').select('*');
      const { data: products, error: err2 } = await supabase.from('product_orders').select('*');

      let combined = [];
      if (!err1 && bookings) {
        combined = [...combined, ...bookings.map(b => ({
          id: b.id.substring(0, 8).toUpperCase(),
          realId: b.id,
          customerName: b.name || b.email || 'Guest',
          service: `[Booking] ${b.layanan || b.service}`,
          status: b.status || 'Pending',
          totalPrice: b.harga || 75000,
          orderDate: b.tanggal ? b.tanggal : (b.created_at ? b.created_at.substring(0, 10) : ''),
          createdAt: b.created_at || new Date().toISOString(),
          type: 'booking',
          raw: b
        }))];
      }
      if (!err2 && products) {
        combined = [...combined, ...products.map(p => ({
          id: p.id.substring(0, 8).toUpperCase(),
          realId: p.id,
          customerName: p.buyer_name || p.email || 'Guest',
          service: `[Produk] ${p.items}`,
          status: p.status || 'Pending',
          totalPrice: p.total_harga || 0,
          orderDate: p.created_at ? p.created_at.substring(0, 10) : '',
          createdAt: p.created_at || new Date().toISOString(),
          type: 'product',
          raw: p
        }))];
      }

      // KOMENTAR DEMO: Setelah data digabungkan, kita urutkan dari pesanan yang paling terbaru berdasarkan waktu (descending)
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(combined);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return '📋';
    if (status.includes('Selesai') || status === 'Completed' || status.includes('Dikirim')) return '✅';
    if (status.includes('Menunggu') || status === 'Pending') return '⏳';
    if (status.includes('Batal') || status.includes('Dibatalkan') || status === 'Cancelled') return '❌';
    return '📋';
  };

  const handleMarkAsCompleted = async (order) => {
    if (!window.confirm(`Tandai pesanan ${order.id} sebagai Selesai?`)) return;
    try {
      const targetTable = order.type === 'booking' ? 'haircut_bookings' : 'product_orders';
      const { error } = await supabase
        .from(targetTable)
        .update({ status: 'Selesai' })
        .eq('id', order.realId);

      if (error) throw error;

      setOrders(prev => prev.map(o => o.realId === order.realId ? { ...o, status: 'Selesai' } : o));
    } catch (err) {
      console.error("Error updating status:", err);
      alert('Gagal mengupdate status pesanan');
    }
  };

  const handleCreateWalkIn = async (e) => {
    e.preventDefault();
    if (!newOrder.name || !newOrder.service || !newOrder.kapster || !newOrder.price) {
      alert("Harap lengkapi semua data!");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('haircut_bookings').insert([{
        email: 'walkin@guest.com',
        name: newOrder.name,
        layanan: newOrder.service,
        kapster: newOrder.kapster,
        tanggal: new Date().toISOString().split('T')[0],
        waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        harga: newOrder.price.toString(),
        status: 'Selesai',
        booking_type: 'walk-in'
      }]);

      if (error) throw error;

      alert('Walk-in Client berhasil ditambahkan!');
      setIsModalOpen(false);
      setNewOrder({ name: '', service: '', kapster: '', price: '' });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan walk-in client: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportData = () => {
    if (filteredOrders.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    const headers = ["Order ID", "Customer", "Service/Item", "Date", "Price (Rp)", "Status", "Type"];
    
    const rows = filteredOrders.map(order => {
      const escapeStr = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
      
      return [
        escapeStr(order.id),
        escapeStr(order.customerName),
        escapeStr(order.service.replace(/\[(Booking|Produk)\] /g, '')),
        escapeStr(order.orderDate),
        escapeStr(order.totalPrice),
        escapeStr(order.status),
        escapeStr(order.type === 'booking' ? (order.raw.booking_type || 'online') : 'product')
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Pesanan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KOMENTAR DEMO: Filter gabungan. Kode ini menyaring (filter) data pesanan berdasarkan apa yang diketik di kotak Search (nama atau ID) DAN apa yang dipilih di Dropdown filter layanan.
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === "All") return matchesSearch;

    const cleanServiceName = o.service.replace(/\[(Booking|Produk)\] /g, '');
    return matchesSearch && cleanServiceName === selectedFilter;
  });

  // KOMENTAR DEMO: Kode ini membuat list unik (tidak boleh ada yang ganda) dari semua jenis layanan/produk untuk ditampilkan sebagai opsi pilihan pada Dropdown Filter.
  const uniqueItems = Array.from(new Set(orders.map(o => o.service.replace(/\[(Booking|Produk)\] /g, '')))).sort();

  return (
    <div className="flex-1 w-full pb-10 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen p-4 md:p-8">
      <PageHeader title="Orders Management" breadcrumb={["Dashboard", "Orders List"]}>
        <div className="flex gap-3">
          <Button onClick={handleExportData} type="secondary" className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-300">
            <FaFileDownload /> Export Data
          </Button>
          <Button onClick={() => setIsModalOpen(true)} type="dark" className="shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
            + Create Order (Walk-in)
          </Button>
        </div>
      </PageHeader>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mt-6 border border-white/50 transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-600 transition-colors" />
            <input
              placeholder="Cari ID atau Pelanggan..."
              className="pl-12 pr-4 py-3 bg-gray-50 rounded-2xl w-full outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-300 placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-slate-700 outline-none hover:bg-gray-50 transition-colors appearance-none cursor-pointer shadow-sm w-full sm:w-auto"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="All">Semua Order</option>
                {uniqueItems.map(itemName => (
                  <option key={itemName} value={itemName}>{itemName}</option>
                ))}
              </select>
              {/* Dropdown arrow custom styling */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                ▼
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-2xl">
              <span className="font-medium">{filteredOrders.length}</span> orders
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" className="text-center py-10">Loading...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10">No orders found.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.realId}
                    className="border-b border-gray-50 hover:bg-slate-50 transition-all duration-200 group relative"
                  >
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-700">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {order.customerName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-700">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{order.service}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{order.orderDate}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      Rp {Number(order.totalPrice).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        type={
                          (!order.status) ? 'warning' :
                            (order.status.includes('Selesai') || order.status === 'Completed' || order.status.includes('Dikirim')) ? 'success' :
                              (order.status.includes('Menunggu') || order.status === 'Pending' || order.status === 'Diproses') ? 'warning' : 'danger'
                        }
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{getStatusIcon(order.status)}</span>
                          {order.status}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="flex justify-end">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                          <FaEllipsisV className="text-gray-400 group-hover/btn:text-slate-600 transition-colors" />
                        </button>
                        <div className="absolute right-0 top-12 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <FaEye className="text-gray-400" /> View Details
                          </button>
                          {order.status && !order.status.includes('Selesai') && !order.status.includes('Batal') && !order.status.includes('Dibatalkan') && (
                            <button
                              onClick={() => handleMarkAsCompleted(order)}
                              className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                            >
                              <FaCheckCircle className="text-emerald-500" /> Tandai Selesai
                            </button>
                          )}
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

      {/* Walk-in Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Add Walk-in Client</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateWalkIn} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Budi"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-800 outline-none transition-all text-sm"
                  value={newOrder.name}
                  onChange={e => setNewOrder({ ...newOrder, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Layanan</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-800 outline-none transition-all text-sm bg-white"
                    value={newOrder.service}
                    onChange={e => {
                      const selectedService = availableServices.find(s => s.name === e.target.value);
                      setNewOrder({
                        ...newOrder,
                        service: e.target.value,
                        price: selectedService ? selectedService.price.toString() : newOrder.price
                      });
                    }}
                  >
                    <option value="">-- Pilih Layanan --</option>
                    {availableServices.map(svc => (
                      <option key={svc.id} value={svc.name}>{svc.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kapster</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-slate-800 outline-none transition-all text-sm bg-white"
                    value={newOrder.kapster}
                    onChange={e => setNewOrder({ ...newOrder, kapster: e.target.value })}
                  >
                    <option value="">-- Pilih Kapster --</option>
                    {availableKapsters.map(k => (
                      <option key={k.id} value={k.name}>{k.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  readOnly
                  placeholder="Terisi otomatis"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-slate-500 outline-none transition-all text-sm cursor-not-allowed"
                  value={newOrder.price}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-slate-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center">
                  {isSubmitting ? <span className="animate-spin mr-2">⏳</span> : null}
                  Simpan Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Order ID</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedOrder.id}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold mb-1">Tipe Order</span>
                  <span className="capitalize text-slate-800 font-bold">{selectedOrder.type === 'booking' ? (selectedOrder.raw.booking_type || 'Online Booking') : 'Product Order'}</span>
                </div>
                <div className="col-span-2 mt-2">
                  <span className="block text-slate-500 font-semibold mb-1">Tanggal Pemesanan</span>
                  <span className="text-slate-800 font-bold">
                    {new Date(selectedOrder.createdAt).toLocaleString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="col-span-2 border-t border-gray-100 pt-4">
                  <span className="block text-slate-500 font-semibold mb-1">Pelanggan</span>
                  <span className="text-slate-800 font-bold text-base">{selectedOrder.customerName}</span>
                  {selectedOrder.raw.email && selectedOrder.raw.email !== 'walkin@guest.com' && (
                    <span className="block text-slate-500 mt-0.5">{selectedOrder.raw.email}</span>
                  )}
                  {selectedOrder.raw.phone && (
                    <span className="block text-slate-500 mt-0.5">{selectedOrder.raw.phone}</span>
                  )}
                </div>
                <div className="col-span-2">
                  <span className="block text-slate-500 font-semibold mb-1">Item/Layanan</span>
                  <span className="text-slate-800 font-bold">{selectedOrder.service.replace('[Booking] ', '').replace('[Produk] ', '')}</span>
                </div>
                {selectedOrder.type === 'booking' && (
                  <>
                    <div>
                      <span className="block text-slate-500 font-semibold mb-1">Kapster</span>
                      <span className="text-slate-800">{selectedOrder.raw.kapster || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-semibold mb-1">Jadwal</span>
                      <span className="text-slate-800">{selectedOrder.raw.tanggal} {selectedOrder.raw.waktu ? `pukul ${selectedOrder.raw.waktu}` : ''}</span>
                    </div>
                  </>
                )}
                {selectedOrder.type === 'product' && selectedOrder.raw.address && (
                  <div className="col-span-2">
                    <span className="block text-slate-500 font-semibold mb-1">Alamat Pengiriman</span>
                    <span className="text-slate-800">{selectedOrder.raw.address}</span>
                  </div>
                )}
                <div className="col-span-2 border-t border-gray-100 pt-4 flex justify-between items-center">
                  <div>
                    <span className="block text-slate-500 font-semibold mb-1">Status</span>
                    <Badge type={
                      (!selectedOrder.status) ? 'warning' :
                        (selectedOrder.status.includes('Selesai') || selectedOrder.status === 'Completed' || selectedOrder.status.includes('Dikirim')) ? 'success' :
                          (selectedOrder.status.includes('Menunggu') || selectedOrder.status === 'Pending' || selectedOrder.status === 'Diproses') ? 'warning' : 'danger'
                    }>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="block text-slate-500 font-semibold mb-1">Total Harga</span>
                    <span className="text-2xl font-bold text-slate-900">Rp {Number(selectedOrder.totalPrice).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <button onClick={() => setSelectedOrder(null)} className="w-full px-4 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}