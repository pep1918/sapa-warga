import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';


import { WargaDashboard } from './pages/warga/WargaDashboard';
import { PengajuanSurat } from './pages/warga/PengajuanSurat';
import { LaporMasalah } from './pages/warga/LaporMasalah';
import { BeritaWarga } from './pages/warga/BeritaWarga';


import { KelolaSurat } from './pages/admin/KelolaSurat';
import { TanggapiMasalah } from './pages/admin/TanggapiMasalah';
import { PortalBerita } from './pages/admin/PortalBerita';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {}
        <Route path="/warga/dashboard" element={<WargaDashboard />} />
        <Route path="/warga/pengajuan" element={<PengajuanSurat />} />
        <Route path="/warga/pengaduan" element={<LaporMasalah />} />
        <Route path="/warga/berita" element={<BeritaWarga />} />

        {/* Rute Khusus Admin */}
        <Route path="/admin/dashboard" element={<Navigate to="/admin/kelola-surat" replace />} />
        <Route path="/admin/kelola-surat" element={<KelolaSurat />} />
        <Route path="/admin/tanggapi-masalah" element={<TanggapiMasalah />} />
        <Route path="/admin/portal-berita" element={<PortalBerita />} />

        {}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;