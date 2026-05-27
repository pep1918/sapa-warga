import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const KelolaSurat = () => {
    const [daftarSurat, setDaftarSurat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pesanTolak, setPesanTolak] = useState('');
    const [activeTolakId, setActiveTolakId] = useState(null);

    const fetchSurat = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/surat');
            setDaftarSurat(res.data);
        } catch (err) {
            console.error("Gagal memuat surat:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurat();
    }, []);

    const handleTindakan = async (id, statusTarget) => {
        let pesanAdmin = 'Surat telah disetujui Kelurahan dan siap untuk diambil/dicetak.';
        
        if (statusTarget === 'ditolak_admin') {
            if (!pesanTolak.trim()) return alert("Wajib memberikan alasan penolakan!");
            pesanAdmin = `[Ditolak Kelurahan]: ${pesanTolak}`;
        } else {
            const konfirmasi = window.confirm("Setujui dan terbitkan surat ini?");
            if (!konfirmasi) return;
        }

        try {
            await axios.put(`/api/admin/surat/${id}`, { 
                status: statusTarget, 
                pesan_admin: pesanAdmin 
            });
            alert("Tindakan berhasil disimpan!");
            fetchSurat();
            setActiveTolakId(null);
            setPesanTolak('');
        } catch (err) {
            alert("Gagal memproses surat.");
            console.error(err);
        }
    };

    // Fungsi kecil untuk mempercantik badge status
    const renderBadgeStatus = (status) => {
        switch(status) {
            case 'diteruskan_admin':
                return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-bold uppercase tracking-wider">Menunggu Kelurahan</span>;
            case 'disetujui_admin':
                return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold uppercase tracking-wider">Disetujui</span>;
            case 'ditolak_admin':
                return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-bold uppercase tracking-wider">Ditolak</span>;
            default:
                return <span className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-[10px] font-bold uppercase tracking-wider">{status}</span>;
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6 p-2">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Tindak Lanjut Surat (Pusat)</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Kelola dan setujui penerbitan surat yang telah divalidasi oleh pengurus RT.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5">
                    {loading ? (
                        <p className="text-center py-8 text-slate-500 font-medium">Memuat data antrean surat...</p>
                    ) : daftarSurat.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-500 font-medium">Belum ada surat yang diteruskan oleh RT ke tingkat Kelurahan.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {daftarSurat.map((surat) => (
                                <div key={surat.id} className="border border-slate-200 p-5 rounded-xl hover:bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-extrabold text-slate-900 text-lg">{surat.nama_lengkap}</h3>
                                            {renderBadgeStatus(surat.status)}
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">NIK: {surat.nik}</p>
                                        
                                        <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg mt-2">
                                            <p className="text-sm font-bold text-blue-800">{surat.jenis_surat}</p>
                                            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{surat.keperluan}</p>
                                        </div>
                                        
                                        {/* Tampilkan pesan penolakan/persetujuan jika sudah diproses */}
                                        {surat.status !== 'diteruskan_admin' && surat.pesan_admin && (
                                            <p className="text-xs font-medium text-slate-500 italic mt-2">
                                                Catatan: "{surat.pesan_admin}"
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* AREA TOMBOL AKSI: Hanya muncul jika statusnya masih 'diteruskan_admin' */}
                                    {surat.status === 'diteruskan_admin' && (
                                        <div className="w-full md:w-auto mt-4 md:mt-0">
                                            {activeTolakId === surat.id ? (
                                                <div className="flex flex-col gap-2 w-full min-w-[250px] bg-rose-50 p-3 rounded-lg border border-rose-100">
                                                    <input 
                                                        type="text" value={pesanTolak} onChange={(e) => setPesanTolak(e.target.value)} 
                                                        placeholder="Alasan penolakan Kelurahan..." 
                                                        className="border border-rose-300 px-3 py-2 rounded-lg text-xs outline-none focus:border-rose-500 bg-white" 
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={() => { setActiveTolakId(null); setPesanTolak(''); }} className="px-3 py-1.5 bg-white text-slate-600 border border-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100">Batal</button>
                                                        <button onClick={() => handleTindakan(surat.id, 'ditolak_admin')} className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700">Kirim Penolakan</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 w-full md:w-auto">
                                                    <button onClick={() => setActiveTolakId(surat.id)} className="flex-1 md:flex-none px-4 py-2.5 bg-white text-rose-600 border border-rose-200 text-xs font-bold rounded-lg hover:bg-rose-50 transition-colors">Tolak Penerbitan</button>
                                                    <button onClick={() => handleTindakan(surat.id, 'disetujui_admin')} className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-emerald-200 hover:bg-emerald-700 transition-colors">Setujui & Terbitkan</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};