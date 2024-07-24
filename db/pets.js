const { response } = require("express");
const { pool } = require("../db/db");
const {
  addPetQuery,
  getPetsByAndQuery,
  editPetQuery,
  addLikeQuery,
  removeLikeQuery,
  returnPetQuery,
  getLikedPetsQuery,
  getLikesQuery,
  adoptPetQuery,
} = require("../db/queries");

const getLikedPets = async (likedPetIds) => {
  console.log("line 15", likedPetIds);
  const [queryResult] = await pool.query(getLikedPetsQuery(likedPetIds));
  return queryResult;
};
const getPets = async (filters) => {
  const [queryResult] = await pool.query(getPetsByAndQuery(filters));
  return queryResult;
};

const addPet = async (pet) => {
  const [queryResult] = await pool.query(addPetQuery(), [pet]);
  return queryResult;
};

const getLike = async () => {
  // //console.log(userId, petId);
  const [queryResult] = await pool.query(getLikesQuery(userId));
  return queryResult;
};

const addLike = async (userId, petId) => {
  //console.log(userId, petId);
  const [queryResult] = await pool.query(addLikeQuery(userId, petId));
  return queryResult;
};

const removeLike = async (userId, petId) => {
  //console.log(petId);
  const [queryResult] = await pool.query(removeLikeQuery(userId, petId));
  // connection.release();
  return queryResult;
};

const getPetById = async (id) => {
  //console.log("line 26", id);
  const [rows] = await pool.query(getPetsByAndQuery({ id }));

  if (rows.length === 0) {
    return null;
  }

  const pet = rows[0]; // Assuming you only expect one result

  //console.log("Final pet:", pet);
  return pet;
};

const editPet = async (petId, editedPet) => {
  //console.log("Edited Pet:", editedPet);
  const sqlQuery = editPetQuery(petId, editedPet);
  const [rows] = await pool.query(sqlQuery);
  if (rows.affectedRows === 0) {
    return false;
  } else {
    return true;
  }
};
const returnPet = async (petId, userId) => {
  //console.log("returnPet:", petId);
  const [rows] = await pool.query(returnPetQuery(petId, userId));
  //console.log("Rows:", rows);
  if (rows.affectedRows === 0) {
    return false;
  } else {
    return true;
  }
};
const adoptPet = async (petId, userId) => {
  console.log("Pet ID:", petId);
  console.log("Pet ID:", userId);
  const [result] = await pool.query(adoptPetQuery(petId, userId));
  if (result.affectedRows === 0) {
    return null;
  }
  const [rows] = await pool.query("SELECT * FROM petsdb.pets WHERE id = ?", [
    petId,
  ]);
  console.log("line 90", rows[0]);

  return rows[0];
};

module.exports = {
  adoptPet,
  getLike,
  addLike,
  addPet,
  getPetById,
  getPets,
  editPet,
  removeLike,
  returnPet,
  getLikedPets,
};
