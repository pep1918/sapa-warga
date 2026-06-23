import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';

// Komponen Dummy untuk Dashboard (Sebagai bukti login berhasil)
const DashboardWarga = () => (
  <div className="min-h-screen flex items-center justify-center bg-apple-surface-light">
    <h1 className="font-display text-4xl text-apple-text-dominant">Halo Warga 👋</h1>
  </div>
);

const DashboardAdmin = () => (
  <div className="min-h-screen flex items-center justify-center bg-apple-surface-light">
    <h1 className="font-display text-4xl text-apple-text-dominant">Halo Admin 🛡️</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/warga" element={<DashboardWarga />} />
        <Route path="/admin" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;