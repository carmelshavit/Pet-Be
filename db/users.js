const { getConnection } = require("../db/db");
const userPath = "db/user.json";
const bcrypt = require("bcrypt");
const fs = require("fs");
// const SQL = require("@nearform/sql");
const { error } = require("console");

const getUser = async (email, password) => {
  try {
    // const query = getNotesQuery();
    // const [queryResult] = await pool.query(query);
    // return queryResult;
    const fileText = await fs.promises.readFile(userPath, "utf8");
    let jsonData = JSON.parse(fileText);

    const user = jsonData.find((user) => {
      return user.email === email;
    });
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (!match) return Promise.reject("Invalid username or password");
    return user;
  } catch (err) {
    console.log("Error from server:", err.message);
    throw err;
  }
};

const addUser = async (user) => {
  console.log(user);
  const { password, email } = user;
  try {
    const connection = await getConnection();
    const password_hash = await bcrypt.hash(password, 10);
    user.password = password_hash;
    const [existingUser] = await connection.query(
      "SELECT * FROM petsdb.users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      throw new Error("User with this email already exists.");
    }
    const [queryResult] = await connection.query(
      "INSERT INTO petsdb.users SET ?",
      user
    );

    console.log("User added successfully to the database!");
    return queryResult;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  addUser,
  getUser,
};
