const multer = require('multer');
const path = require('path');

// Contoh pengaturan storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});


const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 
    }
});

module.exports = upload;