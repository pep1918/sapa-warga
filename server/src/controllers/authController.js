const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
    const { nik, nama_lengkap, email, username, no_telp, password } = req.body;
    
    try {
        const [existing] = await db.query(
            'SELECT * FROM users WHERE nik = ? OR username = ?', 
            [nik, username]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Gagal! NIK atau Username tersebut sudah terdaftar.' });
        }

        const newId = uuidv4();
        await db.query(
            'INSERT INTO users (id, nik, nama_lengkap, email, username, no_telp, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [newId, nik, nama_lengkap, email, username, no_telp, password, 'warga']
        );
        
        res.status(201).json({ success: true, message: 'Akun berhasil dibuat! Silakan login menggunakan Username Anda.' });
    } catch (err) {
        console.error("Error Register:", err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat registrasi.' });
    }
};

exports.login = async (req, res) => {
    // 1. Tangkap username dan password
    const { username, password } = req.body;
    
    try {
        // 2. Cari berdasarkan USERNAME (bukan email)
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );
        
        // Jika username tidak ada di database
        if (users.length === 0) {
            return res.status(401).json({ error: 'Username tidak ditemukan! Silakan daftar terlebih dahulu.' });
        }

        const user = users[0];

        // 3. Cek apakah password cocok
        if (user.password !== password) {
            return res.status(401).json({ error: 'Kata sandi salah!' });
        }
        
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                nik: user.nik, 
                nama_lengkap: user.nama_lengkap, 
                email: user.email,
                username: user.username,
                no_telp: user.no_telp,
                role: user.role 
            } 
        });
    } catch (err) {
        console.error("Error Login:", err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat login.' });
    }
};