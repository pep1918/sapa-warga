const express = require('express');
const router = express.Router();
const wargaController = require('../controllers/wargaController');


router.get('/statistik/:warga_id', wargaController.getStatistik);
router.get('/surat/:warga_id', wargaController.getRiwayatSurat);
router.post('/surat', wargaController.ajukanSurat);
router.post('/pengaduan', wargaController.buatPengaduan);


router.get('/berita', wargaController.getAllBeritaWarga);

router.get('/pengaduan/:warga_id', wargaController.getRiwayatPengaduan); // <-- TAMBAHKAN BARIS INI
// module.exports = router;

module.exports = router;