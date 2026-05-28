import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
    // 1. STATE MENGGUNAKAN USERNAME
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // 2. MENGIRIM USERNAME KE BACKEND
            const res = await axios.post('/api/auth/login', { username, password });
            
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            
            if (res.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (res.data.user.role === 'rt') {
                navigate('/rt/dashboard');
            } else {
                navigate('/warga/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal terhubung ke server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
            
            {/* SISI KIRI: FORM LOGIN */}
            <div className="w-full md:w-1/2 lg:w-5/12 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sapa Warga</h2>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Selamat Datang Kembali!</h1>
                        <p className="text-slate-500 mt-2 text-sm">Silakan masuk menggunakan akun yang telah terdaftar di sistem RT.</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-semibold border border-rose-100 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            {/* 3. INPUT USERNAME (Tipe teks, otomatis huruf kecil, tanpa spasi) */}
                            <label className="text-sm font-bold text-slate-700">Username</label>
                            <input 
                                type="text" 
                                required 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none" 
                                placeholder="username" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Kata Sandi</label>
                            <input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none" 
                                placeholder="••••••••" 
                            />
                        </div>
                        
                        <div className="pt-2">
                            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all flex justify-center items-center gap-2">
                                {loading ? 'Memproses...' : 'Masuk ke Sistem'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-500 font-medium pt-4">
                        Belum terdaftar di lingkungan ini?{' '}
                        <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">Buat Akun</Link>
                    </p>
                </div>
            </div>

            {/* SISI KANAN: GAMBAR & BRANDING */}
            <div className="hidden md:block md:w-1/2 lg:w-7/12 relative bg-slate-900">
                <img 
                    src="https://plus.unsplash.com/premium_photo-1675629118402-902d7dabda23?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3VudW5nfGVufDB8fDB8fHww" 
                    alt="Komunitas Warga" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-12 lg:p-20 text-white w-full">
                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm mb-4 inline-block">
                        Digitalisasi Lingkungan
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                        Harmoni Warga dalam Satu Sentuhan.
                    </h2>
                    <p className="text-slate-300 text-lg max-w-lg leading-relaxed">
                        Sapa Warga mempermudah administrasi, pelaporan, dan komunikasi antar tetangga. Aman, transparan, dan terpercaya.
                    </p>
                </div>
            </div>
            
        </div>
    );
};