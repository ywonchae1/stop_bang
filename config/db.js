const mysql = require('mysql');


const db = mysql.createConnection({
  host:process.env.DB_HOST,
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_DATABASE
});

db.connect();
console.log('Connected to MySQL server!');





module.exports = db;