// config/dbConnection.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mycontacts-backend',
  password: 'Roshik9841@!',
  port: 5432,
});

module.exports = pool;
