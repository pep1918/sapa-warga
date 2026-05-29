const express = require('express');
const router = express.Router();
const wargaController = require('../controllers/wargaController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Buat folder otomatis jika belum ada (Mencegah Error ENOENT)
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Konfigurasi penyimpanan file Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Simpan di folder server/uploads/
    },
    filename: function (req, file, cb) {
        // Nama file unik: timestamp + angka acak + ekstensi asli
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    // SUDAH DIPERBAIKI: Disinkronkan dengan frontend menjadi 5MB
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// --- ROUTES UNTUK WARGA ---

// Statistik & Riwayat
router.get('/statistik/:warga_id', wargaController.getStatistik);
router.get('/surat/:warga_id', wargaController.getRiwayatSurat);

// Route Upload Surat (SINKRON DENGAN FRONTEND)
router.post('/surat', upload.single('dokumen_pendukung'), wargaController.ajukanSurat);

// Route Pengaduan & Berita
router.post('/pengaduan', wargaController.buatPengaduan);
router.get('/pengaduan/:warga_id', wargaController.getRiwayatPengaduan);
router.get('/berita', wargaController.getAllBeritaWarga);

// Route Notifikasi
router.get('/notifikasi/:warga_id', wargaController.getNotifikasi);
router.put('/notifikasi/:id/read', wargaController.bacaNotifikasi);

module.exports = router;