import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const LaporMasalah = () => {
    // Tarik data aman dari LocalStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // State Form
    const [kategori, setKategori] = useState('Infrastruktur / Fasilitas Umum');
    const [urgensi, setUrgensi] = useState('Sedang');
    const [lokasi, setLokasi] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    
    // State Riwayat
    const [riwayatAduan, setRiwayatAduan] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRiwayatAduan = async () => {
        if (!currentUser.id) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await axios.get(`/api/warga/pengaduan/${currentUser.id}`);
            setRiwayatAduan(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Gagal menarik riwayat:", err);
            setRiwayatAduan([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiwayatAduan();
    }, []);

    const handleAduanSubmit = async (e) => {
        e.preventDefault();
        
        // Pengecekan Sesi 
        if (!currentUser.id) {
            return alert("Sesi ID Anda tidak valid. Wajib Log Out lalu Login kembali!");
        }

        try {
            const payload = {
                warga_id: currentUser.id,
                judul: `[${urgensi}] ${kategori}`, 
                deskripsi: `Lokasi: ${lokasi} | Detail: ${deskripsi}` 
            };

            await axios.post('/api/warga/pengaduan', payload);
            
            alert("Mantap! Laporan Anda berhasil diarsip di sistem RT.");
            
            // Reset Form & Refresh Riwayat
            setLokasi(''); 
            setDeskripsi('');
            fetchRiwayatAduan();
        } catch (err) {
            console.error(err);
            const pesanError = err.response?.data?.error || err.message;
            alert(`Gagal mengirim laporan! \nAlasan: ${pesanError}`);
        }
    };

    const formatTanggal = (isoString) => {
        if(!isoString) return '-';
        return new Date(isoString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 p-2">
                
                {/* === FORM LAPORAN === */}
                <div>
                    <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Pusat Pengaduan Lingkungan</h1>
                            <p className="text-sm text-slate-500 mt-1">Data Pelapor: <span className="font-bold text-emerald-700">{currentUser.nama_lengkap || 'Pengguna'}</span></p>
                        </div>
                    </div>

                    <form onSubmit={handleAduanSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Kategori Masalah</label>
                                <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500">
                                    <option value="Fasilitas Umum (Jalan/Selokan)">Fasilitas Umum (Jalan/Selokan)</option>
                                    <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
                                    <option value="Kebersihan / Sampah">Kebersihan / Sampah</option>
                                    <option value="Masalah Sosial Warga">Masalah Sosial Warga</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Tingkat Urgensi</label>
                                <select value={urgensi} onChange={(e) => setUrgensi(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500 font-bold">
                                    <option value="Rendah" className="text-slate-600">Rendah (Bisa Ditunda)</option>
                                    <option value="Sedang" className="text-amber-600">Sedang (Perlu Perhatian)</option>
                                    <option value="Tinggi" className="text-rose-600">Tinggi / Darurat (Segera)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-slate-700">Lokasi Spesifik Kejadian</label>
                            <input type="text" required value={lokasi} onChange={(e) => setLokasi(e.target.value)} placeholder="" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-slate-700">Kronologi & Deskripsi Lengkap</label>
                            <textarea required value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Tulis detailnya di sini..." className="w-full min-h-[100px] px-3 py-2.5 border border-slate-300 rounded-lg text-sm resize-none outline-none focus:border-emerald-500" />
                        </div>

                        <div className="border-t border-slate-100 pt-4 flex justify-end">
                            <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition-colors text-xs">
                                Kirim 
                            </button>
                        </div>
                    </form>
                </div>

                {/* === RIWAYAT LAPORAN === */}
                <div className="pt-2">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">Riwayat Laporan & Tanggapan</h2>
                    
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-center py-6 text-slate-500 font-medium">Memuat data...</p>
                        ) : riwayatAduan.length === 0 ? (
                            <p className="text-center py-6 text-slate-400 bg-slate-50 border border-dashed rounded-xl">Belum ada riwayat laporan.</p>
                        ) : (
                            riwayatAduan.map((aduan) => (
                                <div key={aduan.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{aduan.judul}</h3>
                                            <p className="text-xs text-slate-400 mt-0.5">{formatTanggal(aduan.created_at)}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                                            aduan.status === 'selesai' ? 'bg-green-50 text-green-700 border-green-200' :
                                            aduan.status === 'diproses' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {aduan.status}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-slate-600">{aduan.deskripsi}</p>

                                    {/* MUNCUL JIKA ADMIN SUDAH MERESPON */}
                                    {aduan.tanggapan_admin && (
                                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                            <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">Tanggapan Admin:</span>
                                            <p className="text-sm text-slate-800 italic">{aduan.tanggapan_admin}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};