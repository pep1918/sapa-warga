import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full h-[44px] bg-apple-surface-nav backdrop-blur-md border-b border-black/10 flex items-center px-5 z-50">
      <div className="max-w-[1262px] mx-auto w-full flex justify-between items-center">
        <Link to="/" className="font-display font-semibold text-[17px] text-apple-text-dominant">
          Sapa Warga
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/pengajuan" className="font-text text-[17px] text-black/80 hover:text-apple-blue transition-colors">
            Pengajuan Surat
          </Link>
          <Link to="/lapor" className="font-text text-[17px] text-black/80 hover:text-apple-blue transition-colors">
            Lapor
          </Link>
          <Link to="/login" className="font-text font-semibold text-[17px] text-apple-blue hover:text-apple-blue-hover">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};