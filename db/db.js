/** @format */

const mysql = require('mysql2/promise');

const getConnection = async () => {
	const connection = mysql.createConnection({
		host: process.env.SQL_HOST,
		user: process.env.SQL_USER,
		password: process.env.SQL_PASSWORD,
		database: process.env.SQL_DATABASE,
		port: process.env.SQL_PORT,
	});
	return connection;
};

module.exports = {
	getConnection,
};
