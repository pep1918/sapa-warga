const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// ====================================================
// 1. STATISTIK DASBOR WARGA
// ====================================================
exports.getStatistik = async (req, res) => {
    const { warga_id } = req.params;
    try {
        const [totalSurat] = await db.query('SELECT COUNT(*) as count FROM pengajuan_surat WHERE warga_id = ?', [warga_id]);
        const [disetujui] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE warga_id = ? AND status IN ('disetujui_admin', 'disetujui')", [warga_id]);
        const [menunggu] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE warga_id = ? AND status IN ('menunggu_rt', 'diteruskan_admin')", [warga_id]);
        const [pengaduan] = await db.query('SELECT COUNT(*) as count FROM pengaduan WHERE warga_id = ?', [warga_id]);

        res.json({
            totalSurat: totalSurat[0].count,
            disetujui: disetujui[0].count,
            menunggu: menunggu[0].count,
            pengaduan: pengaduan[0].count
        });
    } catch (err) {
        console.error("Error Statistik Warga:", err);
        res.status(500).json({ error: 'Gagal memuat kueri statistik' });
    }
};

// ====================================================
// 2. RIWAYAT PENGAJUAN SURAT WARGA
// ====================================================
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

// ====================================================
// 3. INPUT PENGAJUAN SURAT BARU
// ====================================================
exports.ajukanSurat = async (req, res) => {
    const { warga_id, jenis_surat, keperluan, dokumen_pendukung } = req.body;
    if (!warga_id) return res.status(400).json({ error: "Sesi ID Warga tidak valid / Kosong!" });

    try {
        const newId = uuidv4();
        await db.query(
            'INSERT INTO pengajuan_surat (id, warga_id, jenis_surat, keperluan, dokumen_pendukung, status) VALUES (?, ?, ?, ?, ?, ?)',
            // PERUBAHAN: Status awal sekarang adalah 'menunggu_rt'
            [newId, warga_id, jenis_surat, keperluan, dokumen_pendukung || null, 'menunggu_rt']
        );
        res.status(201).json({ success: true, message: 'Surat berhasil diajukan!' });
    } catch (err) {
        console.error("❌ Gagal Simpan Surat:", err);
        res.status(500).json({ error: err.message || 'Gagal menyimpan pengajuan surat ke MySQL' });
    }
};

// ====================================================
// 4. INPUT PENGADUAN MASALAH
// ====================================================
exports.buatPengaduan = async (req, res) => {
    const { warga_id, judul, deskripsi } = req.body;
    if (!warga_id) return res.status(400).json({ error: "ID Warga kosong! Silakan Log Out dan Login kembali." });

    try {
        const newId = uuidv4();
        await db.query(
            'INSERT INTO pengaduan (id, warga_id, judul, deskripsi, status) VALUES (?, ?, ?, ?, ?)',
            // PERUBAHAN: Status awal sekarang adalah 'menunggu_rt'
            [newId, warga_id, judul, deskripsi, 'menunggu_rt']
        );
        res.status(201).json({ success: true, message: 'Laporan berhasil dibuat!' });
    } catch (err) {
        console.error("❌ Gagal Simpan Aduan di MySQL:", err.message);
        res.status(500).json({ error: `MySQL Error: ${err.message}` });
    }
};

// ====================================================
// 5. AMBIL RIWAYAT PENGADUAN WARGA
// ====================================================
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

// ====================================================
// 6. AMBIL DAFTAR BERITA UNTUK WARGA
// ====================================================
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