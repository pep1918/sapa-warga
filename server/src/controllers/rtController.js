const db = require('../config/db');
const { v4: uuidv4 } = require('uuid'); 

exports.getStatistikRt = async (req, res) => {
    try {
        const [suratMenunggu] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE status = 'menunggu_rt'");
        const [suratDiteruskan] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE status = 'diteruskan_admin'");
        const [aduanMenunggu] = await db.query("SELECT COUNT(*) as count FROM pengaduan WHERE status = 'menunggu_rt'");
        res.json({ surat_menunggu: suratMenunggu[0].count, surat_diteruskan: suratDiteruskan[0].count, aduan_menunggu: aduanMenunggu[0].count });
    } catch (err) { res.status(500).json({ error: 'Gagal memuat statistik RT' }); }
};

exports.getAllSuratRt = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT pengajuan_surat.*, users.nama_lengkap, users.nik FROM pengajuan_surat JOIN users ON pengajuan_surat.warga_id = users.id ORDER BY pengajuan_surat.created_at DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal memuat surat RT' }); }
};

exports.validasiSuratRt = async (req, res) => {
    const { id } = req.params;
    const { status, pesan_penolakan } = req.body; 
    try {
        const pesan = pesan_penolakan ? `[Ditolak RT]: ${pesan_penolakan}` : 'Telah diverifikasi RT, menunggu Kelurahan';
        await db.query('UPDATE pengajuan_surat SET status = ?, pesan_admin = ? WHERE id = ?', [status, pesan, id]);
        
        // INJEKSI NOTIFIKASI (MENGGUNAKAN SUBQUERY UNTUK MENCARI WARGA_ID)
        if (status === 'ditolak_rt') {
            await db.query("INSERT INTO notifikasi (id, penerima_id, judul, pesan) SELECT ?, warga_id, 'Surat Ditolak RT', ? FROM pengajuan_surat WHERE id = ?", [uuidv4(), pesan, id]);
        } else if (status === 'diteruskan_admin') {
            await db.query("INSERT INTO notifikasi (id, penerima_id, judul, pesan) VALUES (?, 'admin', 'Validasi RT Selesai', 'Ada surat warga yang telah divalidasi RT dan menunggu persetujuan Kelurahan.')", [uuidv4()]);
        }
        res.json({ success: true, message: 'Validasi berhasil!' });
    } catch (err) { res.status(500).json({ error: 'Gagal memvalidasi surat' }); }
};

exports.getAllPengaduanRt = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT pengaduan.*, users.nama_lengkap FROM pengaduan JOIN users ON pengaduan.warga_id = users.id ORDER BY pengaduan.created_at DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal memuat laporan' }); }
};

exports.validasiPengaduanRt = async (req, res) => {
    const { id } = req.params;
    const { status, tanggapan_rt } = req.body;
    try {
        const pesan = tanggapan_rt ? `[Catatan RT]: ${tanggapan_rt}` : 'Valid. Diteruskan ke Admin Kelurahan.';
        await db.query('UPDATE pengaduan SET status = ?, tanggapan_admin = ? WHERE id = ?', [status, pesan, id]);
        
        // INJEKSI NOTIFIKASI
        if (status === 'ditolak_rt') {
            await db.query("INSERT INTO notifikasi (id, penerima_id, judul, pesan) SELECT ?, warga_id, 'Laporan Ditolak RT', ? FROM pengaduan WHERE id = ?", [uuidv4(), pesan, id]);
        } else if (status === 'diteruskan_admin') {
            await db.query("INSERT INTO notifikasi (id, penerima_id, judul, pesan) VALUES (?, 'admin', 'Laporan Tervalidasi', 'Ada laporan warga yang valid dari RT, menunggu tindak lanjut Kelurahan.')", [uuidv4()]);
        }
        res.json({ success: true, message: 'Validasi laporan berhasil!' });
    } catch (err) { res.status(500).json({ error: 'Gagal memvalidasi laporan' }); }
};

exports.getNotifikasiRt = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM notifikasi WHERE penerima_id = 'rt' ORDER BY created_at DESC LIMIT 15");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal memuat notifikasi RT' }); }
};

exports.bacaNotifikasiRt = async (req, res) => {
    try {
        await db.query('UPDATE notifikasi SET is_read = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Gagal update status baca' }); }
};