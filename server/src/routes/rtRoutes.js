const express = require('express');
const router = express.Router();
const rtController = require('../controllers/rtController');

router.get('/statistik', rtController.getStatistikRt);
router.get('/surat', rtController.getAllSuratRt);
router.put('/surat/:id', rtController.validasiSuratRt);
router.get('/pengaduan', rtController.getAllPengaduanRt);
router.put('/pengaduan/:id', rtController.validasiPengaduanRt);

module.exports = router;