import React from 'react';

export const Footer = () => {
    return (
        <footer className="w-full bg-[#EDEDF2] border-t border-[#D5D5D7] py-8 mt-auto">
            <div className="max-w-[1262px] mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="font-text text-[12px] text-[#6E6E73]">
                    &copy; 2026 Sistem Pelayanan Administrasi Sapa Warga.
                </div>
                <div className="flex gap-4">
                    <a href="#" className="font-text text-[12px] text-[#333336] hover:text-[#0071E3] transition-colors">Bantuan</a>
                    <a href="#" className="font-text text-[12px] text-[#333336] hover:text-[#0071E3] transition-colors">Privasi</a>
                    <a href="#" className="font-text text-[12px] text-[#333336] hover:text-[#0071E3] transition-colors">Ketentuan</a>
                </div>
            </div>
        </footer>
    );
};