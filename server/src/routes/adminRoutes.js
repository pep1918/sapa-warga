const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/statistik', adminController.getStatistikAdmin);
router.get('/surat', adminController.getAllSurat);
router.put('/surat/:id', adminController.updateStatusSurat);
router.delete('/surat/:id', adminController.deleteSurat);
router.get('/pengaduan', adminController.getAllPengaduan);
router.put('/pengaduan/:id', adminController.tanggapiPengaduan);
router.delete('/pengaduan/:id', adminController.deletePengaduan);
router.get('/berita', adminController.getAllBerita);
router.post('/berita', adminController.tambahBerita);
router.put('/berita/:id', adminController.updateBerita);
router.delete('/berita/:id', adminController.deleteBerita);
router.get('/notifikasi', adminController.getNotifikasiAdmin);
router.put('/notifikasi/:id/read', adminController.bacaNotifikasiAdmin);

module.exports = router;