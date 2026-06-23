const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.buatPengajuan = async (req, res) => {
    const { jenis_surat, keperluan } = req.body;
    const warga_id = req.user.id; 
    const id = uuidv4(); 

    try {
        const query = 'INSERT INTO pengajuan_surat (id, warga_id, jenis_surat, keperluan, status) VALUES (?, ?, ?, ?, "menunggu")';
        await pool.query(query, [id, warga_id, jenis_surat, keperluan]);
        
        res.status(201).json({ message: 'Pengajuan surat berhasil dikirim' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error });
    }
};

exports.getSuratWarga = async (req, res) => {
    const warga_id = req.user.id;
    try {
        const [rows] = await pool.query('SELECT * FROM pengajuan_surat WHERE warga_id = ? ORDER BY created_at DESC', [warga_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data', error });
    }
};

exports.getAllSurat = async (req, res) => {
    try {
      
        const query = `
            SELECT p.*, u.nama_lengkap 
            FROM pengajuan_surat p 
            JOIN users u ON p.warga_id = u.id 
            ORDER BY p.created_at DESC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data', error });
    }
};