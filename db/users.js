const { getConnection } = require("../db/db");
const bcrypt = require("bcrypt");
const {
  findEmailUser,
  addUserQuery,
  getUserByIdQuery,
  getUsersQuery,
  editUserQuery,
  getLikeQuery,
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
    user.likedPetIds = [];

    const [queryResult] = await connection.query(addUserQuery(), [user]);
    console.log("User added successfully to the database!");
    return !queryResult.affectedRows ? false : user;
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
    await getUserLikes("19c8094-d701-11ee-a52b-b05cda40fd65");
    const [rows] = await connection.query(getUserByIdQuery(userId));
    if (rows.length === 0) {
      return null;
    } else {
      const user = rows[0];
      return user;
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
  }
};
async function getUserLikes(userId) {
  console.log("yaron");
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(getLikeQuery(userId));
    if (rows.length === 0) {
      return [];
    } else {
      const userLikes = rows.map((row) => row.like);
      console.log("line 90", userLikes);
    }
  } catch (error) {
    console.error("Error fetching user likes:", error);
    throw error;
  }
}

const editUser = async (editedUser) => {
  console.log("line 80", editedUser);
  // console.log("line 81", userId);
  try {
    const connection = await getConnection();
    if (editedUser.password) {
      const password_hash = await bcrypt.hash(editedUser.password, 10);
      editedUser.password = password_hash;
    }
    const [rows] = await connection.query(editUserQuery(editedUser));
    return rows.affectedRows !== 0;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

module.exports = {
  addUser,
  login,
  getUserById,
  getUsers,
  editUser,
};
