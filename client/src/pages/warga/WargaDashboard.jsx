import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const WargaDashboard = () => {
    const [stats, setStats] = useState({ totalSurat: 0, disetujui: 0, menunggu: 0, pengaduan: 0 });
    const [riwayatSurat, setRiwayatSurat] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ambil data Warga yang sedang login
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const idWarga = currentUser.id; 

    useEffect(() => {
        const fetchRealDatabaseData = async () => {
            if (!idWarga) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                // Menarik data langsung dari MySQL via Node.js
                const resStats = await axios.get(`/api/warga/statistik/${idWarga}`);
                const resSurat = await axios.get(`/api/warga/surat/${idWarga}`);
                
                setStats(resStats.data || { totalSurat: 0, disetujui: 0, menunggu: 0, pengaduan: 0 });
                setRiwayatSurat(Array.isArray(resSurat.data) ? resSurat.data : []);
            } catch (err) {
                console.error("Gagal sinkronisasi API:", err);
                setRiwayatSurat([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRealDatabaseData();
    }, [idWarga]);


    const formatTanggalTabel = (isoString) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const unduhSuratPDF = (surat) => {
        const printWindow = window.open('', '_blank');
        
        
        const formatTanggalResmi = new Date(surat.created_at).toLocaleDateString('id-ID', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        
        printWindow.document.write(`
            <html>
            <head>
                <title>Dokumen Resmi - ${surat.jenis_surat}</title>
                <style>
                    body { font-family: 'Times New Roman', Times, serif; padding: 50px 70px; line-height: 1.6; color: #000; }
                    .kop { text-align: center; border-bottom: 4px double #000; padding-bottom: 12px; margin-bottom: 35px; }
                    .kop h2 { margin: 0; text-transform: uppercase; font-size: 19px; letter-spacing: 0.5px; }
                    .kop h3 { margin: 0; text-transform: uppercase; font-size: 16px; font-weight: normal; margin-top: 4px; }
                    .kop p { margin: 6px 0 0 0; font-size: 12px; font-style: italic; }
                    .judul-surat { text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 35px; font-size: 16px; }
                    .judul-surat span { font-weight: normal; font-size: 13px; text-transform: none; display: block; margin-top: 4px; }
                    .isi { text-align: justify; margin-bottom: 25px; font-size: 15px; text-indent: 45px; line-height: 1.8; }
                    .tabel-data { margin: 20px 45px 30px 45px; font-size: 15px; width: 85%; }
                    .tabel-data td { padding: 6px 8px; vertical-align: top; }
                    .tabel-data td:first-child { width: 35%; }
                    .ttd-box { float: right; text-align: center; font-size: 15px; width: 250px; margin-top: 50px; }
                    .ttd-space { height: 100px; position: relative; }
                    /* Stempel Digital Simulasi */
                    .stempel { position: absolute; left: 20px; top: 10px; width: 80px; height: 80px; border: 3px solid #10b981; border-radius: 50%; opacity: 0.3; transform: rotate(-15deg); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: #10b981; text-align: center; }
                </style>
            </head>
            <body>
                <div class="kop">
                    <h2>PEMERINTAH KOTA SURABAYA</h2>
                    <h3>KECAMATAN JAMBANGAN - KELURAHAN KARAH</h3>
                    <h2>PENGURUS RUKUN TETANGGA 02 RUKUN WARGA 01</h2>
                    <p>Sekretariat: Jl. Raya Karah No. 12, Surabaya, Jawa Timur, Kode Pos 60232</p>
                </div>
                
                <div class="judul-surat">
                    <u>SURAT KETERANGAN PENGANTAR</u>
                    <span>Nomor: 474 / ${surat.id.substring(0, 8).toUpperCase()} / 436.9 / 2026</span>
                </div>
                
                <div class="isi">
                    Yang bertanda tangan di bawah ini Pengurus Rukun Tetangga 02 Rukun Warga 01 Kelurahan Karah, Kecamatan Jambangan, Kota Surabaya menerangkan dengan sebenarnya bahwa:
                </div>
                
                <table class="tabel-data">
                    <tr><td>Nama Lengkap</td><td>:</td><td><strong>${currentUser.nama_lengkap}</strong></td></tr>
                    <tr><td>Nomor Induk Kependudukan</td><td>:</td><td>${currentUser.nik || '-'}</td></tr>
                    <tr><td>Jenis Dokumen Pengajuan</td><td>:</td><td>${surat.jenis_surat}</td></tr>
                    <tr><td>Maksud / Keperluan</td><td>:</td><td>${surat.keperluan}</td></tr>
                </table>
                
                <div class="isi">
                    Benar nama tersebut di atas adalah warga kami yang berdomisili menetap di area RT 02 RW 01 Kelurahan Karah. Demikian surat keterangan pengantar ini dibuat berdasarkan data yang sah agar dapat dipergunakan sebagaimana mestinya oleh instansi yang dituju.
                </div>
                
                <div class="ttd-box">
                    Surabaya, ${formatTanggalResmi}<br>
                    Mengetahui,<br>
                    <strong>Ketua RT 02 RW 01</strong>
                    <div class="ttd-space">
                        <div class="stempel">STEMPEL<br>RT 02 RW 01<br>KARAH</div>
                    </div>
                    <strong>( _______________________ )</strong>
                </div>
                
                <script>
                    // Otomatis memunculkan dialog Print (Simpan sebagai PDF) saat dokumen terbuka
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6 p-2">
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Dasbor Pelayanan Terpadu</h1>
                    <p className="text-sm text-slate-500 mt-1">Sistem Informasi Warga Terkoneksi (SIRETE) - <span className="font-bold text-emerald-700">{currentUser.nama_lengkap || 'Pengguna'}</span></p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Pengajuan", val: stats.totalSurat, color: "border-emerald-500 bg-emerald-50/40 text-emerald-700" },
                        { label: "Disetujui RT", val: stats.disetujui, color: "border-green-500 bg-green-50/40 text-green-700" },
                        { label: "Menunggu Antrean", val: stats.menunggu, color: "border-amber-500 bg-amber-50/40 text-amber-700" },
                        { label: "Aduan Masalah", val: stats.pengaduan, color: "border-rose-500 bg-rose-50/40 text-rose-700" }
                    ].map((card, i) => (
                        <div key={i} className={`p-5 rounded-xl border-l-4 bg-white shadow-sm transition-all hover:shadow-md ${card.color}`}>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
                            <p className="text-3xl font-extrabold mt-1">{loading ? "..." : card.val}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-bold text-slate-800">Status & Unduh Berkas Administrasi</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[13px] uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Jenis Pengajuan Dokumen</th>
                                    <th className="px-6 py-4">Detail Keperluan</th>
                                    <th className="px-6 py-4">Tanggal Masuk</th>
                                    <th className="px-6 py-4">Status Validasi</th>
                                    <th className="px-6 py-4 text-center">Tindakan / Unduhan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-medium">Memuat data dari server MySQL...</td></tr>
                                ) : riwayatSurat.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-medium">Belum ada riwayat pengajuan dokumen di database.</td></tr>
                                ) : (
                                    riwayatSurat.map((surat) => (
                                        <tr key={surat.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900">{surat.jenis_surat}</td>
                                            <td className="px-6 py-4 text-slate-500 max-w-[250px] truncate" title={surat.keperluan}>{surat.keperluan}</td>
                                            <td className="px-6 py-4 font-medium text-slate-600">{formatTanggalTabel(surat.created_at)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase border shadow-sm ${
                                                    surat.status === 'disetujui' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    surat.status === 'ditolak' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    {surat.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {surat.status === 'disetujui' ? (
                                                    <button 
                                                        onClick={() => unduhSuratPDF(surat)} 
                                                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all transform hover:scale-105"
                                                    >
                                                        Cetak / Unduh PDF
                                                    </button>
                                                ) : surat.status === 'ditolak' ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[11px] font-bold text-rose-600">Ditolak Admin</span>
                                                        <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]" title={surat.pesan_admin}>{surat.pesan_admin}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] font-medium text-slate-400 italic">Menunggu Validasi RT...</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};