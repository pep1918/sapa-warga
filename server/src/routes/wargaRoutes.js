const express = require('express');
const router = express.Router();
const wargaController = require('../controllers/wargaController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Buat folder otomatis jika belum ada
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 2. Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Simpan di folder server/uploads/
    },
    filename: function (req, file, cb) {
        // Nama file unik: timestamp + ekstensi asli (contoh: 1698765432-ktp.jpg)
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


router.get('/statistik/:warga_id', wargaController.getStatistik);
router.get('/surat/:warga_id', wargaController.getRiwayatSurat);


router.post('/surat', upload.single('dokumen_pendukung'), wargaController.ajukanSurat);

router.post('/pengaduan', wargaController.buatPengaduan);
router.get('/pengaduan/:warga_id', wargaController.getRiwayatPengaduan);
router.get('/berita', wargaController.getAllBeritaWarga);


router.get('/notifikasi/:warga_id', wargaController.getNotifikasi);
router.put('/notifikasi/:id/read', wargaController.bacaNotifikasi);

module.exports = router;