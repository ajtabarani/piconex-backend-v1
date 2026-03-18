import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: '178.156.189.138',
  user: 'piconex',
  password: 'pjaplmTabs7!',
  database: 'piconexdb_v1',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});