import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const ValidasiLaporanRt = () => {
    const [daftarAduan, setDaftarAduan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tanggapanRt, setTanggapanRt] = useState('');
    const [activeId, setActiveId] = useState(null);

    const fetchAduan = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/rt/pengaduan');
            const filteredData = res.data.filter(a => a.status === 'menunggu_rt');
            setDaftarAduan(filteredData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAduan(); }, []);

    const handleValidasi = async (id, statusTarget) => {
        if (statusTarget === 'ditolak_rt' && !tanggapanRt.trim()) return alert("Tuliskan alasan kenapa laporan ini ditolak/dianggap spam!");
        
        try {
            await axios.put(`/api/rt/pengaduan/${id}`, { 
                status: statusTarget, 
                tanggapan_rt: tanggapanRt 
            });
            alert("Laporan berhasil diproses!");
            fetchAduan();
            setActiveId(null); setTanggapanRt('');
        } catch (err) {
            alert("Gagal memproses laporan.");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6 p-2">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Filter Laporan & Aduan Warga</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Saring laporan yang valid untuk diteruskan ke Kelurahan, dan tolak laporan yang tidak relevan.</p>
                </div>

                <div className="space-y-4">
                    {loading ? <p className="text-center py-6 text-slate-500 bg-white rounded-xl">Memuat data...</p> : 
                    daftarAduan.length === 0 ? <p className="text-center py-8 text-slate-400 bg-slate-50 border border-dashed rounded-xl">Tidak ada laporan baru dari warga.</p> :
                    daftarAduan.map((aduan) => (
                        <div key={aduan.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <span className="text-sm font-extrabold text-slate-900">{aduan.nama_lengkap}</span>
                                <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase">{new Date(aduan.created_at).toLocaleDateString('id-ID')}</p>
                            </div>
                            
                            <div className="text-sm space-y-1">
                                <p className="text-slate-800 font-bold text-base">{aduan.judul}</p>
                                <p className="text-slate-600 font-medium leading-relaxed">{aduan.deskripsi}</p>
                            </div>

                            {/* --- BLOK TAMBAHAN: MENAMPILKAN DOKUMEN/GAMBAR --- */}
                            {/* Pastikan properti "aduan.dokumen" sesuai dengan nama kolom di database-mu */}
                            {aduan.dokumen && (
                                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 inline-block">
                                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Dokumen Lampiran</p>
                                    <img 
                                        // Menembak langsung ke port 5000 backend Express
                                        src={`http://localhost:5000/uploads/${aduan.dokumen}`} 
                                        alt={`Lampiran dari ${aduan.nama_lengkap}`} 
                                        className="w-full max-w-sm h-auto rounded-lg border border-slate-200 object-cover shadow-sm transition-transform hover:scale-[1.02]"
                                        onError={(e) => {
                                            // Fallback jika gambar gagal dimuat agar UI tidak rusak
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/400x300/f8fafc/94a3b8?text=Gambar+Tidak+Ditemukan';
                                        }}
                                    />
                                </div>
                            )}
                            {/* ------------------------------------------------ */}

                            {activeId === aduan.id ? (
                                <div className="space-y-3 pt-3 border-t border-dashed border-slate-200">
                                    <textarea 
                                        value={tanggapanRt} onChange={(e) => setTanggapanRt(e.target.value)} 
                                        placeholder="Tambahkan catatan khusus untuk Admin Kelurahan (jika diteruskan) ATAU alasan penolakan (jika ditolak)..." 
                                        className="w-full min-h-[70px] p-2.5 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none" 
                                    />
                                    <div className="flex justify-end gap-2 text-xs font-bold">
                                        <button onClick={() => { setActiveId(null); setTanggapanRt(''); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg">Batal</button>
                                        <button onClick={() => handleValidasi(aduan.id, 'ditolak_rt')} className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow">Tolak Laporan</button>
                                        <button onClick={() => handleValidasi(aduan.id, 'diteruskan_admin')} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow">Teruskan ke Admin</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-2 flex justify-end">
                                    <button onClick={() => setActiveId(aduan.id)} className="px-5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 border border-slate-200 transition-colors">
                                        Beri Tindakan
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};