const express = require('express');
const cors = require('cors');
const path = require('path'); // <-- TAMBAHAN: Import path untuk mengatur direktori file statis

const authRoutes = require('./routes/authRoutes');
const wargaRoutes = require('./routes/wargaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const rtRoutes = require('./routes/rtRoutes'); // <-- TAMBAHAN: Import rute RT

const app = express();

app.use(cors());
app.use(express.json());

// <-- TAMBAHAN UTAMA: Membuka akses public ke folder uploads
// Karena file app.js berada di dalam folder 'src', kita menggunakan '../uploads'
// agar Express mencari folder uploads di luar 'src' (di dalam root folder 'server')
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/warga', wargaRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/rt', rtRoutes); // <-- TAMBAHAN: Daftarkan URL RT

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server Backend Sapa Warga berjalan normal di http://localhost:${PORT}`);
});