import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const BeritaWarga = () => {
    const [daftarBerita, setDaftarBerita] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBerita = async () => {
            try {
                const res = await axios.get('/api/warga/berita');
                setDaftarBerita(res.data);
            } catch (err) {
                console.error("Gagal menarik berita:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBerita();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6 p-2">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kabar Lingkungan RT</h1>
                    <p className="text-sm text-slate-500 mt-1">Informasi, pengumuman, dan berita terbaru langsung dari pengurus RT.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-slate-500 font-medium">Memuat portal berita...</p>
                    ) : daftarBerita.length === 0 ? (
                        <p className="text-slate-400 col-span-full text-center py-10 bg-white border border-dashed rounded-2xl">Belum ada pengumuman dari pengurus RT.</p>
                    ) : (
                        daftarBerita.map((berita) => (
                            <div key={berita.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                <div className="h-48 overflow-hidden relative">
                                    <img 
                                        src={berita.gambar} 
                                        alt="sampul berita" 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                                        Pengumuman RT
                                    </div>
                                </div>
                                
                                <div className="p-5 flex-1 flex flex-col">
                                    <h2 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-emerald-700 transition-colors">{berita.judul}</h2>
                                    <p className="text-[11px] text-slate-400 font-semibold mb-4 uppercase tracking-wide">
                                        Dipublikasikan: {new Date(berita.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <div className="text-sm text-slate-600 mb-4 flex-1 line-clamp-4 leading-relaxed text-justify">
                                        {berita.konten}
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Ditulis oleh:</span>
                                        <span className="text-xs font-bold text-emerald-700">{berita.penulis}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};