const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM productos');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { nombre, precio } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nombre', nombre)
      .input('precio', precio)
      .query('INSERT INTO productos (nombre, precio) VALUES (@nombre, @precio)');
    res.json({ message: 'Producto creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
