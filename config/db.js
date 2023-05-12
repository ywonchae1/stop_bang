const mysql = require('mysql2/promise');
require("dotenv").config();

/*
const db = mysql.createConnection({
  host:process.env.DB_HOST,
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_DATABASE
});
*/

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
  insecureAuth: true,
});

//db.connect();
console.log('Connected to MySQL server!');





module.exports = db;