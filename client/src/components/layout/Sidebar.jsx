import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/admin/surat', label: 'Kelola Surat', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { path: '/admin/berita', label: 'Portal Berita', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' }
    ];

    return (
        <aside className="w-full md:w-[260px] bg-white border-r border-[#EDEDF2] hidden md:flex flex-col min-h-[calc(100vh-44px)]">
            <div className="p-6">
                <p className="font-text text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-4">Menu Admin</p>
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center gap-3 min-h-[44px] px-4 rounded-lg font-text text-[17px] transition-all ${
                                    isActive 
                                    ? 'bg-[#0071E3]/10 text-[#0071E3] font-semibold' 
                                    : 'text-[#333336] hover:bg-[#EDEDF2] hover:text-[#1D1D1F]'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};