const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err);
});

module.exports = pool.promise();