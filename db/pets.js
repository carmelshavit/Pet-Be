const { response } = require("express");
const { getConnection } = require("../db/db");
const {
  addPetQuery,
  getPetsQuery,
  getPetByIdQuery,
  getPetsByAndQuery,
  editPetQuery,
} = require("../db/queries");

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

// const getPetById = async (petId) => {
//   console.log("line 26", petId);
//   try {
//     const connection = await getConnection();
//     const [rows] = await connection.query(getPetByIdQuery(petId));

//     if (rows.length === 0) {
//       return null;
//     }
//     const pet = jsonData.find((pet) => {
//       console.log("Checking pet:", pet);
//       return pet.id === petId;
//     });
//     console.log("Final pet:", pet);
//   } catch (err) {
//     console.log("Error from server:", err.message);
//     throw err;
//   }
// };
const getPetById = async (petId) => {
  console.log("line 26", petId);
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(getPetByIdQuery(), [petId]);

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
  console.log("line 26", editedPet);
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(editPetQuery(petId, editedPet));
    console.log("line 76", rows);
    if (rows.length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log("Error from server:", err.message);
    throw err;
  }
};

module.exports = { addPet, getPetById, getPets, editPet };
