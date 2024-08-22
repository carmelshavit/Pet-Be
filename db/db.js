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
	// const connection = await pool.getConnection();
	const connection = mysql.createConnection({
		host: 'postgresql://petsdb_kq7t_user:nXSL35X9ny5RO9FaEM9yiPBMsv7IwQG9@dpg-cr3hrj3v2p9s73dtfndg-a/petsdb_kq7t',
		user: 'petsdb_kq7t_user',
		password: 'nXSL35X9ny5RO9FaEM9yiPBMsv7IwQG9',
		database: 'petsdb_kq7t',
		port: 5432,
	});
	//console.log("Database connected");
	return connection;
};

module.exports = {
	pool,
	getConnection,
	//  migrate
};
