import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 w-full bg-apple-surface-nav backdrop-blur-md border-b border-black/10 z-50">
            <div className="max-w-[1262px] mx-auto px-5">
                <div className="flex justify-between items-center min-h-[44px] py-2">
                    
                    <Link to={user.role === 'admin' ? '/admin' : '/warga'} className="font-display font-semibold text-[17px] text-apple-text-dominant">
                        Sapa Warga
                    </Link>

                    
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-apple-text-dominant focus:outline-none flex items-center justify-center min-h-[44px] min-w-[44px]"
                        aria-label="Toggle Menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    
                    <div className="hidden md:flex items-center gap-6">
                        {user.role === 'warga' && (
                            <>
                                <Link to="/warga" className="font-text text-[17px] text-black/80 hover:text-apple-blue transition-colors">Surat</Link>
                                <Link to="/lapor" className="font-text text-[17px] text-black/80 hover:text-apple-blue transition-colors">Lapor</Link>
                            </>
                        )}
                        <button onClick={handleLogout} className="font-text font-semibold text-[17px] text-apple-text-dominant hover:text-apple-blue min-h-[44px] transition-colors">
                            Keluar
                        </button>
                    </div>
                </div>

                
                {isMenuOpen && (
                    <div className="md:hidden border-t border-black/10 py-4 flex flex-col gap-4">
                        {user.role === 'warga' && (
                            <>
                                <Link to="/warga" onClick={() => setIsMenuOpen(false)} className="font-text text-[17px] text-black/80 hover:text-apple-blue px-2 py-1">Surat</Link>
                                <Link to="/lapor" onClick={() => setIsMenuOpen(false)} className="font-text text-[17px] text-black/80 hover:text-apple-blue px-2 py-1">Lapor</Link>
                            </>
                        )}
                        <button onClick={handleLogout} className="font-text font-semibold text-[17px] text-left text-apple-text-dominant hover:text-apple-blue px-2 py-1">
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};