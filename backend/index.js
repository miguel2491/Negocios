const express = require('express');
const cors = require('cors');
const productosRouter = require('./routes/productos');
const ventasRouter = require('./routes/ventas');
console.log(__dirname)
const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRouter);
app.use('/api/ventas', ventasRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
