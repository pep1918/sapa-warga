import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const RtDashboard = () => {
    const currentRt = JSON.parse(localStorage.getItem('user') || '{}');
    const [stats, setStats] = useState({
        surat_menunggu: 0,
        surat_diteruskan: 0,
        aduan_menunggu: 0
    });
    const [loading, setLoading] = useState(true);

    // Fungsi untuk sapaan dinamis berdasarkan jam
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    useEffect(() => {
        const fetchStatistik = async () => {
            try {
                // Tambahkan delay buatan sedikit (opsional) agar animasi skeleton terlihat smooth
                const res = await axios.get('/api/rt/statistik');
                setStats(res.data);
            } catch (err) {
                console.error("Gagal menarik data statistik:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatistik();
    }, []);

    // Komponen kecil untuk Skeleton Loader
    const SkeletonCard = () => (
        <div className="animate-pulse flex flex-col gap-3">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-10 bg-slate-200 rounded w-1/4 mt-2"></div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 p-2">
                {/* --- HEADER BANNER --- */}
                <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                    {/* Dekorasi Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                    
                    <div className="relative z-10 w-full">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md">
                                Panel Verifikator RT
                            </span>
                            <span className="text-xs text-blue-200 font-medium">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {getGreeting()}, <span className="text-blue-200">{currentRt.nama_lengkap?.split(' ')[0] || 'Bapak/Ibu'}</span>
                        </h1>
                        <p className="text-blue-100 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                            Pantau dan validasi pengajuan surat serta laporan aduan dari warga di lingkungan Anda. Pastikan semua data diverifikasi sebelum diteruskan ke Admin Kelurahan.
                        </p>
                    </div>
                </div>

                {/* --- STATISTIK CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: Surat Menunggu */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                            <svg className="w-24 h-24 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        </div>
                        {loading ? <SkeletonCard /> : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Surat Menunggu</p>
                                </div>
                                <p className="text-4xl font-extrabold text-amber-600 mt-2">{stats.surat_menunggu}</p>
                                <p className="text-[11px] text-slate-400 mt-2 font-medium">Butuh validasi segera</p>
                            </>
                        )}
                    </div>

                    {/* Card 2: Aduan Menunggu */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                            <svg className="w-24 h-24 text-rose-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        </div>
                        {loading ? <SkeletonCard /> : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aduan Menunggu</p>
                                </div>
                                <p className="text-4xl font-extrabold text-rose-600 mt-2">{stats.aduan_menunggu}</p>
                                <p className="text-[11px] text-slate-400 mt-2 font-medium">Laporan warga terbaru</p>
                            </>
                        )}
                    </div>

                    {/* Card 3: Total Selesai */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                            <svg className="w-24 h-24 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        </div>
                        {loading ? <SkeletonCard /> : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selesai Diproses</p>
                                </div>
                                <p className="text-4xl font-extrabold text-emerald-600 mt-2">{stats.surat_diteruskan}</p>
                                <p className="text-[11px] text-slate-400 mt-2 font-medium">Diteruskan ke Kelurahan</p>
                            </>
                        )}
                    </div>
                </div>

                {/* --- QUICK ACTIONS --- */}
                <div className="pt-4">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/rt/validasi-surat" className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Validasi Surat</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Periksa pengajuan surat pengantar warga</p>
                            </div>
                        </Link>
                        
                        <Link to="/rt/validasi-laporan" className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all group">
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg mr-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 group-hover:text-rose-700 transition-colors">Tindak Lanjuti Aduan</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Saring dan proses laporan terbaru dari warga</p>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};