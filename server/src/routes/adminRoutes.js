const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


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

module.exports = router;