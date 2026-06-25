import React, { useState, useEffect } from 'react';
import PageHeader from "../components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';

export default function Kapster() {
    const [kapsters, setKapsters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "", specialty: "Senior Barber", experience: "", description: "", 
        shift_days: "", shift_hours: "", services: "", base_price: "", img_url: ""
    });

    useEffect(() => {
        fetchKapsters();
    }, []);

    const fetchKapsters = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('kapsters').select('*').order('created_at', { ascending: false });
        if (!error && data) setKapsters(data);
        setIsLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let uploadedUrl = formData.img_url;

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `kapsters/${Math.random()}.${fileExt}`;

                let { error: uploadError } = await supabase.storage
                  .from('products')
                  .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('products').getPublicUrl(fileName);
                uploadedUrl = data.publicUrl;
            }

            const payload = {
                name: formData.name,
                specialty: formData.specialty,
                experience: formData.experience,
                description: formData.description,
                shift_days: formData.shift_days,
                shift_hours: formData.shift_hours,
                services: formData.services,
                base_price: parseInt(formData.base_price) || 0,
                img_url: uploadedUrl || 'https://github.com/shadcn.png'
            };

            if (isEditMode) {
                const { error } = await supabase.from('kapsters').update(payload).eq('id', currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('kapsters').insert([payload]);
                if (error) throw error;
            }
            setIsModalOpen(false);
            fetchKapsters();
        } catch (err) {
            console.error("Error saving kapster:", err);
            alert("Gagal menyimpan data kapster: " + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = (k) => {
        setIsEditMode(true);
        setCurrentId(k.id);
        setImageFile(null);
        setFormData({
            name: k.name,
            specialty: k.specialty,
            experience: k.experience || '',
            description: k.description || '',
            shift_days: k.shift_days || '',
            shift_hours: k.shift_hours || '',
            services: k.services || '',
            base_price: k.base_price ? k.base_price.toString() : '',
            img_url: k.img_url || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus kapster ini?")) {
            await supabase.from('kapsters').delete().eq('id', id);
            fetchKapsters();
        }
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setImageFile(null);
        setFormData({
            name: "", specialty: "Senior Barber", experience: "", description: "", 
            shift_days: "", shift_hours: "", services: "", base_price: "", img_url: ""
        });
        setIsModalOpen(true);
    };

    return (
        <div className="flex-1 w-full pb-12 bg-[#F8FAFC] min-h-screen p-4 md:p-8 font-sans selection:bg-slate-800 selection:text-white">
            <PageHeader title="Manajemen Kapster" breadcrumb={["Dashboard", "Kapster"]}>
                <button 
                    onClick={openAddModal} 
                    className="shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl border-none flex items-center gap-2 font-bold text-sm"
                >
                    <FaPlus /> Tambah Kapster
                </button>
            </PageHeader>

            <div className="mt-8 bg-white p-2 md:p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <Tabs defaultValue="jadwal" className="w-full">
                    {/* Pembungkus TabsList yang lebih modern */}
                    <div className="flex justify-center md:justify-start mb-8">
                        <TabsList className="bg-slate-100/80 p-1.5 rounded-2xl">
                            <TabsTrigger 
                                value="jadwal" 
                                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm px-8 py-3 transition-all duration-300 text-sm font-bold text-slate-500 hover:text-slate-700"
                            >
                                Jadwal & Layanan
                            </TabsTrigger>
                            <TabsTrigger 
                                value="profil" 
                                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm px-8 py-3 transition-all duration-300 text-sm font-bold text-slate-500 hover:text-slate-700"
                            >
                                Profil Kapster
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* TABS 1: JADWAL & LAYANAN */}
                    <TabsContent value="jadwal" className="animate-in fade-in-50 duration-500 slide-in-from-bottom-4">
                        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-900">
                                    <TableRow className="hover:bg-slate-900 border-none">
                                        <TableHead className="font-bold text-slate-100 py-6 px-6 text-[12px] uppercase tracking-widest rounded-tl-3xl">Hari Shift</TableHead>
                                        <TableHead className="font-bold text-slate-100 text-[12px] uppercase tracking-widest">Jam Kerja</TableHead>
                                        <TableHead className="font-bold text-slate-100 text-[12px] uppercase tracking-widest">Kapster Bertugas</TableHead>
                                        <TableHead className="font-bold text-slate-100 text-[12px] uppercase tracking-widest">Fokus Layanan</TableHead>
                                        <TableHead className="text-right font-bold text-slate-100 px-6 text-[12px] uppercase tracking-widest rounded-tr-3xl">Estimasi Tarif</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan="5" className="text-center py-10">Loading...</TableCell></TableRow>
                                    ) : kapsters.length === 0 ? (
                                        <TableRow><TableCell colSpan="5" className="text-center py-10">Belum ada jadwal, silakan tambah kapster.</TableCell></TableRow>
                                    ) : (
                                        kapsters.map((k) => (
                                            <TableRow key={k.id} className="hover:bg-slate-50/80 transition-all duration-300 group border-b border-slate-100">
                                                <TableCell className="py-6 px-6">
                                                    <div className="font-black text-slate-800 text-base">{k.shift_days || '-'}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-[11px] text-slate-600 font-bold bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full uppercase tracking-wider">
                                                        {k.shift_hours || '-'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-black text-slate-900 text-base">{k.name}</div>
                                                    <div className="text-[11px] text-emerald-600 font-black tracking-widest uppercase mt-1">{k.specialty}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(k.services || 'All Services').split(',').map((s, idx) => (
                                                            <span key={idx} className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{s.trim()}</span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right px-6">
                                                    <div className="font-black text-slate-900 text-lg group-hover:scale-110 transition-transform origin-right">Rp {k.base_price?.toLocaleString('id-ID') || '0'}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Mulai Dari</div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* TABS 2: PROFIL KAPSTER */}
                    <TabsContent value="profil" className="animate-in fade-in-50 duration-500 slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                            {isLoading ? (
                                <div className="col-span-full text-center py-10 font-bold text-slate-500">Loading...</div>
                            ) : kapsters.length === 0 ? (
                                <div className="col-span-full text-center py-10 font-bold text-slate-500">Belum ada kapster.</div>
                            ) : (
                                kapsters.map(k => (
                                    <div key={k.id} className="group relative overflow-hidden bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-slate-800 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 group-hover:bg-slate-900 transition-colors duration-500"></div>
                                        
                                        <div className="flex flex-col sm:flex-row items-start gap-6">
                                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl group-hover:-translate-y-2 transition-transform duration-500">
                                                <AvatarImage src={k.img_url} className="object-cover" />
                                                <AvatarFallback className="bg-slate-900 text-white font-black text-2xl">{k.name.substring(0,2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="pt-2">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{k.name}</h4>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(k)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"><FaEdit /></button>
                                                        <button onClick={() => handleDelete(k.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"><FaTrash /></button>
                                                    </div>
                                                </div>
                                                <span className="inline-block mt-2 text-[10px] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md font-black uppercase tracking-widest border border-emerald-100">
                                                    {k.specialty}
                                                </span>
                                                <p className="text-sm text-slate-500 leading-relaxed font-medium mt-4">
                                                    {k.description || 'Belum ada deskripsi.'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-2 font-bold">Pengalaman: {k.experience || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal Tambah/Edit Kapster */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
                    <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative my-auto">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                            <FaTimes />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Kapster' : 'Tambah Kapster Baru'}</h2>
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nama Kapster</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: Bang Rian" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Spesialisasi</label>
                                    <input required type="text" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: Senior Barber" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Pengalaman</label>
                                    <input type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: 5 Tahun" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Foto Kapster (Opsional)</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files[0])} 
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" 
                                    />
                                    {formData.img_url && !imageFile && (
                                      <div className="mt-2 text-xs text-green-600 flex items-center gap-1">Foto saat ini: {formData.img_url.substring(0, 30)}...</div>
                                    )}
                                    {imageFile && (
                                      <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">Foto baru dipilih: {imageFile.name}</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                                <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none resize-none" placeholder="Spesialis potongan Fade..." />
                            </div>

                            <hr className="my-2 border-slate-100" />
                            <h3 className="font-bold text-slate-800">Jadwal & Layanan</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Hari Shift</label>
                                    <input type="text" value={formData.shift_days} onChange={e => setFormData({...formData, shift_days: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: Senin - Rabu" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Jam Shift</label>
                                    <input type="text" value={formData.shift_hours} onChange={e => setFormData({...formData, shift_hours: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: 10:00 - 20:00 WIB" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Layanan (Pisahkan koma)</label>
                                    <input type="text" value={formData.services} onChange={e => setFormData({...formData, services: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: Signature Cut, Fade" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Tarif Mulai Dari (Rp)</label>
                                    <input type="number" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none" placeholder="Cth: 75000" />
                                </div>
                            </div>

                            <button type="submit" disabled={isUploading} className={`mt-4 text-white font-bold py-3 rounded-xl transition-colors ${isUploading ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}>
                                {isUploading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Tambah Kapster'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}