const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getStatistik = async (req, res) => {
    const { warga_id } = req.params;
    try {
        const [totalSurat] = await db.query('SELECT COUNT(*) as count FROM pengajuan_surat WHERE warga_id = ?', [warga_id]);
        const [disetujui] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE warga_id = ? AND status IN ('disetujui_admin', 'disetujui')", [warga_id]);
        const [menunggu] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE warga_id = ? AND status IN ('menunggu_rt', 'diteruskan_admin')", [warga_id]);
        const [pengaduan] = await db.query('SELECT COUNT(*) as count FROM pengaduan WHERE warga_id = ?', [warga_id]);
        res.json({ totalSurat: totalSurat[0].count, disetujui: disetujui[0].count, menunggu: menunggu[0].count, pengaduan: pengaduan[0].count });
    } catch (err) { res.status(500).json({ error: 'Gagal memuat statistik' }); }
};

exports.getRiwayatSurat = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pengajuan_surat WHERE warga_id = ? ORDER BY created_at DESC', [req.params.warga_id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal mengambil riwayat surat' }); }
};

exports.getRiwayatPengaduan = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pengaduan WHERE warga_id = ? ORDER BY created_at DESC', [req.params.warga_id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal mengambil riwayat pengaduan' }); }
};

exports.getAllBeritaWarga = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT portal_berita.*, users.nama_lengkap AS penulis FROM portal_berita JOIN users ON portal_berita.admin_id = users.id ORDER BY portal_berita.created_at DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal mengambil berita' }); }
};

exports.ajukanSurat = async (req, res) => {
    // 1. Ekstrak teks dari req.body
    const { warga_id, jenis_surat, keperluan } = req.body;
    
    // 2. Ekstrak nama file dari req.file (hasil pemrosesan Multer)
    const dokumen_pendukung = req.file ? req.file.filename : null;

    try {
        const newId = uuidv4();
        await db.query(
            'INSERT INTO pengajuan_surat (id, warga_id, jenis_surat, keperluan, dokumen_pendukung, status) VALUES (?, ?, ?, ?, ?, ?)',
            [newId, warga_id, jenis_surat, keperluan, dokumen_pendukung, 'menunggu_rt']
        );
        
        await db.query(
            "INSERT INTO notifikasi (id, penerima_id, judul, pesan) VALUES (?, 'rt', 'Surat Baru', ?)", 
            [uuidv4(), `Warga mengajukan surat: ${jenis_surat}. Menunggu validasi Anda.`]
        );
        res.status(201).json({ success: true, message: 'Surat berhasil diajukan!' });
    } catch (err) { res.status(500).json({ error: 'Gagal menyimpan pengajuan' }); }
};

exports.buatPengaduan = async (req, res) => {
    const { warga_id, judul, deskripsi } = req.body;
    try {
        const newId = uuidv4();
        await db.query(
            'INSERT INTO pengaduan (id, warga_id, judul, deskripsi, status) VALUES (?, ?, ?, ?, ?)',
            [newId, warga_id, judul, deskripsi, 'menunggu_rt']
        );
        
        await db.query(
            "INSERT INTO notifikasi (id, penerima_id, judul, pesan) VALUES (?, 'rt', 'Laporan Baru', ?)", 
            [uuidv4(), `Ada laporan aduan baru: ${judul}. Segera periksa kelayakannya.`]
        );
        res.status(201).json({ success: true, message: 'Laporan berhasil dibuat!' });
    } catch (err) { res.status(500).json({ error: 'Gagal menyimpan laporan' }); }
};

exports.getNotifikasi = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM notifikasi WHERE penerima_id = ? ORDER BY created_at DESC LIMIT 15', [req.params.warga_id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal memuat notifikasi' }); }
};

exports.bacaNotifikasi = async (req, res) => {
    try {
        await db.query('UPDATE notifikasi SET is_read = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Gagal update status baca' }); }
};