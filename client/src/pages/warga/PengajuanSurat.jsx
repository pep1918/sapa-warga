import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const PengajuanSurat = () => {
    const [step, setStep] = useState(1);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // State utama form pengajuan
    const [jenisSurat, setJenisSurat] = useState('Surat Keterangan Usaha (SKU)');
    const [paktaIntegritas, setPaktaIntegritas] = useState(false);
    const [loading, setLoading] = useState(false);

    // State untuk menampung parameter dinamis berdasarkan jenis surat
    const [metaData, setMetaData] = useState({
        // Parameter SKU
        namaUsaha: '',
        jenisUsaha: '',
        alamatUsaha: '',
        // Parameter SKTM / Beasiswa
        namaAnak: '',
        sekolahAnak: '',
        alasanSktm: '',
        // Parameter Umum / Domisili / KTP
        tujuanInstansi: '',
        keteranganTambahan: ''
    });

    const handleMetaChange = (e) => {
        setMetaData({ ...metaData, [e.target.name]: e.target.value });
    };

    // Validasi input per step sebelum lanjut
    const handleNextStep = () => {
        if (step === 1) {
            // Validasi dinamis halaman 1 berdasarkan opsi yang dipilih
            if (jenisSurat === 'Surat Keterangan Usaha (SKU)' && (!metaData.namaUsaha || !metaData.jenisUsaha || !metaData.alamatUsaha)) {
                return alert("Mohon lengkapi seluruh rincian informasi usaha Anda!");
            }
            if (jenisSurat === 'Surat Keterangan Tidak Mampu (SKTM)' && (!metaData.namaAnak || !metaData.alasanSktm)) {
                return alert("Mohon lengkapi nama anak dan alasan pengajuan SKTM!");
            }
            if (!metaData.tujuanInstansi.trim()) {
                return alert("Mohon isi instansi atau pihak tujuan surat ini (Cth: Bank Jatim / Dinas Sosial)!");
            }
        }
        setStep(2);
    };

    const handleSubmitSurat = async (e) => {
        e.preventDefault();
        
        if (!currentUser.id) {
            return alert("Sesi login kadaluwarsa. Silakan Log Out dan Login kembali.");
        }
        if (!paktaIntegritas) {
            return alert("Anda wajib menyetujui pakta integritas data berkas!");
        }

        setLoading(true);
        try {
            // Menyusun narasi keperluan secara kompleks & rapi dari data dinamis
            let narasiKeperluan = `Tujuan Instansi: ${metaData.tujuanInstansi}. `;
            
            if (jenisSurat === 'Surat Keterangan Usaha (SKU)') {
                narasiKeperluan += `Detail Usaha -> Nama Usaha: ${metaData.namaUsaha}, Jenis: ${metaData.jenisUsaha}, Lokasi: ${metaData.alamatUsaha}.`;
            } else if (jenisSurat === 'Surat Keterangan Tidak Mampu (SKTM)') {
                narasiKeperluan += `Keperluan Berkas -> Nama Anak: ${metaData.namaAnak}, Sekolah/Kampus: ${metaData.sekolahAnak || '-'}, Alasan: ${metaData.alasanSktm}.`;
            } else {
                narasiKeperluan += `Keterangan Domisili/Umum -> Keperluan: ${metaData.keteranganTambahan || 'Administrasi umum kependudukan'}.`;
            }

            // Payload final yang 100% klop dengan kolom MySQL pengajuan_surat
            const payload = {
                warga_id: currentUser.id,
                jenis_surat: jenisSurat,
                keperluan: narasiKeperluan,
                dokumen_pendukung: 'scan_persyaratan_tervalidasi.pdf'
            };

            await axios.post('/api/warga/surat', payload);
            
            alert(`Sukses! Permohonan berkas ${jenisSurat} Anda telah terkirim ke database pengurus RT.`);
            
            // Reset Form ke default
            setStep(1);
            setPaktaIntegritas(false);
            setMetaData({
                namaUsaha: '', jenisUsaha: '', alamatUsaha: '',
                namaAnak: '', sekolahAnak: '', alasanSktm: '',
                tujuanInstansi: '', keteranganTambahan: ''
            });

        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message;
            alert(`Gagal memproses permohonan. Alasan: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto space-y-6 p-2">
                
                {/* Status Bar Pemohon */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Identitas Pemohon (Sesuai Database)</span>
                        <h1 className="text-xl font-bold mt-1.5">{currentUser.nama_lengkap || 'Nama Warga'}</h1>
                        <p className="text-xs text-emerald-100 mt-0.5">NIK Kependudukan: {currentUser.nik || '-'}</p>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-right backdrop-blur-sm">
                        <p className="text-[10px] text-emerald-200 font-bold uppercase">Tahapan Pengisian</p>
                        <p className="text-lg font-black mt-0.5">Langkah {step} <span className="text-xs font-normal text-emerald-200">dari 2</span></p>
                    </div>
                </div>

                {/* Card Formulir */}
                <form onSubmit={handleSubmitSurat} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                    
                    {/* === LANGKAH 1: PARAMETER UTAMA & DINAMIS === */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Pilih Jenis Surat Layanan</label>
                                <select 
                                    value={jenisSurat} 
                                    onChange={(e) => setJenisSurat(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                >
                                    <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU)</option>
                                    <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM)</option>
                                    <option value="Surat Keterangan Domisili">Surat Keterangan Domisili Tempat Tinggal</option>
                                    <option value="Surat Pengantar Pembuatan KK/KTP">Surat Pengantar Pembuatan KK/KTP</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Pihak / Instansi Tujuan Surat</label>
                                <input 
                                    type="text" name="tujuanInstansi" required
                                    value={metaData.tujuanInstansi} onChange={handleMetaChange}
                                    placeholder="" 
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>

                            <div className="border-t border-slate-100 pt-4"></div>

                            {/* DYNAMIC FIELD: JIKA MEMILIH SURAT KETERANGAN USAHA (SKU) */}
                            {jenisSurat === 'Surat Keterangan Usaha (SKU)' && (
                                <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in duration-300">
                                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Rincian Legalitas Usaha Warga</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-slate-600">Nama Usaha / Toko</label>
                                            <input type="text" name="namaUsaha" value={metaData.namaUsaha} onChange={handleMetaChange} placeholder="" className="px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-slate-600">Sektor / Jenis Bisnis</label>
                                            <input type="text" name="jenisUsaha" value={metaData.jenisUsaha} onChange={handleMetaChange} placeholder="" className="px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-slate-600">Alamat Fisik Tempat Usaha</label>
                                        <input type="text" name="alamatUsaha" value={metaData.alamatUsaha} onChange={handleMetaChange} placeholder="" className="w-full px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                    </div>
                                </div>
                            )}

                            {/* DYNAMIC FIELD: JIKA MEMILIH SURAT KETERANGAN TIDAK MAMPU (SKTM) */}
                            {jenisSurat === 'Surat Keterangan Tidak Mampu (SKTM)' && (
                                <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in duration-300">
                                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Rincian Kebutuhan Bantuan Sosial</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-slate-600">Nama Lengkap Anak (Pemohon Beasiswa)</label>
                                            <input type="text" name="namaAnak" value={metaData.namaAnak} onChange={handleMetaChange} placeholder="Nama anak kandung" className="px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-slate-600">Nama Sekolah / Universitas (Jika Ada)</label>
                                            <input type="text" name="sekolahAnak" value={metaData.sekolahAnak} onChange={handleMetaChange} placeholder="Cth: Universitas Negeri Surabaya" className="px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-slate-600">Alasan Pokok Pengajuan Pengurangan/Keringanan</label>
                                        <textarea name="alasanSktm" value={metaData.alasanSktm} onChange={handleMetaChange} placeholder="Cth: Kelengkapan berkas keringanan UKT semester ganjil akibat kendala ekonomi keluarga..." className="w-full min-h-[70px] p-2 border bg-white rounded-lg text-sm resize-none outline-none focus:border-emerald-500" />
                                    </div>
                                </div>
                            )}

                            {/* FIELD KETERANGAN TAMBAHAN UNTUK JENIS SURAT LAINNYA */}
                            {jenisSurat !== 'Surat Keterangan Usaha (SKU)' && jenisSurat !== 'Surat Keterangan Tidak Mampu (SKTM)' && (
                                <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Narasi Detail Keperluan Surat</label>
                                    <textarea 
                                        name="keteranganTambahan" value={metaData.keteranganTambahan} onChange={handleMetaChange}
                                        placeholder="Tuliskan alasan pengajuan berkas secara gamblang agar pengurus RT mudah memverifikasi berkas Anda..." 
                                        className="w-full min-h-[100px] px-3 py-2.5 border border-slate-300 rounded-xl text-sm resize-none outline-none focus:border-emerald-500" 
                                    />
                                </div>
                            )}

                            <button 
                                type="button" onClick={handleNextStep} 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow transition-colors"
                            >
                                Lanjutkan Validasi Persyaratan
                            </button>
                        </div>
                    )}

                    {/* === LANGKAH 2: DOKUMEN & PERSYARATAN INTEGRITAS === */}
                    {step === 2 && (
                        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs leading-relaxed">
                                <span className="font-bold uppercase block mb-1">⚠️ Aturan Lampiran Berkas Fisik:</span>
                                Sebelum berkas fisik dikirim ke rumah Ketua RT 02, Anda wajib melampirkan fotokopi Kartu Keluarga (KK) dan KTP Penduduk asli dalam bentuk digital di bawah ini untuk arsip server.
                            </div>

                            <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl space-y-3 text-center">
                                <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 cursor-pointer hover:text-emerald-700 transition-colors">
                                        <span>Klik untuk Unggah Scan Dokumen Pendukung</span>
                                        <input type="file" className="hidden" />
                                    </label>
                                    <p className="text-[10px] text-slate-400 mt-1">Format dokumen yang diizinkan: PDF, JPG, atau PNG (Maks. 5 MB)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <input 
                                    type="checkbox" id="paktaIntegritas" 
                                    checked={paktaIntegritas} onChange={(e) => setPaktaIntegritas(e.target.checked)} 
                                    className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer" 
                                />
                                <label htmlFor="paktaIntegritas" className="text-xs text-slate-700 select-none cursor-pointer leading-relaxed">
                                    Saya dengan kesadaran penuh menyatakan bahwa seluruh metadata kependudukan serta informasi tambahan hukum yang saya masukkan di atas adalah <strong>SAH, BENAR, DAN ASLI</strong> milik saya pribadi sesuai catatan sipil Kota Surabaya.
                                </label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" onClick={() => setStep(1)} 
                                    className="w-1/3 border border-slate-300 text-slate-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Kembali Edit Data
                                </button>
                                <button 
                                    type="submit" disabled={loading}
                                    className="w-2/3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Mengarsip ke MySQL...' : 'Ajukan Permohonan Surat Resmi'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </DashboardLayout>
    );
};