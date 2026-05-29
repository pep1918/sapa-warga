import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

// Mengambil URL dari .env Vite, dengan fallback ke localhost:5000 jika .env belum dibuat
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
            console.error("Gagal memuat surat RT:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchSurat(); 
    }, []);

    const handleValidasi = async (id, statusTarget) => {
        if (statusTarget === 'ditolak_rt' && !pesanTolak.trim()) {
            return alert("Wajib mengisi alasan penolakan!");
        }
        
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
            setSelectedSuratId(null); 
            setPesanTolak('');
        } catch (err) {
            console.error(err);
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
                    {loading ? (
                        <p className="text-center py-6 text-slate-500">Memuat data...</p> 
                    ) : antreanSurat.length === 0 ? (
                        <p className="text-center py-6 text-slate-400">Tidak ada antrean surat yang perlu divalidasi saat ini.</p> 
                    ) : (
                        <div className="space-y-4">
                            {antreanSurat.map((surat) => (
                                <div key={surat.id} className="border border-slate-200 p-4 rounded-xl hover:bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
                                    <div className="flex-1 w-full">
                                        <h3 className="font-bold text-slate-900">
                                            {surat.nama_lengkap || 'Nama Tidak Ditemukan'} 
                                            <span className="text-xs font-normal text-slate-500 ml-1">
                                                (NIK: {surat.nik || '-'})
                                            </span>
                                        </h3>
                                        <p className="text-sm font-bold text-emerald-700 mt-1">{surat.jenis_surat}</p>
                                        <p className="text-xs text-slate-600 mt-1 border-l-2 border-slate-300 pl-2">{surat.keperluan}</p>
                                        
                                        {/* --- AREA DOKUMEN PENDUKUNG --- */}
                                        {surat.dokumen_pendukung && (
                                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                                                <span className="text-xs font-semibold text-slate-500">Dokumen Lampiran:</span>
                                                <a 
                                                    href={`${BACKEND_URL}/uploads/${surat.dokumen_pendukung}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-[11px] font-bold rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-1 w-max"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Lihat Dokumen
                                                </a>
                                            </div>
                                        )}
                                        {/* --- AKHIR AREA DOKUMEN --- */}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                                        {selectedSuratId === surat.id ? (
                                            <div className="flex gap-2 w-full">
                                                <input 
                                                    type="text" 
                                                    value={pesanTolak} 
                                                    onChange={(e) => setPesanTolak(e.target.value)} 
                                                    placeholder="Alasan ditolak..." 
                                                    className="border border-rose-300 px-3 py-1.5 rounded-lg text-xs w-full outline-none focus:border-rose-500" 
                                                />
                                                <button onClick={() => { setSelectedSuratId(null); setPesanTolak(''); }} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">Batal</button>
                                                <button onClick={() => handleValidasi(surat.id, 'ditolak_rt')} className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors">Tolak</button>
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => setSelectedSuratId(surat.id)} className="flex-1 md:flex-none px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors">Tolak Data</button>
                                                <button onClick={() => handleValidasi(surat.id, 'diteruskan_admin')} className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow hover:bg-blue-700 transition-colors">Valid & Teruskan</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};