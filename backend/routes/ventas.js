const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM ventas');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { total, fecha } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('total', total)
      .input('fecha', fecha)
      .query('INSERT INTO ventas (total, fecha) VALUES (@total, @fecha)');
    res.json({ message: 'Venta registrada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
