import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const PortalBerita = () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [daftarBerita, setDaftarBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({ judul: '', konten: '', kategori: 'Pengumuman Umum', urgensi: 'Normal' });
    const [editId, setEditId] = useState(null);

    const fetchBerita = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/berita');
            setDaftarBerita(res.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchBerita(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/api/admin/berita/${editId}`, formData);
                alert("Pengumuman berhasil diperbarui!");
            } else {
                await axios.post('/api/admin/berita', { ...formData, admin_id: currentUser.id });
                alert("Pengumuman baru disebarkan!");
            }
            setFormData({ judul: '', konten: '', kategori: 'Pengumuman Umum', urgensi: 'Normal' });
            setEditId(null); fetchBerita();
        } catch (err) { alert("Gagal menyimpan pengumuman."); }
    };

    const handleEdit = (berita) => {
        setEditId(berita.id);
        setFormData({ judul: berita.judul, konten: berita.konten, kategori: berita.kategori || 'Pengumuman Umum', urgensi: berita.urgensi || 'Normal' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus pengumuman ini permanen?")) return;
        try { await axios.delete(`/api/admin/berita/${id}`); fetchBerita(); } catch (err) { alert("Gagal menghapus."); }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6 p-2">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Manajemen Informasi Publik</h1>
                        <p className="text-sm text-slate-500 mt-1">Kelola distribusi informasi, surat edaran, dan peringatan untuk warga.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
                        <h2 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            {editId ? 'Editor Revisi Pengumuman' : 'Draft Pengumuman Baru'}
                        </h2>
                        {editId && <button type="button" onClick={() => { setEditId(null); setFormData({ judul: '', konten: '', kategori: 'Pengumuman Umum', urgensi: 'Normal' }); }} className="text-xs px-3 py-1 bg-rose-50 text-rose-600 font-bold rounded-md hover:bg-rose-100">Batal Revisi</button>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Judul / Subjek Utama</label>
                            <input type="text" required value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} placeholder="" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold text-slate-800" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Klasifikasi Kategori</label>
                            <select value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-indigo-500 font-medium bg-white">
                                <option value="Pengumuman Umum">Pengumuman Umum</option>
                                <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
                                <option value="Kerja Bakti & Lingkungan">Kerja Bakti & Lingkungan</option>
                                <option value="Bantuan Sosial">Bantuan Sosial (Bansos)</option>
                                <option value="Undangan Rapat">Undangan Rapat Warga</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badan Informasi Terperinci</label>
                        <textarea required value={formData.konten} onChange={(e) => setFormData({ ...formData, konten: e.target.value })} placeholder="" className="w-full min-h-[150px] px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none outline-none focus:border-indigo-500 leading-relaxed" />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-slate-100 mt-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tingkat Urgensi Siaran</label>
                            <div className="flex gap-3">
                                <label className={`px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer transition-all ${formData.urgensi === 'Normal' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                    <input type="radio" name="urgensi" value="Normal" checked={formData.urgensi === 'Normal'} onChange={(e) => setFormData({ ...formData, urgensi: e.target.value })} className="hidden" /> Info Standar
                                </label>
                                <label className={`px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer transition-all ${formData.urgensi === 'Penting' ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                    <input type="radio" name="urgensi" value="Penting" checked={formData.urgensi === 'Penting'} onChange={(e) => setFormData({ ...formData, urgensi: e.target.value })} className="hidden" /> Darurat / Penting!
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2">
                            {editId ? 'Simpan Revisi' : 'Siarkan ke Seluruh Warga'}
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                        <h2 className="font-bold text-slate-800">Arsip Siaran Informasi</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {loading ? <p className="text-center py-8 text-slate-500">Memuat arsip...</p> : 
                        daftarBerita.map((berita) => (
                            <div key={berita.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row gap-6">
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {berita.urgensi === 'Penting' && <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider rounded border border-rose-200 animate-pulse">Penting</span>}
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-200">{berita.kategori || 'Umum'}</span>
                                    </div>
                                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{berita.judul}</h3>
                                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{berita.konten}</p>
                                    <div className="flex gap-4 text-xs font-medium text-slate-400 pt-1">
                                        <span>📅 {new Date(berita.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        <span>✍️ {berita.penulis}</span>
                                    </div>
                                </div>
                                <div className="flex lg:flex-col gap-2 justify-end lg:w-32 lg:border-l border-slate-100 lg:pl-6">
                                    <button onClick={() => handleEdit(berita)} className="flex-1 lg:flex-none px-3 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50">Edit Data</button>
                                    <button onClick={() => handleDelete(berita.id)} className="flex-1 lg:flex-none px-3 py-2 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-50">Tarik Siaran</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};