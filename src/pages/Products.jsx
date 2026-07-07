import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import { FaSearch, FaFileDownload, FaEllipsisV, FaBox, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
      name: '', price: '', type: 'Styling', img_url: '', is_best_seller: false, is_new: false, stok: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // KOMENTAR DEMO: Mengambil seluruh data inventory produk dari tabel 'products' di Supabase, diurutkan dari yang terbaru
  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setIsLoading(false);
  };

  // KOMENTAR DEMO: Fungsi untuk menyimpan produk baru atau menyimpan perubahan produk (Update). Jika ada gambar, gambar akan diupload ke Storage terlebih dahulu.
  const handleSave = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
        let uploadedUrl = formData.img_url;

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
              .from('products')
              .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('products').getPublicUrl(filePath);
            uploadedUrl = data.publicUrl;
        }

        const payload = {
            name: formData.name,
            price: parseInt(formData.price) || 0,
            type: formData.type,
            img_url: uploadedUrl || 'https://via.placeholder.com/150',
            is_best_seller: formData.is_best_seller,
            is_new: formData.is_new,
            stok: parseInt(formData.stok) || 0
        };
        
        if (isEditMode) {
            const { error } = await supabase.from('products').update(payload).eq('id', currentId);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('products').insert([payload]);
            if (error) throw error;
        }
        setIsModalOpen(false);
        fetchProducts();
    } catch (err) {
        console.error("Error saving product:", err);
        alert("Gagal menyimpan produk: " + err.message);
    } finally {
        setIsUploading(false);
    }
  };

  const handleEdit = (product) => {
    setIsEditMode(true);
    setCurrentId(product.id);
    setImageFile(null);
    setFormData({
        name: product.name,
        price: product.price.toString(),
        type: product.type || 'Styling',
        img_url: product.img_url,
        is_best_seller: product.is_best_seller || false,
        is_new: product.is_new || false,
        stok: product.stok ? product.stok.toString() : '0'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert("Gagal menghapus produk: " + error.message);
        }
        fetchProducts();
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setImageFile(null);
    setFormData({ name: '', price: '', type: 'Styling', img_url: '', is_best_seller: false, is_new: false, stok: '' });
    setIsModalOpen(true);
  };

  // KOMENTAR DEMO: Filter pencarian produk. Data yang tampil disaring berdasarkan nama atau kategori/tipe produk sesuai ketikan di kolom pencarian.
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.type && p.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 w-full pb-10 bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-8">
      <PageHeader title="Product Inventory" breadcrumb={["Dashboard", "Products"]}>
        <div className="flex gap-3">
          <button onClick={openAddModal} className="bg-slate-800 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-bold flex items-center gap-2 text-sm">
            <span className="text-xl">+</span> Add Product
          </button>
        </div>
      </PageHeader>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mt-6 border border-white/50 transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-600 transition-colors" />
            <input
              placeholder="Cari produk..."
              className="pl-12 pr-4 py-3 bg-gray-50 rounded-2xl w-full outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-300 placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-2xl flex items-center gap-2">
              <FaBox className="text-slate-500" />
              <span className="font-medium">{filteredProducts.length}</span> products
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price & Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Terjual</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-10">Loading...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10">Belum ada produk, silakan tambah.</td></tr>
              ) : (
                filteredProducts.map(p => (
                  <tr 
                    key={p.id} 
                    className="border-b border-gray-50 hover:bg-slate-50 transition-all duration-200 group relative"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.img_url} alt={p.name} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-100" />
                        <div>
                          <p className="font-bold text-slate-700 block">{p.name}</p>
                          <span className="text-xs text-gray-400 font-mono">
                            #{p.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge type="primary">{p.type}</Badge>
                      {p.is_best_seller && <Badge type="warning" className="ml-2">Best Seller</Badge>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">Rp {p.price.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">Stok: <span className="font-bold text-slate-700">{p.stok || 0}</span></p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">
                      {p.sold || 0} pcs
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn">
                          <FaEllipsisV className="text-gray-400 group-hover/btn:text-slate-600 transition-colors" />
                        </button>
                        <div className="absolute right-6 mt-8 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <button onClick={() => handleEdit(p)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 flex items-center gap-2">
                            <FaEdit className="text-gray-400" /> Edit Product
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <FaTrash className="text-red-400" /> Delete
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

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                    <FaTimes />
                </button>
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Produk' : 'Tambah Produk'}</h2>
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nama Produk</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: Pomade Water Based" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Kategori (Tipe)</label>
                            <input required type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: Styling" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Harga (Rp)</label>
                            <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: 120000" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Stok</label>
                            <input required type="number" value={formData.stok} onChange={e => setFormData({...formData, stok: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: 50" min="0" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Gambar Produk</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files[0])} 
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" 
                        />
                        {formData.img_url && !imageFile && (
                          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">Gambar saat ini: {formData.img_url.substring(0, 40)}...</div>
                        )}
                        {imageFile && (
                          <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">Gambar baru dipilih: {imageFile.name}</div>
                        )}
                    </div>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.is_best_seller} onChange={e => setFormData({...formData, is_best_seller: e.target.checked})} className="w-4 h-4 text-slate-800 rounded focus:ring-slate-800" />
                        <span className="text-sm font-bold text-slate-700">Best Seller</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.is_new} onChange={e => setFormData({...formData, is_new: e.target.checked})} className="w-4 h-4 text-slate-800 rounded focus:ring-slate-800" />
                        <span className="text-sm font-bold text-slate-700">Baru (New)</span>
                      </label>
                    </div>
                    <button type="submit" disabled={isUploading} className={`mt-4 text-white font-bold py-3 rounded-xl transition-colors ${isUploading ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'}`}>
                        {isUploading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Tambah Produk'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}