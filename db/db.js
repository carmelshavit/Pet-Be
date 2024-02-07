const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "petsdb",
  port: 3306,
});

const getConnection = async () => {
  const connection = await pool.getConnection();
  console.log("Database connected");
  return connection;
};

module.exports = { pool, getConnection };
