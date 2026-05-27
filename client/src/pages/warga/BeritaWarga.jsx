import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const BeritaWarga = () => {
    const [daftarBerita, setDaftarBerita] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Fitur Pencarian & Filter Kompleks
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKategori, setFilterKategori] = useState('Semua');

    useEffect(() => {
        const fetchBerita = async () => {
            try {
                const res = await axios.get('/api/warga/berita');
                setDaftarBerita(res.data);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchBerita();
    }, []);

    // Logika Pemfilteran Data di sisi Frontend
    const beritaTerfilter = daftarBerita.filter((berita) => {
        const matchKategori = filterKategori === 'Semua' || (berita.kategori || 'Pengumuman Umum') === filterKategori;
        const matchPencarian = berita.judul.toLowerCase().includes(searchTerm.toLowerCase()) || berita.konten.toLowerCase().includes(searchTerm.toLowerCase());
        return matchKategori && matchPencarian;
    });

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6 p-2">
                
                {/* HEADER & FILTER BAR */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Buletin Kelurahan</h1>
                        <p className="text-sm text-slate-500 mt-1">Pantau instruksi, surat edaran, dan kabar terbaru di lingkungan Anda.</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-slate-100">
                        <div className="flex-1 relative">
                            <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input 
                                type="text" placeholder="Cari informasi spesifik..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <select 
                            value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}
                            className="md:w-64 px-4 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold text-slate-700 bg-slate-50"
                        >
                            <option value="Semua">Semua Kategori</option>
                            <option value="Pengumuman Umum">Pengumuman Umum</option>
                            <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
                            <option value="Kerja Bakti & Lingkungan">Kerja Bakti & Lingkungan</option>
                            <option value="Bantuan Sosial">Bantuan Sosial</option>
                            <option value="Undangan Rapat">Undangan Rapat</option>
                        </select>
                    </div>
                </div>

                {/* AREA DAFTAR BERITA */}
                <div className="space-y-5">
                    {loading ? (
                        <div className="flex justify-center py-10"><span className="animate-pulse font-bold text-slate-400">Menyinkronkan data buletin...</span></div>
                    ) : beritaTerfilter.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                            <p className="text-slate-500 font-bold text-lg">Tidak ada informasi yang sesuai.</p>
                            <p className="text-slate-400 text-sm mt-1">Coba ubah kata kunci atau filter kategori Anda.</p>
                        </div>
                    ) : (
                        beritaTerfilter.map((berita) => (
                            <div key={berita.id} className={`bg-white rounded-2xl border-2 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow ${berita.urgensi === 'Penting' ? 'border-rose-300' : 'border-slate-200'}`}>
                                
                                {/* Aksen Kiri Dinamis */}
                                <div className={`absolute left-0 top-0 bottom-0 w-2 ${berita.urgensi === 'Penting' ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
                                
                                <div className="p-6 sm:p-8 pl-8 sm:pl-10">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {berita.urgensi === 'Penting' && (
                                            <span className="flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-rose-200">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                Peringatan / Penting
                                            </span>
                                        )}
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-md border border-slate-200">
                                            {berita.kategori || 'Pengumuman Umum'}
                                        </span>
                                    </div>

                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-3">
                                        {berita.judul}
                                    </h2>
                                    
                                    <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                        {berita.konten}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            Dipublikasi: {new Date(berita.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            Otoritas: {berita.penulis}
                                        </span>
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