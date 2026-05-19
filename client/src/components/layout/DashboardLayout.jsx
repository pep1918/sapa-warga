import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    
    const savedUser = localStorage.getItem('user');
    let userObj = {};
    try {
        userObj = savedUser && savedUser.startsWith('{') ? JSON.parse(savedUser) : { role: savedUser };
    } catch (e) {
        userObj = { role: 'warga' };
    }
    const userRole = String(userObj.role || 'warga').toLowerCase();

    const menuItems = userRole === 'admin' ? [
        { path: '/admin', label: 'Dasbor Admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { path: '/admin/surat', label: 'Kelola Surat', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { path: '/admin/laporan', label: 'Tanggapi Masalah', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { path: '/admin/berita', label: 'Portal Berita', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' }
    ] : [
        { path: '/warga', label: 'Dasbor Utama', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/warga/pengajuan', label: 'Pengajuan Surat', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { path: '/lapor', label: 'Lapor Masalah', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        { path: '/warga/berita', label: 'Informasi RT', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    return (
        
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/30 to-green-50/40 flex font-sans">
            
            {}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block flex flex-col`}>
                
                {}
                <div className="h-20 flex items-center px-8 border-b border-white/10 bg-black/15">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-600/30 mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <span className="text-[19px] font-bold text-white tracking-wide">Sapa Warga</span>
                </div>

                {}
                <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
                    <div className="text-[12px] font-semibold text-emerald-400/70 uppercase tracking-widest mb-4 px-3">Menu Panel</div>
                    
                    {menuItems.map((item) => {
                        
                        const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/warga' && item.path !== '/admin');
                        
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-300 ${
                                    isActive 
                                    
                                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-600/25 border-l-4 border-white' 
                                    
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
                                }`}
                            >
                                <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Tombol Log Out Sesi */}
                <div className="p-5 border-t border-white/10 bg-black/15">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl text-[14px] font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-600 hover:text-white transition-all duration-300 border border-rose-500/20 hover:shadow-lg hover:shadow-rose-600/25"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar dari Sistem
                    </button>
                </div>
            </aside>

            {/* Backdrop Gelap untuk Layar Mobile Android/iOS */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ================= KONTEN HALAMAN UTAMA ================= */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* Bulatan Gradasi Dekoratif (Anti Desain Polosan/Flat) */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-10 w-72 h-72 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                {/* Header / Top Navbar */}
                <header className="h-20 bg-white/60 backdrop-blur-xl border-b border-white shadow-sm flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 mr-2 lg:hidden rounded-lg text-slate-600 bg-white shadow-sm border border-slate-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        
                        {/* Ucapan Sapaan Kiri Atas */}
                        <div className="hidden md:block">
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Halo, {user.nama_lengkap?.split(' ')[0] || 'Pengguna'}! 👋</h2>
                            <p className="text-xs text-slate-500 font-medium">Sistem Pelayanan Administrasi Rukun Tetangga.</p>
                        </div>
                    </div>
                    
                    {/* Profil Pengguna Kanan Atas */}
                    <div className="flex items-center gap-4 bg-white/80 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="text-right">
                            <p className="text-[14px] font-bold text-slate-800 leading-tight">{user.nama_lengkap || 'User Sapa'}</p>
                            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{user.role || 'Warga'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-600/30 border-2 border-white">
                            {user.nama_lengkap ? user.nama_lengkap.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </div>
                </header>

                {/* Sub Halaman Konten (Render Children) */}
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
};