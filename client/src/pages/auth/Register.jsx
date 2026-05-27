import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const Register = () => {
    const [formData, setFormData] = useState({ 
        nik: '', 
        nama_lengkap: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); 
        
        
        if (formData.password !== formData.confirmPassword) {
            return setError('Konfirmasi kata sandi tidak cocok!');
        }
        if (formData.nik.length < 16) {
            return setError('NIK tidak valid! Harus terdiri dari minimal 16 digit angka.');
        }
        if (formData.password.length < 6) {
            return setError('Kata sandi terlalu pendek! Minimal 6 karakter.');
        }

        setLoading(true);
        try {
            
            const response = await axios.post('/api/auth/register', {
                nik: formData.nik,
                nama_lengkap: formData.nama_lengkap,
                email: formData.email,
                password: formData.password
            });
            
            
            alert(response.data.message || "Pendaftaran berhasil! Silakan masuk menggunakan akun Anda.");
            navigate('/login');

        } catch (err) {
            
            const pesanDariBackend = err.response?.data?.error;
            setError(pesanDariBackend || 'Terjadi kesalahan saat mencoba mendaftar ke server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row-reverse bg-white">
            
            {}
            <div className="w-full md:w-1/2 lg:w-5/12 flex items-center justify-center p-8 sm:p-12 lg:p-16 overflow-y-auto">
                <div className="w-full max-w-md space-y-6 mt-8 md:mt-0">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">Registrasi Warga</h1>
                        <p className="text-slate-500 text-sm">Lengkapi data diri Anda sesuai KTP untuk mengakses layanan administrasi RT secara digital.</p>
                    </div>

                    {}
                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-3.5 rounded-xl text-[13px] font-bold border border-rose-200 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className="leading-relaxed">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Nomor Induk Kependudukan (NIK)</label>
                            <input 
                                type="number" name="nik" required 
                                value={formData.nik} onChange={handleChange} 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all" 
                                placeholder="Masukkan 16 digit NIK" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Nama Lengkap (Sesuai KTP)</label>
                            <input 
                                type="text" name="nama_lengkap" required 
                                value={formData.nama_lengkap} onChange={handleChange} 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all" 
                                placeholder="Nama Lengkap" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Alamat Email Aktif</label>
                            <input 
                                type="email" name="email" required 
                                value={formData.email} onChange={handleChange} 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all" 
                                placeholder="budi@gmail.com" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Kata Sandi</label>
                                <input 
                                    type="password" name="password" required 
                                    value={formData.password} onChange={handleChange} 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all" 
                                    placeholder="Minimal 6 char" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Ulangi Sandi</label>
                                <input 
                                    type="password" name="confirmPassword" required 
                                    value={formData.confirmPassword} onChange={handleChange} 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-all" 
                                    placeholder="Ulangi sandi" 
                                />
                            </div>
                        </div>
                        
                        <div className="pt-4">
                            <button 
                                type="submit" disabled={loading} 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Menyimpan Data...
                                    </>
                                ) : 'Daftar Sekarang'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-500 font-medium">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">Masuk di sini</Link>
                    </p>
                </div>
            </div>

            {/* SISI KIRI: GAMBAR & BRANDING */}
            <div className="hidden md:block md:w-1/2 lg:w-7/12 relative bg-emerald-900">
                <img 
                    src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1170&auto=format&fit=crop" 
                    alt="Pemandangan Lingkungan" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-12 lg:p-20 text-white w-full">
                    <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                        Membangun Lingkungan yang Lebih Baik.
                    </h2>
                    <p className="text-emerald-100 text-lg max-w-lg leading-relaxed mb-8">
                        Bergabunglah dengan portal digital RT untuk mempercepat layanan surat menyurat dan ikut serta dalam pelaporan masalah lingkungan sekitar.
                    </p>
                    
                    <div className="flex items-center gap-4 border-l-4 border-emerald-400 pl-4">
                        <div>
                            <p className="text-[11px] text-emerald-300 font-bold uppercase tracking-widest">Keamanan Data Terjamin</p>
                            <p className="text-sm font-medium mt-0.5">Password Anda dienkripsi (Hash) dan tidak dapat dibaca oleh siapa pun, termasuk Admin.</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};