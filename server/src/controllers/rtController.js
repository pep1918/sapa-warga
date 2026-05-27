const db = require('../config/db');

// ==========================================
// 1. KONTROLER RT: VALIDASI SURAT
// ==========================================
exports.getAllSuratRt = async (req, res) => {
    try {
        // RT melihat semua surat, terutama yang berstatus 'menunggu_rt'
        const [rows] = await db.query(`
            SELECT pengajuan_surat.*, users.nama_lengkap, users.nik 
            FROM pengajuan_surat 
            JOIN users ON pengajuan_surat.warga_id = users.id 
            ORDER BY pengajuan_surat.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error Get Surat RT:", err);
        res.status(500).json({ error: 'Gagal memuat data surat untuk RT' });
    }
};

exports.validasiSuratRt = async (req, res) => {
    const { id } = req.params;
    const { status, pesan_penolakan } = req.body; 
    // status yang diharapkan: 'diteruskan_admin' atau 'ditolak_rt'
    
    try {
        // Kita simpan pesan penolakan RT ke dalam kolom pesan_admin (agar tidak perlu merombak tabel MySQL)
        const pesan = pesan_penolakan ? `[Ditolak RT]: ${pesan_penolakan}` : 'Telah diverifikasi RT, menunggu Kelurahan';
        
        await db.query(
            'UPDATE pengajuan_surat SET status = ?, pesan_admin = ? WHERE id = ?',
            [status, pesan, id]
        );
        res.json({ success: true, message: 'Verifikasi surat tingkat RT berhasil disimpan!' });
    } catch (err) {
        console.error("Error Validasi Surat RT:", err);
        res.status(500).json({ error: 'Gagal memvalidasi surat' });
    }
};

// ==========================================
// 2. KONTROLER RT: VALIDASI LAPORAN MASALAH
// ==========================================
exports.getAllPengaduanRt = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT pengaduan.*, users.nama_lengkap 
            FROM pengaduan 
            JOIN users ON pengaduan.warga_id = users.id 
            ORDER BY pengaduan.created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error Get Pengaduan RT:", err);
        res.status(500).json({ error: 'Gagal memuat laporan warga' });
    }
};

exports.validasiPengaduanRt = async (req, res) => {
    const { id } = req.params;
    const { status, tanggapan_rt } = req.body;
    // status yang diharapkan: 'diteruskan_admin' atau 'ditolak_rt'
    
    try {
        const pesan = tanggapan_rt ? `[Catatan RT]: ${tanggapan_rt}` : 'Valid. Diteruskan ke Admin Kelurahan.';
        await db.query(
            'UPDATE pengaduan SET status = ?, tanggapan_admin = ? WHERE id = ?',
            [status, pesan, id]
        );
        res.json({ success: true, message: 'Validasi laporan berhasil!' });
    } catch (err) {
        console.error("Error Validasi Pengaduan RT:", err);
        res.status(500).json({ error: 'Gagal memvalidasi laporan' });
    }
};

// ==========================================
// 3. STATISTIK DASBOR RT
// ==========================================
exports.getStatistikRt = async (req, res) => {
    try {
        const [suratMenunggu] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE status = 'menunggu_rt'");
        const [suratDiteruskan] = await db.query("SELECT COUNT(*) as count FROM pengajuan_surat WHERE status = 'diteruskan_admin'");
        const [aduanMenunggu] = await db.query("SELECT COUNT(*) as count FROM pengaduan WHERE status = 'menunggu_rt'");
        
        res.json({
            surat_menunggu: suratMenunggu[0].count,
            surat_diteruskan: suratDiteruskan[0].count,
            aduan_menunggu: aduanMenunggu[0].count
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal memuat statistik RT' });
    }
};