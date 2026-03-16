import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server running' });
});

// GET /api/db-test
router.get('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as result');
    res.status(200).json({ 
      database: 'connected',
      queryResult: rows[0].result
    });
  } catch (err) {
    res.status(500).json({ 
      database: 'disconnected',
      error: err.message 
    });
  }
});

export default router;
