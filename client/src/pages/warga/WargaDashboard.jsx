import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const WargaDashboard = () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [stats, setStats] = useState({ totalSurat: 0, disetujui: 0, menunggu: 0, pengaduan: 0 });
    const [riwayatSurat, setRiwayatSurat] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUser.id) return;
            try {
                // Ambil Statistik
                const resStats = await axios.get(`/api/warga/statistik/${currentUser.id}`);
                setStats(resStats.data);

                // Ambil Riwayat Surat Warga
                const resRiwayat = await axios.get(`/api/warga/surat/${currentUser.id}`);
                setRiwayatSurat(resRiwayat.data);
            } catch (err) {
                console.error("Gagal memuat data dasbor warga:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [currentUser.id]);

    // FUNGSI PENERJEMAH STATUS DATABASE KE UI CANTIK
    const renderBadgeStatus = (status) => {
        switch(status) {
            case 'menunggu_rt':
                return <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">Menunggu Validasi RT</span>;
            case 'diteruskan_admin':
                return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">Diproses Kelurahan</span>;
            case 'disetujui_admin':
            case 'disetujui':
                return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">Selesai / Disetujui</span>;
            case 'ditolak_rt':
            case 'ditolak_admin':
            case 'ditolak':
                return <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">Ditolak</span>;
            default:
                return <span className="px-3 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">{status}</span>;
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 p-2">
                
                {/* UCAPAN SELAMAT DATANG */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-extrabold">Halo, {currentUser.nama_lengkap}! 👋</h1>
                        <p className="text-emerald-100 mt-2 text-sm max-w-xl leading-relaxed">
                            Selamat datang di Portal Digital Sapa Warga. Anda dapat memantau status pengajuan surat dan laporan masalah lingkungan langsung dari dasbor ini.
                        </p>
                    </div>
                    {/* Hiasan background transparan */}
                    <svg className="absolute right-0 top-0 h-full w-48 text-white opacity-10 transform translate-x-10 -translate-y-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                </div>

                {/* KARTU STATISTIK */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pengajuan</p>
                        <p className="text-3xl font-black text-slate-800 mt-1">{loading ? '-' : stats.totalSurat}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Sedang Diproses</p>
                        <p className="text-3xl font-black text-amber-600 mt-1">{loading ? '-' : stats.menunggu}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Selesai / Terbit</p>
                        <p className="text-3xl font-black text-emerald-600 mt-1">{loading ? '-' : stats.disetujui}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Laporan Aduan</p>
                        <p className="text-3xl font-black text-rose-600 mt-1">{loading ? '-' : stats.pengaduan}</p>
                    </div>
                </div>

                {/* RIWAYAT PENGAJUAN TERAKHIR */}
                <div>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 border-l-4 border-emerald-500 pl-3">Riwayat Surat Anda</h2>
                        </div>
                        <Link to="/warga/pengajuan" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                            + Buat Pengajuan Baru
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {loading ? (
                            <p className="text-center py-8 text-slate-500 text-sm font-medium">Memuat riwayat...</p>
                        ) : riwayatSurat.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50">
                                <p className="text-slate-500 text-sm font-medium">Anda belum pernah mengajukan surat.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {riwayatSurat.map((surat) => (
                                    <div key={surat.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold mb-1">{new Date(surat.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            <h3 className="font-bold text-slate-900 text-sm">{surat.jenis_surat}</h3>
                                            <p className="text-xs text-slate-600 mt-1 line-clamp-1">{surat.keperluan}</p>
                                            
                                            {/* Catatan dari RT/Admin (Jika Ada Penolakan / Disetujui) */}
                                            {surat.pesan_admin && (
                                                <p className="text-[11px] font-medium text-slate-500 italic mt-2 bg-slate-100 px-3 py-1.5 rounded-md inline-block">
                                                    Info: {surat.pesan_admin}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                            {renderBadgeStatus(surat.status)}
                                            
                                            {/* TOMBOL CETAK: Hanya muncul jika statusnya Hijau (Selesai/Disetujui) */}
                                            {(surat.status === 'disetujui_admin' || surat.status === 'disetujui') && (
                                                <Link 
                                                    to="/warga/cetak-surat" 
                                                    state={{ surat: surat }} 
                                                    className="mt-1 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white text-[11px] font-extrabold rounded-lg shadow-sm shadow-emerald-200 flex items-center gap-1.5 transition-all transform hover:scale-105"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                                    Cetak Dokumen
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};