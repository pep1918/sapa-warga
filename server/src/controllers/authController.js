const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_sapa_warga_super_aman_123';


exports.register = async (req, res) => {
    const { nik, nama_lengkap, email, password } = req.body;

    try {
        
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ? OR nik = ?', [email, nik]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Gagal! Email atau NIK sudah terdaftar di sistem.' });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newId = uuidv4();
        
        
        await db.query(
            'INSERT INTO users (id, nik, nama_lengkap, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            [newId, nik, nama_lengkap, email, hashedPassword, 'warga']
        );

        res.status(201).json({ success: true, message: 'Registrasi berhasil! Silakan login.' });
    } catch (err) {
        console.error("Error Registrasi:", err);
        res.status(500).json({ error: 'Terjadi kesalahan server saat menyimpan data registrasi.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'Email tidak ditemukan! Silakan daftar terlebih dahulu.' });
        }

        const user = users[0];

       
        let isMatch = false;
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            
            isMatch = password === user.password;
        }

        if (!isMatch) {
            return res.status(400).json({ error: 'Kata sandi yang Anda masukkan salah!' });
        }

        
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        
        res.json({
            success: true,
            message: 'Login berhasil',
            token,
            user: { 
                id: user.id, 
                nik: user.nik, 
                nama_lengkap: user.nama_lengkap, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (err) {
        console.error("Error Login:", err);
        res.status(500).json({ error: 'Terjadi kesalahan server saat proses login.' });
    }
};