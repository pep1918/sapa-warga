import React, { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

export const CetakSurat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Mengambil data surat yang dikirim dari Dasbor Warga
    const surat = location.state?.surat;

    // Jika diakses langsung tanpa data surat, kembalikan ke Dasbor
    if (!surat) {
        return <Navigate to="/warga/dashboard" replace />;
    }

    // Tanggal hari ini untuk format tanda tangan
    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-slate-200 py-8 px-4 font-serif text-slate-900">
            {/* KONTROL TOMBOL (Disembunyikan saat dicetak) */}
            <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <button 
                    onClick={() => navigate('/warga/dashboard')}
                    className="px-4 py-2 bg-slate-600 text-white font-bold text-sm rounded-lg hover:bg-slate-700 shadow"
                >
                    &larr; Kembali
                </button>
                <button 
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 shadow flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Cetak Dokumen (PDF)
                </button>
            </div>

            {/* KERTAS A4 SURAT */}
            <div className="max-w-3xl mx-auto bg-white p-10 sm:p-16 shadow-2xl print:shadow-none print:p-0 min-h-[1056px]">
                
                {/* KOP SURAT */}
                <div className="border-b-4 border-slate-900 pb-4 mb-8 text-center flex flex-col items-center">
                    <h1 className="text-xl font-extrabold uppercase tracking-wider">Pemerintah Kota Surabaya</h1>
                    <h2 className="text-2xl font-black uppercase tracking-widest mt-1">Kelurahan Jambangan</h2>
                    <h3 className="text-lg font-bold uppercase mt-1">Rukun Tetangga 02 / Rukun Warga 05</h3>
                    <p className="text-sm mt-2 font-medium">Jl. Raya Karah No. 123, Surabaya, Jawa Timur, 60232</p>
                </div>

                {/* JUDUL SURAT */}
                <div className="text-center mb-10">
                    <h1 className="text-xl font-extrabold underline uppercase">{surat.jenis_surat}</h1>
                    <p className="text-sm font-bold mt-1">Nomor: 400 / {surat.id.substring(0, 5).toUpperCase()} / RT.02 / 2026</p>
                </div>

                {/* ISI SURAT */}
                <div className="space-y-4 text-justify leading-relaxed">
                    <p>Yang bertanda tangan di bawah ini, Ketua RT 02 / RW 05 Kelurahan Jambangan, Kota Surabaya, menerangkan dengan sesungguhnya bahwa:</p>
                    
                    <div className="pl-8 space-y-2 py-2">
                        <div className="flex"><span className="w-48 font-bold">Nama Lengkap</span> <span className="mr-2">:</span> <span className="uppercase font-bold">{currentUser.nama_lengkap}</span></div>
                        <div className="flex"><span className="w-48 font-bold">Nomor KTP (NIK)</span> <span className="mr-2">:</span> <span>{currentUser.nik || '-'}</span></div>
                        <div className="flex"><span className="w-48 font-bold">Alamat Email</span> <span className="mr-2">:</span> <span>{currentUser.email}</span></div>
                    </div>

                    <p>Orang tersebut di atas adalah benar-benar warga yang berdomisili di wilayah RT 02 / RW 05 Kelurahan Jambangan. Surat ini diterbitkan untuk keperluan:</p>
                    
                    <div className="p-4 border border-slate-400 bg-slate-50 italic">
                        "{surat.keperluan}"
                    </div>

                    <p>Demikian surat keterangan ini dibuat dengan sebenar-benarnya berdasarkan data yang valid, untuk dapat dipergunakan sebagaimana mestinya oleh pihak yang berkepentingan.</p>
                </div>

                {/* TANDA TANGAN */}
                <div className="mt-20 flex justify-end">
                    <div className="text-center">
                        <p>Surabaya, {tanggalCetak}</p>
                        <p className="font-bold">Ketua RT 02 / RW 05</p>
                        
                        {/* Area stempel/Ttd digital kosong */}
                        <div className="h-24 flex items-center justify-center opacity-30 mt-2 mb-2">
                            <span className="border-4 border-rose-500 text-rose-500 px-4 py-2 text-xl font-black transform -rotate-12 rounded-lg">VALIDASI DIGITAL</span>
                        </div>

                        <p className="font-extrabold underline uppercase">Bapak RT 02</p>
                        <p className="text-sm">NIP. -</p>
                    </div>
                </div>
            </div>
            
            {/* CSS KHUSUS UNTUK PRINT */}
            <style jsx>{`
                @media print {
                    body { background: white; }
                    @page { margin: 1.5cm; }
                }
            `}</style>
        </div>
    );
};