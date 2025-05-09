const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'migueldom',
  server: 'localhost',
  database: 'BD_',
  options: {
    trustServerCertificate: true,
  },
};

const poolPromise = sql.connect(config).then(pool => {
  console.log('✅ Conectado a SQL Server');
  return pool;
}).catch(err => {
  console.error('❌ Error al conectar a SQL Server:', err);
});

module.exports = { sql, poolPromise };
