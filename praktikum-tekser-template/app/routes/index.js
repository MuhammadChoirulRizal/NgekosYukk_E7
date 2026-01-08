const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// Home page - Dashboard
router.get('/', async (req, res) => {
    try {
        const [kamar] = await db.query(`
            SELECT k.*, p.nama_penyewa 
            FROM kamar k 
            LEFT JOIN penyewa p ON k.id_penyewa = p.id_penyewa 
            ORDER BY k.created_at DESC
        `);
        
        // Count statistics
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_kamar,
                SUM(CASE WHEN status_kamar = 'tersedia' THEN 1 ELSE 0 END) as kamar_tersedia,
                SUM(CASE WHEN status_kamar = 'terisi' THEN 1 ELSE 0 END) as kamar_terisi,
                SUM(CASE WHEN status_kamar = 'maintenance' THEN 1 ELSE 0 END) as kamar_maintenance
            FROM kamar
        `);
        
        res.render('index', { 
            title: 'Dashboard Ngekos.Yuk',
            kamar: kamar,
            stats: stats[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { 
            title: 'Database Error',
            message: 'Gagal mengambil data dari database'
        });
    }
});

// Form tambah kamar
router.get('/kamar/tambah', (req, res) => {
    res.render('create', { 
        title: 'Tambah Kamar Baru',
        errors: null,
        oldInput: {}
    });
});

// Proses tambah kamar
router.post('/kamar/tambah', 
    [
        body('jenis_kamar').notEmpty().withMessage('Jenis kamar wajib diisi'),
        body('harga').isFloat({ min: 0 }).withMessage('Harga harus angka positif'),
        body('status_kamar').isIn(['tersedia', 'terisi', 'maintenance']).withMessage('Status tidak valid')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.render('create', {
                title: 'Tambah Kamar Baru',
                errors: errors.array(),
                oldInput: req.body
            });
        }
        
        try {
            const { jenis_kamar, deskripsi, status_kamar, harga } = req.body;
            
            await db.query(
                'INSERT INTO kamar (jenis_kamar, deskripsi, status_kamar, harga) VALUES (?, ?, ?, ?)',
                [jenis_kamar, deskripsi, status_kamar, harga]
            );
            
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { 
                title: 'Database Error',
                message: 'Gagal menambah data kamar'
            });
        }
    }
);

// Form edit kamar
router.get('/kamar/edit/:id', async (req, res) => {
    try {
        const [kamar] = await db.query('SELECT * FROM kamar WHERE id_kamar = ?', [req.params.id]);
        
        if (kamar.length === 0) {
            return res.redirect('/');
        }
        
        res.render('edit', {
            title: 'Edit Data Kamar',
            kamar: kamar[0],
            errors: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { 
            title: 'Database Error',
            message: 'Gagal mengambil data kamar'
        });
    }
});

// Proses edit kamar
router.post('/kamar/edit/:id', 
    [
        body('jenis_kamar').notEmpty().withMessage('Jenis kamar wajib diisi'),
        body('harga').isFloat({ min: 0 }).withMessage('Harga harus angka positif'),
        body('status_kamar').isIn(['tersedia', 'terisi', 'maintenance']).withMessage('Status tidak valid')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            try {
                const [kamar] = await db.query('SELECT * FROM kamar WHERE id_kamar = ?', [req.params.id]);
                return res.render('edit', {
                    title: 'Edit Data Kamar',
                    kamar: kamar[0],
                    errors: errors.array()
                });
            } catch (error) {
                console.error(error);
                return res.redirect('/');
            }
        }
        
        try {
            const { jenis_kamar, deskripsi, status_kamar, harga } = req.body;
            
            await db.query(
                'UPDATE kamar SET jenis_kamar = ?, deskripsi = ?, status_kamar = ?, harga = ? WHERE id_kamar = ?',
                [jenis_kamar, deskripsi, status_kamar, harga, req.params.id]
            );
            
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { 
                title: 'Database Error',
                message: 'Gagal mengupdate data kamar'
            });
        }
    }
);

// Hapus kamar
router.post('/kamar/hapus/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM kamar WHERE id_kamar = ?', [req.params.id]);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { 
            title: 'Database Error',
            message: 'Gagal menghapus data kamar'
        });
    }
});

// Halaman daftar kamar
router.get('/kamar', async (req, res) => {
    try {
        const [kamar] = await db.query(`
            SELECT k.*, p.nama_penyewa 
            FROM kamar k 
            LEFT JOIN penyewa p ON k.id_penyewa = p.id_penyewa 
            ORDER BY k.jenis_kamar
        `);
        
        res.render('kamar', {
            title: 'Daftar Kamar',
            kamar: kamar
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { 
            title: 'Database Error',
            message: 'Gagal mengambil data kamar'
        });
    }
});

module.exports = router;