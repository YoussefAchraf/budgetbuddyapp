const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10, 
  host: process.env.HOST,
  user: process.env.USRNM,
  password: process.env.DBPWD,
  database: process.env.DBNM
});
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database as id', connection.threadId);
  connection.release();
});
module.exports = pool;
