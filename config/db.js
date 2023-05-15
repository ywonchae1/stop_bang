const mysql = require('mysql2/promise');
require("dotenv").config();


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
  insecureAuth: true,
});

console.log('Connected to MySQL server!');





module.exports = db;