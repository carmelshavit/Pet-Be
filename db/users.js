const { getConnection } = require("../db/db");
const bcrypt = require("bcrypt");
const {
  findEmailUser,
  addUserQuery,
  getUserByIdQuery,
  getUsersQuery,
  editUserQuery,
} = require("../db/queries");
// const SQL = require("@nearform/sql");
const getUsers = async (filters) => {
  //console.log(filters);
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(getUsersQuery(filters));
    console.log("line 16", rows);
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
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
    //console.log("User added successfully to the database!");
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
      user.likedPetIds = await getLikesArr(user.id);
      //console.log("58", user);
      return user;
    }
  } catch (err) {
    //console.log("Error from server:", err.message);
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
      user.likedPetIds = await getLikesArr(userId);
      user.adoptedPets = await getUserPetsArr(userId);
      console.log(user);
      return user;
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
  }
};

const getUserPetsArr = async (userId) => {
  const connection = await getConnection();
  const [petRows] = await connection.query(
    `
    SELECT *
    FROM petsdb.pets
    WHERE adoptedBy = ?
  `,
    [userId]
  );

  return petRows;
};

const getLikesArr = async (userId) => {
  const connection = await getConnection();

  const [petRows] = await connection.query(
    `SELECT petId FROM pet_status WHERE userId = ?`,
    [userId]
  );
  return petRows.map((petRow) => petRow.petId);
};

const editUser = async (editedUser) => {
  //console.log("line 80", editedUser);
  // //console.log("line 81", userId);
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
  getUserPetsArr
};
