import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const RtDashboard = () => {
    const currentRt = JSON.parse(localStorage.getItem('user') || '{}');
    const [stats, setStats] = useState({
        surat_menunggu: 0,
        surat_diteruskan: 0,
        aduan_menunggu: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistik = async () => {
            try {
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

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6 p-2">
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm">Panel Verifikator RT</span>
                        <h1 className="text-3xl font-extrabold mt-3">Dasbor Pengurus RT</h1>
                        <p className="text-blue-100 text-sm mt-1">Halo Bapak/Ibu {currentRt.nama_lengkap}. Ada beberapa berkas warga yang menunggu validasi Anda hari ini.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Surat Menunggu Validasi</p>
                        <p className="text-4xl font-extrabold text-amber-600 mt-2">{loading ? '...' : stats.surat_menunggu}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aduan Menunggu Validasi</p>
                        <p className="text-4xl font-extrabold text-rose-600 mt-2">{loading ? '...' : stats.aduan_menunggu}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Diteruskan ke Kelurahan</p>
                        <p className="text-4xl font-extrabold text-emerald-600 mt-2">{loading ? '...' : stats.surat_diteruskan}</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};