import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const ValidasiSuratRt = () => {
    const [antreanSurat, setAntreanSurat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pesanTolak, setPesanTolak] = useState('');
    const [selectedSuratId, setSelectedSuratId] = useState(null);

    const fetchSurat = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/rt/surat');
            // Hanya tampilkan yang berstatus 'menunggu_rt'
            const filteredData = res.data.filter(s => s.status === 'menunggu_rt');
            setAntreanSurat(filteredData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSurat(); }, []);

    const handleValidasi = async (id, statusTarget) => {
        if (statusTarget === 'ditolak_rt' && !pesanTolak.trim()) return alert("Wajib mengisi alasan penolakan!");
        
        const konfirmasi = window.confirm(statusTarget === 'diteruskan_admin' 
            ? "Yakin data warga sudah benar dan ingin diteruskan ke Kelurahan?" 
            : "Yakin ingin menolak pengajuan surat ini?");
            
        if (!konfirmasi) return;

        try {
            await axios.put(`/api/rt/surat/${id}`, { 
                status: statusTarget, 
                pesan_penolakan: pesanTolak 
            });
            alert("Validasi berhasil disimpan!");
            fetchSurat();
            setSelectedSuratId(null); setPesanTolak('');
        } catch (err) {
            alert("Gagal memproses validasi!");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6 p-2">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Validasi Berkas Surat Warga</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Lakukan pengecekan data warga sebelum dokumen diteruskan ke Admin Kelurahan.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5">
                    {loading ? <p className="text-center py-6 text-slate-500">Memuat data...</p> : 
                    antreanSurat.length === 0 ? <p className="text-center py-6 text-slate-400">Tidak ada antrean surat yang perlu divalidasi saat ini.</p> :
                    <div className="space-y-4">
                        {antreanSurat.map((surat) => (
                            <div key={surat.id} className="border border-slate-200 p-4 rounded-xl hover:bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">{surat.nama_lengkap} <span className="text-xs font-normal text-slate-500">(NIK: {surat.nik})</span></h3>
                                    <p className="text-sm font-bold text-emerald-700 mt-1">{surat.jenis_surat}</p>
                                    <p className="text-xs text-slate-600 mt-1 border-l-2 border-slate-300 pl-2">{surat.keperluan}</p>
                                </div>
                                
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    {selectedSuratId === surat.id ? (
                                        <div className="flex gap-2 w-full">
                                            <input type="text" value={pesanTolak} onChange={(e) => setPesanTolak(e.target.value)} placeholder="Alasan ditolak..." className="border border-rose-300 px-3 py-1.5 rounded-lg text-xs w-full outline-none focus:border-rose-500" />
                                            <button onClick={() => setSelectedSuratId(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">Batal</button>
                                            <button onClick={() => handleValidasi(surat.id, 'ditolak_rt')} className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg">Tolak</button>
                                        </div>
                                    ) : (
                                        <>
                                            <button onClick={() => setSelectedSuratId(surat.id)} className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors">Tolak Data</button>
                                            <button onClick={() => handleValidasi(surat.id, 'diteruskan_admin')} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow hover:bg-blue-700 transition-colors">Valid & Teruskan</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>
        </DashboardLayout>
    );
};