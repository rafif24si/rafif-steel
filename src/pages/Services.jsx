import React, { useState, useEffect } from 'react';
import PageHeader from "../components/PageHeader";
import { FaCut, FaSprayCan, FaUserTie, FaHotTub, FaEdit, FaTrash, FaClock, FaTimes } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

export default function Services() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', duration: '', price: '', category: 'Signature'
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        if (!error && data) setServices(data);
        setIsLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                const { error } = await supabase.from('services').update({
                    name: formData.name,
                    description: formData.description,
                    duration: formData.duration,
                    price: parseInt(formData.price) || 0,
                    category: formData.category
                }).eq('id', currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('services').insert([{
                    name: formData.name,
                    description: formData.description,
                    duration: formData.duration,
                    price: parseInt(formData.price) || 0,
                    category: formData.category
                }]);
                if (error) throw error;
            }
            setIsModalOpen(false);
            fetchServices();
        } catch (err) {
            console.error("Error saving service:", err);
            alert("Gagal menyimpan layanan: " + (err.message || JSON.stringify(err)));
        }
    };

    const handleEdit = (service) => {
        setIsEditMode(true);
        setCurrentId(service.id);
        setFormData({
            name: service.name,
            description: service.description,
            duration: service.duration,
            price: service.price.toString(),
            category: service.category || 'Signature'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus layanan ini?")) {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) {
                alert("Gagal menghapus: " + error.message);
            }
            fetchServices();
        }
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ name: '', description: '', duration: '', price: '', category: 'Signature' });
        setIsModalOpen(true);
    };

    const formatIDR = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
        }).format(amount);
    };

    const getIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('shave')) return <FaUserTie className="text-2xl text-amber-600" />;
        if (lowerName.includes('color')) return <FaSprayCan className="text-2xl text-indigo-600" />;
        if (lowerName.includes('facial') || lowerName.includes('spa')) return <FaHotTub className="text-2xl text-emerald-600" />;
        return <FaCut className="text-2xl text-slate-700" />;
    };

    const getBgIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('shave')) return "bg-gradient-to-br from-amber-50 to-amber-100";
        if (lowerName.includes('color')) return "bg-gradient-to-br from-indigo-50 to-indigo-100";
        if (lowerName.includes('facial') || lowerName.includes('spa')) return "bg-gradient-to-br from-emerald-50 to-emerald-100";
        return "bg-gradient-to-br from-slate-100 to-slate-200";
    };

    return (
        <div className="flex-1 w-full pb-10 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen p-4 md:p-8 font-sans">
            
            <PageHeader title="Barbershop Services" breadcrumb={["Dashboard", "Services Catalog"]}>
                <button onClick={openAddModal} className="bg-slate-800 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-bold flex items-center gap-2 text-sm">
                    <span className="text-xl">+</span> Add Service
                </button>
            </PageHeader>

            {isLoading ? (
                <div className="flex items-center justify-center h-64 text-slate-500 font-bold">Loading...</div>
            ) : services.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-slate-500 font-bold">Belum ada layanan, silakan tambah.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    {services.map((service) => (
                        <div 
                            key={service.id} 
                            className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-2xl transition-all duration-500 group flex flex-col relative overflow-hidden"
                        >
                            {/* Shimmer effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl ${getBgIcon(service.name)} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                                    {getIcon(service.name)}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <button onClick={() => handleEdit(service)} className="p-2 text-gray-400 hover:text-blue-500 bg-white/90 hover:bg-blue-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-500 bg-white/90 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-grow relative z-10">
                                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-slate-600 transition-colors">{service.name}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                                    {service.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 relative z-10">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <FaClock className="text-sm" />
                                    <span className="text-sm font-bold">{service.duration}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-lg font-black text-slate-800">
                                        {formatIDR(service.price)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                            <FaTimes />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Layanan</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: Premium Haircut" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi</label>
                                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: Potongan rambut terbaik dengan..." rows="3"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Durasi</label>
                                    <input required type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: 45 Min" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Harga (Rp)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: 75000" />
                                </div>
                            </div>
                            <button type="submit" className="mt-4 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors">
                                {isEditMode ? 'Simpan Perubahan' : 'Tambah Layanan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}