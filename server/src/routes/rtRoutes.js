const express = require('express');
const router = express.Router();
const rtController = require('../controllers/rtController');

// Route Statistik Dashboard
router.get('/statistik', rtController.getStatistikRt);

// Route Kelola Surat
router.get('/surat', rtController.getAllSuratRt);
router.put('/surat/:id', rtController.validasiSuratRt);

// Route Kelola Pengaduan/Laporan Warga
router.get('/pengaduan', rtController.getAllPengaduanRt);
router.put('/pengaduan/:id', rtController.validasiPengaduanRt);

// Route Notifikasi
router.get('/notifikasi', rtController.getNotifikasiRt);
router.put('/notifikasi/:id/read', rtController.bacaNotifikasiRt);

module.exports = router;