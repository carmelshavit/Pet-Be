const { response } = require("express");
const { getConnection } = require("../db/db");
const {
  addPetQuery,
  getPetsByAndQuery,
  editPetQuery,
  addLikeQuery,
  getLikeQuery,
  removeLikeQuery,
} = require("../db/queries");

// const getPets = async (filters) => {
//   try {
//     const connection = await getConnection();
//     const [queryResult] = await connection.query(getPetsByAndQuery(filters));
//     return queryResult;
//   } catch (err) {
//     console.log("Error from server:", err.message);
//     throw err;
//   }
// };
const getPets = async (filters) => {
  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(getPetsByAndQuery(filters));
    return queryResult;
  } catch (err) {
    console.log("Error from server:", err.message);
    throw err;
  }
};

const addPet = async (pet) => {
  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(addPetQuery(), [pet]);
    connection.release();
    return queryResult;
  } catch (error) {
    throw error;
  }
};

const getLike = async () => {
  // console.log(userId, petId);
  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(
      `SELECT * FROM petsdb.pet_status WHERE user_id = "${userId}" AND pet_id = "${petId}"`
    );
    connection.release();
    return queryResult;
  } catch (error) {
    throw error;
  }
};

const addLike = async (userId, petId) => {
  console.log(userId, petId);
  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(addLikeQuery(userId, petId));
    connection.release();
    return queryResult;
  } catch (error) {
    throw error;
  }
};

const removeLike = async (userId, petId) => {
  console.log(petId);
  try {
    const connection = await getConnection();
    const [queryResult] = await connection.query(
      removeLikeQuery(userId, petId)
    );
    // connection.release();
    return queryResult;
  } catch (error) {
    throw error;
  }
};

const getPetById = async (id) => {
  console.log("line 26", id);
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(getPetsByAndQuery({ id }));

    if (rows.length === 0) {
      return null;
    }

    const pet = rows[0]; // Assuming you only expect one result

    console.log("Final pet:", pet);
    return pet;
  } catch (err) {
    console.log("Error from server:", err.message);
    throw err;
  }
};

const editPet = async (petId, editedPet) => {
  console.log("Edited Pet:", editedPet);
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(editPetQuery(petId, editedPet)); // Pass petId to editPetQuery
    console.log("Rows:", rows);
    if (rows.affectedRows === 0) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log("Error from server:", err.message);
    throw err;
  }
};

module.exports = {
  getLike,
  addLike,
  addPet,
  getPetById,
  getPets,
  editPet,
  removeLike,
};
