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
		host: 'mysql-de37a9-carmel-784c.h.aivencloud.com',
		user: 'avnadmin',
		password: 'AVNS_Kq_FL87wcVCZw42bSLA',
		database: 'defaultdb',
		port: 10147,
	});
	//console.log("Database connected");
	return connection;
};
// const { Sequelize } = require('sequelize');

// let sequelize;

// if (process.env.DB_URL) {
// 	sequelize = new Sequelize(
// 		'postgresql://dpg-cr3hrj3v2p9s73dtfndg-a/petsdb_kq7t'
// 	);
// } else {
// 	sequelize = new Sequelize(
// 		'petsdb_kq7t',
// 		'petsdb_kq7t_user',
// 		'nXSL35X9ny5RO9FaEM9yiPBMsv7IwQG9',
// 		{
// 			host: 'localhost',
// 			dialect: 'postgres',
// 		}
// 	);
// }

module.exports = {
	// pool,
	getConnection,
	// sequelize,
	//  migrate
};
