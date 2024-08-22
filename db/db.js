/** @format */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
	host: process.env.SQL_HOST,
	user: process.env.SQL_USER,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
	port: process.env.SQL_PORT,
});

const getConnection = async () => {
	const connection = await pool.getConnection();
	//console.log("Database connected");
	return connection;
};

module.exports = {
	pool,
	getConnection,
	//  migrate
};
