import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Halaman Autentikasi
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Import Halaman Warga
import { WargaDashboard } from './pages/warga/WargaDashboard';
import { PengajuanSurat } from './pages/warga/PengajuanSurat';
import { LaporMasalah } from './pages/warga/LaporMasalah';
import { BeritaWarga } from './pages/warga/BeritaWarga';
import { CetakSurat } from './pages/warga/CetakSurat'; // <-- FITUR CETAK

// Import Halaman RT (Verifikator Pertama)
import { RtDashboard } from './pages/rt/RtDashboard';
import { ValidasiSuratRt } from './pages/rt/ValidasiSuratRt';
import { ValidasiLaporanRt } from './pages/rt/ValidasiLaporanRt';

// Import Halaman Admin (Eksekutor Akhir)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { KelolaSurat } from './pages/admin/KelolaSurat';
import { TanggapiMasalah } from './pages/admin/TanggapiMasalah';
import { PortalBerita } from './pages/admin/PortalBerita';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Khusus WARGA */}
        <Route path="/warga/dashboard" element={<WargaDashboard />} />
        <Route path="/warga/pengajuan" element={<PengajuanSurat />} />
        <Route path="/warga/pengaduan" element={<LaporMasalah />} />
        <Route path="/warga/berita" element={<BeritaWarga />} />
        <Route path="/warga/cetak-surat" element={<CetakSurat />} />

        {/* Rute Khusus PENGURUS RT */}
        <Route path="/rt/dashboard" element={<RtDashboard />} />
        <Route path="/rt/validasi-surat" element={<ValidasiSuratRt />} />
        <Route path="/rt/validasi-laporan" element={<ValidasiLaporanRt />} />

        {/* Rute Khusus ADMIN KELURAHAN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/kelola-surat" element={<KelolaSurat />} />
        <Route path="/admin/tanggapi-masalah" element={<TanggapiMasalah />} />
        <Route path="/admin/portal-berita" element={<PortalBerita />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;