import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const TanggapiMasalah = () => {
    const [daftarPengaduan, setDaftarPengaduan] = useState([]);
    const [tanggapanText, setTanggapanText] = useState('');
    const [activeLaporanId, setActiveLaporanId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAduan = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/pengaduan');
            setDaftarPengaduan(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAduan(); }, []);

    // FUNGSI: Simpan atau Edit Tanggapan
    const handleKirimTanggapan = async (id) => {
        if (!tanggapanText.trim()) return alert("Memo wajib diisi!");
        try {
            await axios.put(`/api/admin/pengaduan/${id}`, { tanggapan_admin: tanggapanText });
            alert("Memo tanggapan berhasil disimpan!");
            fetchAduan();
            setTanggapanText(''); setActiveLaporanId(null);
        } catch (err) {
            alert("Gagal menyimpan tanggapan!");
        }
    };

    // FUNGSI BARU: Hapus Pengaduan
    const handleDeletePengaduan = async (id) => {
        if (!window.confirm("Yakin ingin menghapus laporan aduan ini secara permanen?")) return;
        try {
            await axios.delete(`/api/admin/pengaduan/${id}`);
            alert("Laporan berhasil dihapus!");
            fetchAduan();
        } catch (err) {
            alert("Gagal menghapus laporan.");
        }
    };

    // FUNGSI BARU: Buka Mode Edit untuk Tanggapan yang sudah ada
    const mulaiEditTanggapan = (aduan) => {
        setActiveLaporanId(aduan.id);
        setTanggapanText(aduan.tanggapan_admin || '');
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6 p-2">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Pusat Resolusi Pengaduan</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Pantau, tanggapi, edit, atau hapus laporan masalah dari warga.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {loading ? <p className="text-center py-6 text-slate-500">Memuat data...</p> : 
                    daftarPengaduan.map((aduan) => (
                        <div key={aduan.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                            
                            <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
                                <div>
                                    <span className="text-sm font-extrabold text-slate-900">{aduan.nama_lengkap}</span>
                                    <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase">{new Date(aduan.created_at).toLocaleDateString('id-ID')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded border uppercase ${aduan.status === 'selesai' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                        {aduan.status}
                                    </span>
                                    {/* Tombol Hapus Utama */}
                                    <button onClick={() => handleDeletePengaduan(aduan.id)} className="text-[11px] font-extrabold px-2.5 py-1 rounded border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 transition-colors">
                                        Hapus
                                    </button>
                                </div>
                            </div>

                            <div className="text-sm space-y-1">
                                <p className="text-slate-800 font-bold text-base">{aduan.judul}</p>
                                <p className="text-slate-600 font-medium leading-relaxed">{aduan.deskripsi}</p>
                            </div>

                            {/* Kotak Memo (Hanya tampil jika sudah ada tanggapan dan tidak sedang diedit) */}
                            {aduan.tanggapan_admin && activeLaporanId !== aduan.id && (
                                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative group">
                                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Tanggapan Admin:</span>
                                    <p className="text-sm text-slate-700 font-medium">{aduan.tanggapan_admin}</p>
                                    {/* Tombol Edit Tanggapan */}
                                    <button onClick={() => mulaiEditTanggapan(aduan)} className="absolute top-3 right-3 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        Edit Memo
                                    </button>
                                </div>
                            )}

                            {/* Tombol Beri Tanggapan (Jika belum selesai) */}
                            <div className="pt-2 flex justify-end">
                                {aduan.status !== 'selesai' && activeLaporanId !== aduan.id && (
                                    <button onClick={() => mulaiEditTanggapan(aduan)} className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 shadow">
                                        Beri Tanggapan Teknis
                                    </button>
                                )}
                            </div>

                            {/* Form Textarea (Tampil saat mode Beri Tanggapan atau Edit Tanggapan) */}
                            {activeLaporanId === aduan.id && (
                                <div className="space-y-3 pt-3 border-t border-dashed border-slate-200">
                                    <textarea 
                                        value={tanggapanText} 
                                        onChange={(e) => setTanggapanText(e.target.value)} 
                                        placeholder="Tuliskan catatan tindak lanjut..." 
                                        className="w-full min-h-[90px] p-2.5 border border-slate-300 rounded-xl text-sm focus:border-emerald-500 outline-none" 
                                    />
                                    <div className="flex justify-end gap-2 text-xs font-bold">
                                        <button onClick={() => { setActiveLaporanId(null); setTanggapanText(''); }} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg">Batal</button>
                                        <button onClick={() => handleKirimTanggapan(aduan.id)} className="px-4 py-1.5 text-white bg-emerald-600 rounded-lg shadow">
                                            {aduan.status === 'selesai' ? 'Update Memo' : 'Simpan Memo'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};