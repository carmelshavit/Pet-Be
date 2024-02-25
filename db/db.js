const mysql = require("mysql2/promise");
const path = require("path");
// const sqlMigrate = require("sql-migrations");
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
// const postgrator = new Postgrator({
//   migrationDirectory: path.resolve(__dirname, "../migrations"),
//   host: SQL_HOST,
//   user: SQL_USER,
//   password: SQL_PASSWORD,
//   database: SQL_DATABASE,
//   port: SQL_PORT,
//   driver: "mysql",
//   schemaTable: "migrations",
// });

// var configuration = {
//   migrationsDir: path.resolve(__dirname, "../migrations"), // This is the directory that should contain your SQL migrations.
//   host: SQL_HOST,
//   user: SQL_USER,
//   password: SQL_PASSWORD,
//   port: SQL_PORT,
//   db: SQL_DATABASE,
//   adapter: 'mysql',
// };

// const migrate = function () {
//   // Call migrate() as an async function
//   sqlMigrate.migrate(configuration);
// };
module.exports = {
  pool,
  getConnection,
  //  migrate
};
