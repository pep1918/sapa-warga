import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import axios from 'axios';

export const PengajuanSurat = () => {
    const [step, setStep] = useState(1);
    
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    
    const [formData, setFormData] = useState({
        jenis_surat: 'Surat Keterangan Usaha (SKU)',
        keperluan: '',
        paktaIntegritas: false
    });

    const handleNextStep = () => {
        if (step === 1 && !formData.keperluan.trim()) {
            return alert("Mohon isi tujuan / keperluan surat secara detail terlebih dahulu!");
        }
        setStep(2);
    };

    const handleSubmitSurat = async (e) => {
        e.preventDefault();
        
        // Proteksi 1: Pastikan warga_id tidak kosong (user harus login)
        if (!currentUser.id) {
            return alert("Sesi Anda tidak valid. Silakan Log Out dan Login kembali.");
        }

        // Proteksi 2: Wajib centang pakta persetujuan
        if (!formData.paktaIntegritas) {
            return alert("Anda wajib menyetujui pakta kebenaran data!");
        }

        try {
            // Payload (Muatan Data) ini dijamin klop 100% dengan kolom SQL Anda
            const payload = {
                warga_id: currentUser.id,
                jenis_surat: formData.jenis_surat,
                keperluan: formData.keperluan,
                
                // Karena kita belum mengatur library Multer di backend untuk upload file fisik,
                // kita simulasikan string nama filenya agar kolom varchar(255) di DB terisi.
                dokumen_pendukung: 'scan_dokumen_warga.pdf' 
            };

            // Tembak langsung ke Backend Node.js
            await axios.post('/api/warga/surat', payload);
            
            alert(`Sukses! Permohonan ${formData.jenis_surat} berhasil diajukan dan masuk ke database RT.`);
            
            
            setFormData({ ...formData, keperluan: '', paktaIntegritas: false });
            setStep(1);
        } catch (err) {
            console.error(err);
            
            const pesanError = err.response?.data?.error || err.message;
            alert(`Gagal mengirim data! Alasan: ${pesanError}`);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto space-y-6 p-2">
                
                {/* Header */}
                <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Formulir Pengajuan Surat</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Pemohon: <span className="font-bold text-emerald-700">{currentUser.nama_lengkap || 'Warga'}</span></p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 shadow-sm">
                        Langkah {step} dari 2
                    </span>
                </div>

                <form onSubmit={handleSubmitSurat} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                    
                    {/* HALAMAN 1: JENIS & KEPERLUAN */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Pilih Jenis Dokumen Pengantar</label>
                                <select 
                                    value={formData.jenis_surat} 
                                    onChange={(e) => setFormData({...formData, jenis_surat: e.target.value})} 
                                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                >
                                    <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU)</option>
                                    <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM)</option>
                                    <option value="Surat Keterangan Domisili">Surat Keterangan Domisili</option>
                                    <option value="Surat Pengantar Pembuatan KK/KTP">Surat Pengantar Pembuatan KK/KTP</option>
                                </select>
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-slate-700">Tujuan & Detail Keperluan Surat</label>
                                <textarea 
                                    required 
                                    value={formData.keperluan} 
                                    onChange={(e) => setFormData({...formData, keperluan: e.target.value})} 
                                    placeholder="Tuliskan secara lengkap. Contoh: Untuk kelengkapan administrasi pengajuan Beasiswa Pendidikan Anak atas nama Budi..." 
                                    className="w-full min-h-[120px] px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm resize-none outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                                />
                            </div>
                            
                            <button 
                                type="button" 
                                onClick={handleNextStep} 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
                            >
                                Lanjutkan Pengisian
                            </button>
                        </div>
                    )}

                    {/* HALAMAN 2: LAMPIRAN & PAKTA INTEGRITAS */}
                    {step === 2 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            
                            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-3">
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Unggah Berkas Persyaratan (Scan KTP/KK)</p>
                                <input 
                                    type="file" 
                                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer w-full transition-colors" 
                                />
                                <p className="text-[10px] text-slate-400 font-medium">*Fitur upload fisik sedang dalam pengembangan simulasi</p>
                            </div>

                            <div className="flex items-start gap-3 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                                <input 
                                    type="checkbox" 
                                    id="pakta" 
                                    checked={formData.paktaIntegritas} 
                                    onChange={(e) => setFormData({...formData, paktaIntegritas: e.target.checked})} 
                                    className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer" 
                                />
                                <label htmlFor="pakta" className="text-xs text-slate-700 select-none cursor-pointer leading-relaxed">
                                    Saya menyatakan dengan sadar dan menjamin secara hukum bahwa semua data pengajuan administrasi di sistem <strong>Sapa Warga</strong> ini adalah sah dan dapat dipertanggungjawabkan kebenarannya.
                                </label>
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setStep(1)} 
                                    className="w-1/3 border border-slate-300 text-slate-600 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Kembali
                                </button>
                                <button 
                                    type="submit" 
                                    className="w-2/3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
                                >
                                    Ajukan Surat ke Database RT
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </DashboardLayout>
    );
};