import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

export const CetakSurat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Ambil data user dari sesi saat ini
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Mengambil data surat yang dilempar dari WargaDashboard
    const surat = location.state?.surat;

    // Proteksi: Jika diakses paksa lewat URL tanpa data, kembalikan ke Dasbor
    if (!surat) {
        return <Navigate to="/warga/dashboard" replace />;
    }

    // Tanggal format Indonesia untuk area tanda tangan
    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    // FUNGSI PINTAR: Memecah string 'keperluan' menjadi daftar (list) yang rapi
    // Contoh dari DB: "Tujuan Instansi: Bank. Detail Usaha -> Nama: X, Jenis: Y."
    // Akan dipecah berdasarkan tanda titik (.) menjadi array.
    const rincianKeperluan = surat.keperluan
        ? surat.keperluan.split('. ').filter(item => item.trim() !== '').map(item => item.replace('.', ''))
        : ['Tidak ada rincian tambahan.'];

    return (
        <div className="min-h-screen bg-slate-200 py-8 px-4 font-serif text-slate-900">
            
            {/* KONTROL TOMBOL (Otomatis Hilang Saat Dicetak/Diprint) */}
            <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <button 
                    onClick={() => navigate('/warga/dashboard')}
                    className="px-4 py-2 bg-slate-600 text-white font-bold text-sm rounded-lg hover:bg-slate-700 shadow flex items-center gap-2"
                >
                    &larr; Kembali ke Dasbor
                </button>
                <button 
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 shadow flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Cetak Kertas / Simpan PDF
                </button>
            </div>

            {/* LEMBAR KERTAS A4 */}
            <div className="max-w-3xl mx-auto bg-white p-10 sm:p-16 shadow-2xl print:shadow-none print:p-0 min-h-[1056px] relative">
                
                {/* KOP SURAT RESMI */}
                <div className="border-b-4 border-double border-slate-900 pb-4 mb-8 text-center flex flex-col items-center">
                    <h1 className="text-xl font-extrabold uppercase tracking-wider">Pemerintah Kota Surabaya</h1>
                    <h2 className="text-2xl font-black uppercase tracking-widest mt-1">Kelurahan Jambangan</h2>
                    <h3 className="text-lg font-bold uppercase mt-1">Rukun Tetangga 02 / Rukun Warga 05</h3>
                    <p className="text-sm mt-1 font-medium">Sekretariat: Jl. Raya Karah No. 123, Surabaya, Jawa Timur, 60232</p>
                </div>

                {/* NOMOR & JUDUL SURAT */}
                <div className="text-center mb-10">
                    <h1 className="text-xl font-extrabold underline uppercase tracking-wide">
                        {surat.jenis_surat}
                    </h1>
                    {/* Nomor surat di-generate (dummy) dari UUID agar terlihat unik */}
                    <p className="text-sm font-bold mt-1">
                        Nomor: 400 / {surat.id.substring(0, 4).toUpperCase()} / RT.02 / {new Date().getFullYear()}
                    </p>
                </div>

                {/* ISI BODY SURAT */}
                <div className="space-y-4 text-justify leading-relaxed text-[15px]">
                    <p>Yang bertanda tangan di bawah ini, selaku Ketua RT 02 / RW 05 Kelurahan Jambangan, Kecamatan Jambangan, Kota Surabaya, dengan ini menerangkan dengan sesungguhnya bahwa:</p>
                    
                    {/* DATA DIRI WARGA */}
                    <div className="pl-8 space-y-2 py-3">
                        <div className="flex"><span className="w-48 font-bold">Nama Lengkap</span> <span className="mr-2">:</span> <span className="uppercase font-bold">{currentUser.nama_lengkap}</span></div>
                        <div className="flex"><span className="w-48 font-bold">Nomor Induk (NIK)</span> <span className="mr-2">:</span> <span>{currentUser.nik || '-'}</span></div>
                        <div className="flex"><span className="w-48 font-bold">No. Telepon / WA</span> <span className="mr-2">:</span> <span>{currentUser.no_telp || '-'}</span></div>
                        <div className="flex"><span className="w-48 font-bold">Alamat Surel (Email)</span> <span className="mr-2">:</span> <span>{currentUser.email}</span></div>
                    </div>

                    {/* PARAGRAF PENGANTAR DINAMIS */}
                    <p>
                        Orang yang namanya tercantum di atas adalah benar-benar warga yang sah dan berdomisili tetap di wilayah RT 02 / RW 05 Kelurahan Jambangan. 
                        Berdasarkan hasil verifikasi dan validasi berkas fisik, kami mengonfirmasi bahwa warga tersebut mengajukan <strong>{surat.jenis_surat}</strong> dengan rincian keterangan sebagai berikut:
                    </p>
                    
                    {/* KOTAK RINCIAN DINAMIS (Di-parse dari Array) */}
                    <div className="p-5 border border-slate-400 bg-slate-50 text-sm">
                        <ul className="list-disc list-inside space-y-2">
                            {rincianKeperluan.map((poin, index) => (
                                <li key={index} className="leading-relaxed">
                                    {/* Jika ada tanda panah '->', tebalkan kata sebelum panah */}
                                    {poin.includes('->') ? (
                                        <>
                                            <strong>{poin.split('->')[0]} :</strong> {poin.split('->')[1]}
                                        </>
                                    ) : (
                                        <span>{poin}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="mt-4">
                        Demikian surat keterangan ini dibuat dengan sebenar-benarnya dan penuh tanggung jawab untuk dapat dipergunakan sebagaimana mestinya oleh instansi atau pihak yang berkepentingan.
                    </p>
                </div>

                {/* AREA TANDA TANGAN (Bawah Kanan) */}
                <div className="mt-16 flex justify-end">
                    <div className="text-center w-64">
                        <p>Surabaya, {tanggalCetak}</p>
                        <p className="font-bold">Ketua RT 02 / RW 05</p>
                        
                        {/* Stempel Digital / QR Code Placeholder */}
                        <div className="h-28 flex items-center justify-center mt-2 mb-2 relative">
                            {/* Garis bayangan stempel */}
                            <div className="absolute w-24 h-24 border-[3px] border-emerald-600/30 rounded-full flex items-center justify-center transform -rotate-12">
                                <span className="text-emerald-600/30 text-xs font-black uppercase tracking-widest text-center leading-tight">TERVALIDASI<br/>SISTEM</span>
                            </div>
                        </div>

                        <p className="font-extrabold underline uppercase tracking-wide">Bapak RT 02</p>
                        <p className="text-sm mt-0.5">NIP / NIK. -</p>
                    </div>
                </div>

                {/* WATERMARK DIGITAL (Kiri Bawah) */}
                <div className="absolute bottom-10 left-10 print:bottom-0 print:left-0 text-[10px] text-slate-400 font-mono">
                    <p>Doc ID: {surat.id}</p>
                    <p>Generated by: Portal Digital Sapa Warga</p>
                </div>

            </div>
            
            {/* CSS KHUSUS PRINT: Menghapus background abu-abu saat dicetak */}
            <style jsx>{`
                @media print {
                    body { background-color: white !important; }
                    @page { margin: 1.5cm; }
                }
            `}</style>
        </div>
    );
};