import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    const isAdmin = currentUser.role === 'admin';
    const isRt = currentUser.role === 'rt'; 
    const isWarga = currentUser.role === 'warga';

    const handleLogout = () => {
        if (window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    // 1. MENU WARGA
    const menuWarga = [
        { path: '/warga/dashboard', label: 'Dasbor Utama', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/warga/pengajuan', label: 'Pengajuan Surat', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { path: '/warga/pengaduan', label: 'Lapor Masalah', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        { path: '/warga/berita', label: 'Portal Berita RT', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' }
    ];

    // 2. MENU RT (VERIFIKATOR PERTAMA)
    const menuRt = [
        { path: '/rt/dashboard', label: 'Dasbor Verifikasi', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { path: '/rt/validasi-surat', label: 'Validasi Surat Warga', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { path: '/rt/validasi-laporan', label: 'Validasi Laporan', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
    ];

    // 3. MENU ADMIN (EKSEKUTOR AKHIR)
    const menuAdmin = [
        { path: '/admin/dashboard', label: 'Dasborard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/admin/kelola-surat', label: 'Tindak Lanjut Surat', icon: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' },
        { path: '/admin/tanggapi-masalah', label: 'Resolusi Masalah', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
        { path: '/admin/portal-berita', label: 'Kelola Portal Berita', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
    ];

    // Penentuan menu yang dirender
    const activeMenu = isAdmin ? menuAdmin : (isRt ? menuRt : menuWarga);

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 border-r border-emerald-900 flex flex-col shadow-2xl flex-shrink-0 text-white z-20">
                <div className="h-16 flex items-center px-6 border-b border-emerald-700/50">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center mr-3 border border-white/20 shadow-inner">
                        <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <span className="font-extrabold text-lg tracking-tight text-white drop-shadow-sm">Sapa Warga</span>
                </div>

                <div className="px-6 py-5 border-b border-emerald-700/50">
                    <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider mb-1">Masuk Sebagai</p>
                    <p className="font-bold text-sm truncate text-white">{currentUser.nama_lengkap || 'Pengguna'}</p>
                    <span className={`inline-block mt-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border backdrop-blur-sm shadow-sm ${
                        isAdmin ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
                        isRt ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' : 
                        'bg-emerald-500/30 text-emerald-200 border-emerald-400/30'
                    }`}>
                        {isAdmin ? 'Admin Kelurahan' : isRt ? 'Pengurus RT 02' : 'Warga'}
                    </span>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {activeMenu.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <Link 
                                key={item.path} to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm border ${
                                    isActive 
                                    ? 'bg-white/15 text-white font-bold shadow-lg border-white/10 translate-x-1' 
                                    : 'text-emerald-100/70 border-transparent hover:bg-white/5 hover:text-white hover:translate-x-1'
                                }`}
                            >
                                <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-300' : 'text-emerald-500/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                                </svg>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-emerald-700/50">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-sm rounded-xl transition-colors border border-rose-500/20 shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Keluar Sistem
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 relative">
                <div className="absolute top-0 left-0 w-full h-64 bg-emerald-600/5 opacity-50 pointer-events-none rounded-b-3xl"></div>
                <div className="relative z-10">{children}</div>
            </main>
        </div>
    );
};