const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getStatistikAdmin = async (req, res) => {
    try {
        const [suratMenunggu] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE status = 'diteruskan_admin'");
        const [suratDisetujui] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE status = 'disetujui_admin'");
        const [aduanMenunggu] = await db.query("SELECT COUNT(*) as count FROM pengaduan WHERE status = 'diteruskan_admin'");
        const [aduanSelesai] = await db.query("SELECT COUNT(*) as count FROM pengaduan WHERE status = 'selesai'");
        const [totalBerita] = await db.query("SELECT COUNT(*) as count FROM portal_berita");
        res.json({ surat: { menunggu: suratMenunggu[0].count, disetujui: suratDisetujui[0].count, total: suratMenunggu[0].count + suratDisetujui[0].count }, pengaduan: { menunggu: aduanMenunggu[0].count, selesai: aduanSelesai[0].count, total: aduanMenunggu[0].count + aduanSelesai[0].count }, berita: { total: totalBerita[0].count } });
    } catch (err) { res.status(500).json({ error: 'Gagal memuat data statistik admin' }); }
};

exports.getAllSurat = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT pengajuan_surat.*, users.nama_lengkap, users.nik FROM pengajuan_surat JOIN users ON pengajuan_surat.warga_id = users.id WHERE pengajuan_surat.status IN ('diteruskan_admin', 'disetujui_admin', 'ditolak_admin') ORDER BY pengajuan_surat.created_at DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal memuat antrean surat' }); }
};

exports.updateStatusSurat = async (req, res) => {
    const { id } = req.params;
    const { status, pesan_admin } = req.body;
    try {
        await db.query('UPDATE pengajuan_surat SET status = ?, pesan_admin = ? WHERE id = ?', [status, pesan_admin, id]);
        
        // INJEKSI NOTIFIKASI KE WARGA
        const judulSurat = status === 'disetujui_admin' ? 'Surat Disetujui Kelurahan!' : 'Surat Ditolak Kelurahan';
        await db.query(
            "INSERT INTO notifikasi (id, penerima_id, judul, pesan) SELECT ?, warga_id, ?, ? FROM pengajuan_surat WHERE id = ?", 
            [uuidv4(), judulSurat, pesan_admin, id]
        );
        res.json({ success: true, message: 'Status surat final berhasil diperbarui!' });
    } catch (err) { res.status(500).json({ error: 'Gagal memperbarui status surat' }); }
};

exports.deleteSurat = async (req, res) => {
    try {
        await db.query('DELETE FROM pengajuan_surat WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Gagal menghapus' }); }
};

exports.getAllPengaduan = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT pengaduan.*, users.nama_lengkap FROM pengaduan JOIN users ON pengaduan.warga_id = users.id WHERE pengaduan.status IN ('diteruskan_admin', 'selesai', 'ditolak_admin') ORDER BY pengaduan.created_at DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal memuat pengaduan' }); }
};

exports.tanggapiPengaduan = async (req, res) => {
    const { id } = req.params;
    const { tanggapan_admin } = req.body;
    try {
        await db.query("UPDATE pengaduan SET tanggapan_admin = ?, status = 'selesai' WHERE id = ?", [tanggapan_admin, id]);
        
        // INJEKSI NOTIFIKASI KE WARGA
        await db.query(
            "INSERT INTO notifikasi (id, penerima_id, judul, pesan) SELECT ?, warga_id, 'Laporan Ditanggapi Pusat', ? FROM pengaduan WHERE id = ?", 
            [uuidv4(), tanggapan_admin, id]
        );
        res.json({ success: true, message: 'Tanggapan admin berhasil disimpan!' });
    } catch (err) { res.status(500).json({ error: 'Gagal memperbarui tabel' }); }
};

exports.deletePengaduan = async (req, res) => {
    try {
        await db.query('DELETE FROM pengaduan WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Gagal menghapus' }); }
};

// ==========================================
// PORTAL BERITA TANPA GAMBAR
// ==========================================
exports.getAllBerita = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT portal_berita.*, users.nama_lengkap AS penulis FROM portal_berita JOIN users ON portal_berita.admin_id = users.id ORDER BY portal_berita.created_at DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal memuat berita' }); }
};

exports.tambahBerita = async (req, res) => {
    const { admin_id, judul, konten, kategori, urgensi } = req.body;
    try {
        await db.query('INSERT INTO portal_berita (id, admin_id, judul, konten, kategori, urgensi) VALUES (?, ?, ?, ?, ?, ?)', [uuidv4(), admin_id, judul, konten, kategori || 'Pengumuman Umum', urgensi || 'Normal']);
        res.status(201).json({ success: true, message: 'Berita dipublikasikan!' });
    } catch (err) { res.status(500).json({ error: 'Gagal menyimpan berita' }); }
};

exports.updateBerita = async (req, res) => {
    const { judul, konten, kategori, urgensi } = req.body;
    try {
        await db.query('UPDATE portal_berita SET judul = ?, konten = ?, kategori = ?, urgensi = ? WHERE id = ?', [judul, konten, kategori, urgensi, req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Gagal update berita' }); }
};

exports.deleteBerita = async (req, res) => {
    try {
        await db.query('DELETE FROM portal_berita WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Gagal menghapus' }); }
};

// ==========================================
// FITUR BACA NOTIFIKASI ADMIN
// ==========================================
exports.getNotifikasiAdmin = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM notifikasi WHERE penerima_id = 'admin' ORDER BY created_at DESC LIMIT 15");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: 'Gagal memuat notifikasi Admin' }); }
};

exports.bacaNotifikasiAdmin = async (req, res) => {
    try {
        await db.query('UPDATE notifikasi SET is_read = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Gagal update status baca' }); }
};