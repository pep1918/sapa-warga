import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const KelolaSurat = () => {
    const [antreanSurat, setAntreanSurat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pesanAdmin, setPesanAdmin] = useState('');
    const [selectedSuratId, setSelectedSuratId] = useState(null);

    const fetchSuratMasuk = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/surat');
            setAntreanSurat(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSuratMasuk(); }, []);

    const handleUpdateStatus = async (id, statusTarget) => {
        if (statusTarget === 'ditolak' && !pesanAdmin.trim()) return alert("Isi alasan penolakan!");
        try {
            await axios.put(`/api/admin/surat/${id}`, { status: statusTarget, pesan_admin: pesanAdmin || 'Disetujui RT' });
            fetchSuratMasuk();
            setSelectedSuratId(null); setPesanAdmin('');
        } catch (err) {
            alert("Gagal mengupdate status!");
        }
    };

    // FUNGSI BARU: Hapus Surat
    const handleDeleteSurat = async (id) => {
        if (!window.confirm("Yakin ingin menghapus permanen surat ini?")) return;
        try {
            await axios.delete(`/api/admin/surat/${id}`);
            alert("Surat berhasil dihapus!");
            fetchSuratMasuk();
        } catch (err) {
            alert("Gagal menghapus surat.");
        }
    };

    const cetakSuratAdmin = (surat) => {
        // Logika cetak PDF (sama seperti sebelumnya, disingkat untuk fokus pada CRUD)
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><body style="padding:50px; font-family:serif;"><h2>SURAT PENGANTAR</h2><p>Nama: ${surat.nama_lengkap}</p><p>Keperluan: ${surat.keperluan}</p><script>window.print();window.close();</script></body></html>`);
        printWindow.document.close();
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6 p-2">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Manajemen Antrean Berkas</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Kelola, validasi, dan hapus berkas warga.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b text-[13px] uppercase">
                            <tr>
                                <th className="px-6 py-4">Nama & NIK</th>
                                <th className="px-6 py-4">Jenis Surat</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? <tr><td colSpan="4" className="text-center py-6">Memuat...</td></tr> : 
                            antreanSurat.map((surat) => (
                                <tr key={surat.id} className="hover:bg-slate-50/40">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{surat.nama_lengkap}</p>
                                        <p className="text-xs text-slate-400">NIK: {surat.nik || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-800">{surat.jenis_surat}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${surat.status === 'disetujui' ? 'bg-green-50 text-green-700' : surat.status === 'ditolak' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{surat.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {surat.status === 'menunggu' && selectedSuratId !== surat.id ? (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(surat.id, 'disetujui')} className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">Setujui</button>
                                                    <button onClick={() => setSelectedSuratId(surat.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700">Tolak</button>
                                                </>
                                            ) : selectedSuratId === surat.id ? (
                                                <div className="flex flex-col gap-2">
                                                    <input type="text" value={pesanAdmin} onChange={(e) => setPesanAdmin(e.target.value)} placeholder="Alasan ditolak..." className="border px-2 py-1 rounded text-xs" />
                                                    <div className="flex gap-1 justify-end">
                                                        <button onClick={() => setSelectedSuratId(null)} className="px-2 py-1 bg-slate-100 text-xs font-bold rounded">Batal</button>
                                                        <button onClick={() => handleUpdateStatus(surat.id, 'ditolak')} className="px-2 py-1 bg-rose-600 text-white text-xs font-bold rounded">Kirim</button>
                                                    </div>
                                                </div>
                                            ) : surat.status === 'disetujui' && (
                                                <button onClick={() => cetakSuratAdmin(surat)} className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">Cetak PDF</button>
                                            )}
                                            
                                            {/* TOMBOL HAPUS UNTUK ADMIN */}
                                            {selectedSuratId !== surat.id && (
                                                <button onClick={() => handleDeleteSurat(surat.id)} className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 ml-2">Hapus</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};