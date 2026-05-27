const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// ==========================================
// 1. STATISTIK DASBOR ADMIN
// ==========================================
exports.getStatistikAdmin = async (req, res) => {
    try {
        const [suratMenunggu] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE status = 'diteruskan_admin'");
        const [suratDisetujui] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE status = 'disetujui_admin'");
        const [aduanMenunggu] = await db.query("SELECT COUNT(*) as count FROM pengaduan WHERE status = 'diteruskan_admin'");
        const [aduanSelesai] = await db.query("SELECT COUNT(*) as count FROM pengaduan WHERE status = 'selesai'");
        const [totalBerita] = await db.query("SELECT COUNT(*) as count FROM portal_berita");

        res.json({
            surat: {
                menunggu: suratMenunggu[0].count,
                disetujui: suratDisetujui[0].count,
                total: suratMenunggu[0].count + suratDisetujui[0].count
            },
            pengaduan: {
                menunggu: aduanMenunggu[0].count,
                selesai: aduanSelesai[0].count,
                total: aduanMenunggu[0].count + aduanSelesai[0].count
            },
            berita: { total: totalBerita[0].count }
        });
    } catch (err) {
        console.error("Error Statistik Admin:", err);
        res.status(500).json({ error: 'Gagal memuat data statistik admin' });
    }
};

// ==========================================
// 2. KONTROLER: KELOLA SURAT PENGAJUAN
// ==========================================
exports.getAllSurat = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT pengajuan_surat.*, users.nama_lengkap, users.nik 
            FROM pengajuan_surat 
            JOIN users ON pengajuan_surat.warga_id = users.id 
            WHERE pengajuan_surat.status IN ('diteruskan_admin', 'disetujui_admin', 'ditolak_admin')
            ORDER BY pengajuan_surat.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error Get All Surat:", err);
        res.status(500).json({ error: 'Gagal memuat antrean surat dari database' });
    }
};

exports.updateStatusSurat = async (req, res) => {
    const { id } = req.params;
    const { status, pesan_admin } = req.body;
    try {
        await db.query(
            'UPDATE pengajuan_surat SET status = ?, pesan_admin = ? WHERE id = ?',
            [status, pesan_admin, id]
        );
        res.json({ success: true, message: 'Status surat final berhasil diperbarui!' });
    } catch (err) {
        console.error("Error Update Surat:", err);
        res.status(500).json({ error: 'Gagal memperbarui status surat' });
    }
};

exports.deleteSurat = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM pengajuan_surat WHERE id = ?', [id]);
        res.json({ success: true, message: 'Surat berhasil dihapus secara permanen!' });
    } catch (err) {
        console.error("Error Hapus Surat:", err);
        res.status(500).json({ error: 'Gagal menghapus surat dari database' });
    }
};

// ==========================================
// 3. KONTROLER: TANGGAPI PENGADUAN MASALAH
// ==========================================
exports.getAllPengaduan = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT pengaduan.*, users.nama_lengkap 
            FROM pengaduan 
            JOIN users ON pengaduan.warga_id = users.id 
            WHERE pengaduan.status IN ('diteruskan_admin', 'selesai', 'ditolak_admin')
            ORDER BY pengaduan.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error Get Pengaduan:", err);
        res.status(500).json({ error: 'Gagal memuat kueri tabel pengaduan' });
    }
};

exports.tanggapiPengaduan = async (req, res) => {
    const { id } = req.params;
    const { tanggapan_admin } = req.body;
    try {
        await db.query(
            "UPDATE pengaduan SET tanggapan_admin = ?, status = 'selesai' WHERE id = ?",
            [tanggapan_admin, id]
        );
        res.json({ success: true, message: 'Tanggapan admin berhasil disimpan!' });
    } catch (err) {
        console.error("Error Tanggapi Pengaduan:", err);
        res.status(500).json({ error: 'Gagal memperbarui tabel pengaduan' });
    }
};

exports.deletePengaduan = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM pengaduan WHERE id = ?', [id]);
        res.json({ success: true, message: 'Laporan pengaduan berhasil dihapus!' });
    } catch (err) {
        console.error("Error Hapus Pengaduan:", err);
        res.status(500).json({ error: 'Gagal menghapus laporan dari database' });
    }
};

// ==========================================
// 4. KONTROLER: PORTAL BERITA (ADMIN)
// ==========================================
exports.getAllBerita = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT portal_berita.*, users.nama_lengkap AS penulis 
            FROM portal_berita 
            JOIN users ON portal_berita.admin_id = users.id 
            ORDER BY portal_berita.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error Get Berita:", err);
        res.status(500).json({ error: 'Gagal memuat berita dari database' });
    }
};

exports.tambahBerita = async (req, res) => {
    const { admin_id, judul, konten, kategori, urgensi } = req.body;
    if (!admin_id) return res.status(400).json({ error: "Sesi Admin tidak valid!" });

    try {
        const newId = uuidv4();
        // Insert tanpa kolom gambar, menggunakan kategori dan urgensi baru
        await db.query(
            'INSERT INTO portal_berita (id, admin_id, judul, konten, kategori, urgensi) VALUES (?, ?, ?, ?, ?, ?)',
            [newId, admin_id, judul, konten, kategori || 'Pengumuman Umum', urgensi || 'Normal']
        );
        res.status(201).json({ success: true, message: 'Berita berhasil dipublikasikan!' });
    } catch (err) {
        console.error("Error Tambah Berita:", err);
        res.status(500).json({ error: 'Gagal menyimpan berita ke database' });
    }
};

exports.updateBerita = async (req, res) => {
    const { id } = req.params;
    const { judul, konten, kategori, urgensi } = req.body;
    try {
        await db.query(
            'UPDATE portal_berita SET judul = ?, konten = ?, kategori = ?, urgensi = ? WHERE id = ?',
            [judul, konten, kategori, urgensi, id]
        );
        res.json({ success: true, message: 'Berita berhasil diperbarui!' });
    } catch (err) {
        console.error("Error Edit Berita:", err);
        res.status(500).json({ error: 'Gagal memperbarui berita di database' });
    }
};

exports.deleteBerita = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM portal_berita WHERE id = ?', [id]);
        res.json({ success: true, message: 'Berita berhasil dihapus secara permanen!' });
    } catch (err) {
        console.error("Error Hapus Berita:", err);
        res.status(500).json({ error: 'Gagal menghapus berita dari database' });
    }
};