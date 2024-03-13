const mysql = require("mysql2/promise");
const SQL_HOST = "localhost";
const SQL_USER = "root";
const SQL_PASSWORD = "root";
const SQL_DATABASE = "petsdb";
const SQL_PORT = 3306;

const pool = mysql.createPool({
  host: SQL_HOST,
  user: SQL_USER,
  password: SQL_PASSWORD,
  database: SQL_DATABASE,
  port: SQL_PORT,
});

const getConnection = async () => {
  const connection = await pool.getConnection();
  console.log("Database connected");
  return connection;
};

module.exports = {
  pool,
  getConnection,
  //  migrate
};
