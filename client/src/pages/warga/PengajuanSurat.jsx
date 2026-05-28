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
    
    // State baru untuk menampung file fisik yang diunggah
    const [file, setFile] = useState(null);

    // State untuk menampung parameter dinamis
    const [metaData, setMetaData] = useState({
        namaUsaha: '', jenisUsaha: '', alamatUsaha: '',
        namaAnak: '', sekolahAnak: '', alasanSktm: '',
        tujuanInstansi: '', keteranganTambahan: ''
    });

    const handleMetaChange = (e) => {
        setMetaData({ ...metaData, [e.target.name]: e.target.value });
    };

    const handleNextStep = () => {
        if (step === 1) {
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
        
        if (!currentUser.id) return alert("Sesi login kadaluwarsa. Silakan Log Out dan Login kembali.");
        if (!paktaIntegritas) return alert("Anda wajib menyetujui pakta integritas data berkas!");

        setLoading(true);
        try {
            let narasiKeperluan = `Tujuan Instansi: ${metaData.tujuanInstansi}. `;
            
            if (jenisSurat === 'Surat Keterangan Usaha (SKU)') {
                narasiKeperluan += `Detail Usaha -> Nama Usaha: ${metaData.namaUsaha}, Jenis: ${metaData.jenisUsaha}, Lokasi: ${metaData.alamatUsaha}.`;
            } else if (jenisSurat === 'Surat Keterangan Tidak Mampu (SKTM)') {
                narasiKeperluan += `Keperluan Berkas -> Nama Anak: ${metaData.namaAnak}, Sekolah/Kampus: ${metaData.sekolahAnak || '-'}, Alasan: ${metaData.alasanSktm}.`;
            } else {
                narasiKeperluan += `Keterangan Tambahan -> Keperluan: ${metaData.keteranganTambahan || 'Administrasi umum kependudukan'}.`;
            }

            const submitData = new FormData();
            submitData.append('warga_id', currentUser.id);
            submitData.append('jenis_surat', jenisSurat);
            submitData.append('keperluan', narasiKeperluan);
            
            if (file) submitData.append('dokumen_pendukung', file);

            await axios.post('/api/warga/surat', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
            
            alert(`Sukses! Permohonan berkas ${jenisSurat} Anda telah terkirim.`);
            
            setStep(1);
            setPaktaIntegritas(false);
            setFile(null);
            setMetaData({
                namaUsaha: '', jenisUsaha: '', alamatUsaha: '',
                namaAnak: '', sekolahAnak: '', alasanSktm: '',
                tujuanInstansi: '', keteranganTambahan: ''
            });

        } catch (err) {
            alert(`Gagal memproses permohonan. Alasan: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // LOGIKA PINTAR: Menentukan Teks dan Aturan Upload Berdasarkan Jenis Surat
    let infoSyarat = "";
    let labelUpload = "";

    switch(jenisSurat) {
        case 'Surat Pengantar Pembuatan KK/KTP':
            infoSyarat = "Karena Anda mengajukan pengantar pembuatan KK/KTP baru, silakan lampirkan Surat Kehilangan dari Kepolisian (jika hilang), Akta Kelahiran, atau Scan KK/KTP Lama (jika rusak).";
            labelUpload = "Unggah Surat Kehilangan / Akta Lahir / Bukti Rusak";
            break;
        case 'Surat Keterangan Usaha (SKU)':
            infoSyarat = "Untuk keperluan verifikasi lapangan, mohon lampirkan Foto Tempat Usaha Anda tampak depan atau KTP Pemohon.";
            labelUpload = "Unggah Foto Tempat Usaha / KTP";
            break;
        case 'Surat Keterangan Tidak Mampu (SKTM)':
            infoSyarat = "Sebagai bukti pendukung validasi RT, lampirkan Foto Kondisi Rumah Tampak Depan atau Scan Tagihan Listrik bulan terakhir.";
            labelUpload = "Unggah Foto Rumah / Bukti Tagihan Listrik";
            break;
        case 'Surat Keterangan Domisili':
            infoSyarat = "Silakan lampirkan KTP Daerah Asal Anda dan/atau Surat Perjanjian Sewa/Kontrak Rumah.";
            labelUpload = "Unggah KTP Asal / Bukti Sewa Kontrak";
            break;
        default:
            infoSyarat = "Silakan lampirkan dokumen identitas pendukung seperti KTP/KK untuk keperluan arsip digital.";
            labelUpload = "Unggah Dokumen Pendukung";
    }

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto space-y-6 p-2">
                
                {/* Status Bar */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Identitas Pemohon</span>
                        <h1 className="text-xl font-bold mt-1.5">{currentUser.nama_lengkap || 'Nama Warga'}</h1>
                        <p className="text-xs text-emerald-100 mt-0.5">NIK: {currentUser.nik || '-'}</p>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-right backdrop-blur-sm">
                        <p className="text-[10px] text-emerald-200 font-bold uppercase">Tahapan Pengisian</p>
                        <p className="text-lg font-black mt-0.5">Langkah {step} <span className="text-xs font-normal text-emerald-200">dari 2</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmitSurat} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                    
                    {/* LANGKAH 1 */}
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
                                    placeholder="Cth: Kelurahan / Dinas Sosial / Bank Jatim" 
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>

                            <div className="border-t border-slate-100 pt-4"></div>

                            {/* DYNAMIC FIELD */}
                            {jenisSurat === 'Surat Keterangan Usaha (SKU)' && (
                                <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in duration-300">
                                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Rincian Legalitas Usaha Warga</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-slate-600">Nama Usaha / Toko</label>
                                            <input type="text" name="namaUsaha" value={metaData.namaUsaha} onChange={handleMetaChange} className="px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-slate-600">Sektor / Jenis Bisnis</label>
                                            <input type="text" name="jenisUsaha" value={metaData.jenisUsaha} onChange={handleMetaChange} className="px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-slate-600">Alamat Fisik Tempat Usaha</label>
                                        <input type="text" name="alamatUsaha" value={metaData.alamatUsaha} onChange={handleMetaChange} className="w-full px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                    </div>
                                </div>
                            )}

                            {jenisSurat === 'Surat Keterangan Tidak Mampu (SKTM)' && (
                                <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in duration-300">
                                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Rincian Kebutuhan Bantuan Sosial</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-slate-600">Nama Lengkap Anak (Pemohon Beasiswa)</label>
                                            <input type="text" name="namaAnak" value={metaData.namaAnak} onChange={handleMetaChange} className="px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-slate-600">Nama Sekolah / Universitas</label>
                                            <input type="text" name="sekolahAnak" value={metaData.sekolahAnak} onChange={handleMetaChange} className="px-3 py-2 border bg-white rounded-lg text-sm outline-none focus:border-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-slate-600">Alasan Pengajuan</label>
                                        <textarea name="alasanSktm" value={metaData.alasanSktm} onChange={handleMetaChange} className="w-full min-h-[70px] p-2 border bg-white rounded-lg text-sm resize-none outline-none focus:border-emerald-500" />
                                    </div>
                                </div>
                            )}

                            {jenisSurat !== 'Surat Keterangan Usaha (SKU)' && jenisSurat !== 'Surat Keterangan Tidak Mampu (SKTM)' && (
                                <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Narasi Detail Keperluan Surat</label>
                                    <textarea 
                                        name="keteranganTambahan" value={metaData.keteranganTambahan} onChange={handleMetaChange}
                                        placeholder="Tuliskan alasan pengajuan berkas agar pengurus RT mudah memverifikasinya..." 
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

                    {/* LANGKAH 2 DENGAN ATURAN DINAMIS */}
                    {step === 2 && (
                        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs leading-relaxed">
                                <span className="font-bold uppercase block mb-1">⚠️ Aturan Lampiran Berkas:</span>
                                {infoSyarat}
                            </div>

                            <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl space-y-3 text-center">
                                <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                </div>
                                <div>
                                    <label htmlFor="fileUpload" className="block text-xs font-bold text-slate-700 cursor-pointer hover:text-emerald-700 transition-colors">
                                        <span>{file ? file.name : labelUpload}</span>
                                        <input 
                                            id="fileUpload" 
                                            type="file" 
                                            className="hidden" 
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
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
                                    Saya dengan kesadaran penuh menyatakan bahwa seluruh informasi dan dokumen pendukung yang saya berikan adalah <strong>SAH, BENAR, DAN ASLI</strong> milik saya pribadi.
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
                                    {loading ? 'Mengarsip Data...' : 'Ajukan Permohonan Surat'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </DashboardLayout>
    );
};