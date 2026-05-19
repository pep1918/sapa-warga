import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';

export const AdminDashboard = () => {
    // Data dummy untuk simulasi statistik admin
    const [stats] = useState({
        totalWarga: 142,
        suratPending: 5,
        laporanKritis: 2
    });

    // Data dummy riwayat pengajuan surat masuk dari warga
    const [pengajuanMasuk] = useState([
        { id: 1, nama: "Aufa Nuur Rafif", jenis: "Surat Keterangan Usaha (SKU)", tanggal: "19 Mei 2026", status: "Menunggu" },
        { id: 2, nama: "Budi Santoso", jenis: "Surat Keterangan Domisili", tanggal: "18 Mei 2026", status: "Disetujui" },
        { id: 3, nama: "Siti Aminah", jenis: "Surat Keterangan Tidak Mampu", tanggal: "17 Mei 2026", status: "Ditolak" }
    ]);

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Utama Admin */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Panel Kendali Administrasi</h1>
                        <p className="text-sm text-slate-500 mt-1">Kelola data warga, permohonan surat pengantar, dan pengaduan lingkungan.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" className="bg-white">Unduh Laporan Bulanan</Button>
                        <Button variant="primary">Tulis Berita Baru</Button>
                    </div>
                </div>

                {/* Grid Statistik - Menggunakan gaya kedalaman warna yang selaras dengan Warga */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Total Warga Terdaftar</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-slate-900">{stats.totalWarga}</span>
                            <span className="text-xs font-semibold text-slate-500">Jiwa</span>
                        </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5 ring-1 ring-amber-500/10">
                        <span className="text-[13px] font-bold text-amber-600 uppercase tracking-wider">Antrean Surat Pengantar</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-amber-600">{stats.suratPending}</span>
                            <span className="text-xs font-semibold text-amber-500">Perlu Validasi</span>
                        </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5 ring-1 ring-rose-500/10">
                        <span className="text-[13px] font-bold text-rose-600 uppercase tracking-wider">Laporan Masalah Kritis</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-rose-600">{stats.laporanKritis}</span>
                            <span className="text-xs font-semibold text-rose-500">Butuh Peninjauan</span>
                        </div>
                    </div>
                </div>

                {/* Tabel Kendali Data Masuk */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900">Permohonan Surat Terbaru</h2>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">Real-time</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[13px] font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Nama Pemohon</th>
                                    <th className="px-6 py-4">Jenis Dokumen</th>
                                    <th className="px-6 py-4">Tanggal Masuk</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi Kerja</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-[14px]">
                                {pengajuanMasuk.map((item) => {
                                    // Penentuan warna badge status dinamis profesional
                                    const badgeColor = item.status === 'Disetujui' 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                        : item.status === 'Ditolak' 
                                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                                        : 'bg-amber-50 text-amber-700 border-amber-200';

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">{item.nama}</td>
                                            <td className="px-6 py-4 text-slate-600">{item.jenis}</td>
                                            <td className="px-6 py-4 text-slate-500">{item.tanggal}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold border ${badgeColor}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button className="px-3 py-1.5 text-[12px] font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors">Setujui</button>
                                                <button className="px-3 py-1.5 text-[12px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors">Tolak</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};