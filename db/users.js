const { pool } = require("../db/db");
const bcrypt = require("bcrypt");
const {
  findEmailUser,
  addUserQuery,
  getUserByIdQuery,
  getUsersQuery,
  editUserQuery,
  getPasswordUserQuery,
} = require("../db/queries");
// const SQL = require("@nearform/sql");
const getUsers = async (filters) => {
  //console.log(filters);

  const [rows] = await pool.query(getUsersQuery(filters));
  console.log("line 16", rows);
  return rows;
};

const addUser = async (user) => {
  const { password, email } = user;
  const password_hash = await bcrypt.hash(password, 10);
  user.password = password_hash;
  const [existingUser] = await pool.query(findEmailUser(email));

  if (existingUser.length > 0) {
    throw new Error("User with this email already exists.");
  }

  const [queryResult] = await pool.query(addUserQuery(), [user]);
  return !queryResult.affectedRows ? false : user;
};

const login = async (email, password) => {
  const [rows] = await pool.query(findEmailUser(email));
  console.log(rows);
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
};

const getUserById = async (userId) => {
  {
    const [rows] = await pool.query(getUserByIdQuery(userId));
    if (rows.length === 0) {
      return null;
    } else {
      const user = rows[0];
      user.likedPetIds = await getLikesArr(userId);
      user.adoptedPets = await getUserPetsArr(userId);
      console.log(user);
      return user;
    }
  }
};

const getUserPetsArr = async (userId) => {
  const [petRows] = await pool.query(
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
  const [petRows] = await pool.query(
    `SELECT petId FROM pet_status WHERE userId = ?`,
    [userId]
  );
  return petRows.map((petRow) => petRow.petId);
};

const checkUserPassword = async (userId, userPassword) => {
  // Check if the current password is provided and matches the stored password
  if (!userId || !userPassword) {
    return false;
  }

  const [rows] = await pool.query(getPasswordUserQuery(userId));
  console.log([rows]);
  // TODO get stored password of user (from rows)
  const storedPasswordHash = rows[0].password;

  const isPasswordMatch = await bcrypt.compare(
    userPassword,
    storedPasswordHash
  );

  return isPasswordMatch;
};

const editUser = async (editedUser) => {
  if (editedUser.new_password) {
    const newPasswordHash = await bcrypt.hash(editedUser.new_password, 10);
    editedUser.password = newPasswordHash;
  }
  const [rows] = await pool.query(editUserQuery(editedUser)); // Pass userId to editUserQuery
  return rows.affectedRows !== 0;
};

module.exports = {
  addUser,
  login,
  getUserById,
  getUsers,
  editUser,
  getUserPetsArr,
  checkUserPassword,
};
