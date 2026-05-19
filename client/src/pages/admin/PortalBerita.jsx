import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const PortalBerita = () => {
    const currentAdmin = JSON.parse(localStorage.getItem('user') || '{}');
    
    // State Form
    const [judul, setJudul] = useState('');
    const [konten, setKonten] = useState('');
    const [gambar, setGambar] = useState('');
    
    // State Data & Mode Edit
    const [daftarBerita, setDaftarBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null); // Menyimpan ID berita yang sedang diedit

    const fetchBerita = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/berita');
            setDaftarBerita(res.data);
        } catch (err) {
            console.error("Gagal menarik berita:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBerita(); }, []);

    // Fungsi Submit (Menangani Tambah Baru ATAU Simpan Editan)
    const handlePublish = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // Mode Edit: Gunakan metode PUT
                await axios.put(`/api/admin/berita/${editId}`, { judul, konten, gambar });
                alert("Perubahan berita berhasil disimpan!");
            } else {
                // Mode Tambah Baru: Gunakan metode POST
                await axios.post('/api/admin/berita', { admin_id: currentAdmin.id, judul, konten, gambar });
                alert("Berita baru berhasil dipublikasikan!");
            }
            
            // Reset form ke keadaan awal
            batalEdit();
            fetchBerita();
        } catch (err) {
            alert(`Gagal ${editId ? 'memperbarui' : 'mempublikasikan'} berita.`);
        }
    };

    // Fungsi Mengaktifkan Mode Edit
    const mulaiEdit = (item) => {
        setEditId(item.id);
        setJudul(item.judul);
        setKonten(item.konten);
        setGambar(item.gambar === 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80' ? '' : item.gambar);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll otomatis ke form
    };

    // Fungsi Membatalkan Mode Edit
    const batalEdit = () => {
        setEditId(null);
        setJudul('');
        setKonten('');
        setGambar('');
    };

    // Fungsi Menghapus Berita
    const hapusBerita = async (id) => {
        const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini secara permanen?");
        if (!konfirmasi) return;

        try {
            await axios.delete(`/api/admin/berita/${id}`);
            alert("Berita berhasil dihapus!");
            
            // Jika berita yang dihapus sedang diedit, batalkan mode edit
            if (editId === id) batalEdit(); 
            
            fetchBerita();
        } catch (err) {
            alert("Gagal menghapus berita dari database.");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6 p-2">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Manajemen Portal Berita</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola, edit, dan hapus informasi pengumuman untuk warga RT.</p>
                </div>

                {/* Form Dinamis: Menyesuaikan dengan Mode Edit/Tambah */}
                <form onSubmit={handlePublish} className={`rounded-2xl border p-6 shadow-sm space-y-4 transition-colors ${editId ? 'bg-amber-50/30 border-amber-200' : 'bg-white border-slate-200'}`}>
                    {editId && (
                        <div className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg inline-block mb-2">
                            MENGEDIT BERITA
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase">Judul Berita</label>
                            <input required value={judul} onChange={(e) => setJudul(e.target.value)} type="text" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-emerald-500" placeholder="Contoh: Kerja Bakti Hari Minggu" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase">URL Gambar Sampul (Opsional)</label>
                            <input value={gambar} onChange={(e) => setGambar(e.target.value)} type="text" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-emerald-500" placeholder="https://link-gambar.com/foto.jpg" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">Konten Lengkap Pengumuman</label>
                        <textarea required value={konten} onChange={(e) => setKonten(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm min-h-[120px] outline-none focus:border-emerald-500" placeholder="Tulis rincian informasi di sini..." />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        {editId && (
                            <button type="button" onClick={batalEdit} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors">Batal Edit</button>
                        )}
                        <button type="submit" className={`px-6 py-2.5 text-white text-xs font-bold rounded-lg shadow transition-colors ${editId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                            {editId ? 'Simpan Perubahan' : 'Publikasikan Berita'}
                        </button>
                    </div>
                </form>

                {/* Tabel Riwayat Berita dengan Tombol Aksi */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5">
                    <h2 className="font-bold text-slate-800 mb-4 border-l-4 border-emerald-500 pl-3">Riwayat Publikasi Berita</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading ? <p className="text-sm text-slate-500">Memuat berita...</p> :
                        daftarBerita.length === 0 ? <p className="text-sm text-slate-400">Belum ada berita yang diterbitkan.</p> :
                        daftarBerita.map((item) => (
                            <div key={item.id} className="flex gap-4 border border-slate-200 rounded-xl p-3 hover:bg-slate-50 group">
                                <img src={item.gambar} alt="sampul" className="w-24 h-24 object-cover rounded-lg bg-slate-100" />
                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-bold text-slate-900 text-sm">{item.judul}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{new Date(item.created_at).toLocaleDateString('id-ID')} • Oleh: {item.penulis}</p>
                                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 flex-1">{item.konten}</p>
                                    
                                    {/* Tombol Aksi: Edit & Hapus */}
                                    <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => mulaiEdit(item)} className="px-3 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-[10px] font-bold rounded-md transition-colors">Edit</button>
                                        <button onClick={() => hapusBerita(item.id)} className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[10px] font-bold rounded-md transition-colors">Hapus</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};