const express = require('express');
const router = express.Router();
const suratController = require('../controllers/suratController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');


router.post('/', verifyToken, suratController.buatPengajuan);
router.get('/saya', verifyToken, suratController.getSuratWarga);


router.get('/all', verifyToken, isAdmin, suratController.getAllSurat);

module.exports = router;