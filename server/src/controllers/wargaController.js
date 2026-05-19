const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); 

exports.getStatistik = async (req, res) => {
    const { warga_id } = req.params;
    try {
        const [totalSurat] = await db.query('SELECT COUNT(*) as count FROM pengajuan_surat WHERE warga_id = ?', [warga_id]);
        const [disetujui] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE warga_id = ? AND status = 'disetujui'", [warga_id]);
        const [menunggu] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE warga_id = ? AND status = 'menunggu'", [warga_id]);
        const [pengaduan] = await db.query('SELECT COUNT(*) as count FROM pengaduan WHERE warga_id = ?', [warga_id]);

        res.json({
            totalSurat: totalSurat[0].count,
            disetujui: disetujui[0].count,
            menunggu: menunggu[0].count,
            pengaduan: pengaduan[0].count
        });
    } catch (err) {
        console.error("Error Statistik:", err);
        res.status(500).json({ error: 'Gagal memuat kueri statistik' });
    }
};

exports.getRiwayatSurat = async (req, res) => {
    const { warga_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM pengajuan_surat WHERE warga_id = ? ORDER BY created_at DESC', [warga_id]);
        res.json(rows);
    } catch (err) {
        console.error("Error Riwayat Surat:", err);
        res.status(500).json({ error: 'Gagal mengambil riwayat surat' });
    }
};

exports.ajukanSurat = async (req, res) => {
    const { warga_id, jenis_surat, keperluan, dokumen_pendukung } = req.body;
    
    if (!warga_id) return res.status(400).json({ error: "Sesi ID Warga tidak valid / Kosong!" });

    try {
        const newId = uuidv4();
        await db.query(
            'INSERT INTO pengajuan_surat (id, warga_id, jenis_surat, keperluan, dokumen_pendukung, status) VALUES (?, ?, ?, ?, ?, ?)',
            [newId, warga_id, jenis_surat, keperluan, dokumen_pendukung || null, 'menunggu']
        );
        res.status(201).json({ success: true, message: 'Surat berhasil diajukan!' });
    } catch (err) {
        console.error("Gagal Simpan Surat:", err);
        res.status(500).json({ error: err.message || 'Gagal menyimpan pengajuan surat ke MySQL' });
    }
};

exports.buatPengaduan = async (req, res) => {
    const { warga_id, judul, deskripsi } = req.body;
    
    if (!warga_id) return res.status(400).json({ error: "ID Warga kosong! Silakan Log Out dan Login kembali." });

    try {
        const newId = uuidv4();
        await db.query(
            'INSERT INTO pengaduan (id, warga_id, judul, deskripsi, status) VALUES (?, ?, ?, ?, ?)',
            [newId, warga_id, judul, deskripsi, 'menunggu']
        );
        res.status(201).json({ success: true, message: 'Laporan berhasil dibuat!' });
    } catch (err) {
        console.error("Gagal Simpan Aduan di MySQL:", err.message);
        res.status(500).json({ error: `MySQL Error: ${err.message}` });
    }
};

exports.getRiwayatPengaduan = async (req, res) => {
    const { warga_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM pengaduan WHERE warga_id = ? ORDER BY created_at DESC', [warga_id]);
        res.json(rows);
    } catch (err) {
        console.error("Error Riwayat Pengaduan:", err);
        res.status(500).json({ error: 'Gagal mengambil riwayat pengaduan warga' });
    }
};


exports.getAllBeritaWarga = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT portal_berita.*, users.nama_lengkap AS penulis 
            FROM portal_berita 
            JOIN users ON portal_berita.admin_id = users.id 
            ORDER BY portal_berita.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error Get Berita Warga:", err);
        res.status(500).json({ error: 'Gagal mengambil berita' });
    }
};