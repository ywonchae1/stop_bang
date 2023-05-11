

//DB접속설정
require('dotenv').config();
const mysql2 = require('mysql2/promise');

const db = mysql2.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PW,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	waitForConnections: true,
	insecureAuth: true
});

module.exports = db;
