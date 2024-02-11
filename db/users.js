const { getConnection } = require("../db/db");
const bcrypt = require("bcrypt");
const {
  findEmailUser,
  addUserQuery,
  getUserByIdQuery,
  getUsersQuery
} = require("../db/queries");
// const SQL = require("@nearform/sql");
const getUsers = async () => {
  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(getUsersQuery());
    return queryResult;
  } catch (err) {
    console.log("Error from server:", err.message);
    throw err;
  }
};
const addUser = async (user) => {
  const { password, email } = user;
  try {
    const connection = await getConnection();
    const password_hash = await bcrypt.hash(password, 10);
    user.password = password_hash;
    const [existingUser] = await connection.query(findEmailUser(email));

    if (existingUser.length > 0) {
      throw new Error("User with this email already exists.");
    }
    const [queryResult] = await connection.query(addUserQuery(), [user]);
    console.log("User added successfully to the database!");
    return queryResult;
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(findEmailUser(email));

    if (rows.length === 0) {
      return null;
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    } else {
      return user;
    }
  } catch (err) {
    console.log("Error from server:", err.message);
    throw err;
  }
};

const getUserById = async (userId) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(getUserByIdQuery(userId));
    if (rows.length === 0) {
      return null;
    } else {
      const user = rows[0];
      return user;
    }
    // Process the user data or return it as needed
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching user by ID:", error);
  }
};
module.exports = {
  addUser,
  login,
  getUserById,
  getUsers
  // edituser
};
