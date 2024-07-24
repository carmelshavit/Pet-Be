const bcrypt = require("bcrypt");

const findEmailUser = (email) => {
  return {
    sql: `SELECT * FROM petsdb.users WHERE email = ?`,
    values: [email],
  };
};

const getUserByIdQuery = (userId) => {
  return {
    sql: `SELECT * FROM petsdb.users WHERE id = ?`,
    values: [userId],
  };
};

const getUsersQuery = (filters) => {
  try {
    let query = "SELECT * from petsdb.users";
    const conditions = [];

    const filterFields = ["email", "first_name", "last_name", "phone_number"];

    filterFields.forEach((fieldName) => {
      const value = filters[fieldName];
      if (value !== undefined && value !== "") {
        conditions.push(`${fieldName} = ?`);
      }
    });

    if (conditions.length > 0) {
      query = query + " WHERE " + conditions.join(" AND ");
    }

    return {
      sql: query,
      values: Object.values(filters).filter((value) => value !== ""),
    };
  } catch (err) {
    throw err;
  }
};

const addUserQuery = () => {
  return {
    sql: `INSERT INTO petsdb.users SET ?`,
    values: [],
  };
};

const addPetQuery = () => {
  return {
    sql: `INSERT INTO petsdb.pets SET ?`,
    values: [],
  };
};

const getPetsByAndQuery = (filters) => {
  let query = "SELECT * from petsdb.pets";
  let values = []; // Initialize values array
  if (!filters) {
    return {
      sql: query,
      values: [],
    };
  }
  let conditions = [];

  const filterFields = [
    "breed",
    "id",
    "name",
    "type",
    "dietary_restriction",
    "color",
    "imgFile",
  ];

  filterFields.forEach((fieldName) => {
    const value = filters[fieldName];
    if (value !== undefined && value !== "") {
      conditions.push(`${fieldName} = ?`);
      values.push(value); // Push value to values array
    }
  });

  if (filters.hypoallergenic) {
    const hypoallergenicValue = filters.hypoallergenic === "true" ? 1 : 0;
    conditions.push(`hypoallergenic=?`);
    values.push(hypoallergenicValue); // Push converted value to values array
  }

  if (filters.minHeight) {
    conditions.push(`height >= ?`);
    values.push(filters.minHeight); // Push minHeight value to values array
  }
  if (filters.maxHeight) {
    conditions.push(`height <= ?`);
    values.push(filters.maxHeight); // Push maxHeight value to values array
  }
  if (filters.minWeight) {
    conditions.push(`weight >= ?`);
    values.push(filters.minWeight); // Push minWeight value to values array
  }
  if (filters.maxWeight) {
    conditions.push(`weight <= ?`);
    values.push(filters.maxWeight); // Push maxWeight value to values array
  }

  if (conditions.length > 0) {
    query = query + " WHERE " + conditions.join(" AND ");
  }

  if (filters.perPage && filters.pageNum) {
    const offset = (filters.pageNum - 1) * filters.perPage;
    query = query + ` LIMIT ${filters.perPage} OFFSET ${offset}`;
  }

  console.log({ values });
  return {
    sql: query,
    values: values, // Return the values array
  };
};

const getPasswordUserQuery = (userId) => {
  return {
    sql: `SELECT password FROM petsdb.users WHERE id = ?`,
    values: [userId],
  };
};

const editUserQuery = (editedUser) => {
  const setClauses = [];
  const setFieldNames = [];

  if (editedUser.new_password) {
    setClauses.push(`password = ?`);
    setFieldNames.push(editedUser.new_password);
  }
  if (editedUser.email) {
    setClauses.push(`email = ?`);
    setFieldNames.push(editedUser.email);
  }
  if (editedUser.first_name) {
    setClauses.push(`first_name = ?`);
    setFieldNames.push(editedUser.first_name);
  }
  if (editedUser.last_name) {
    setClauses.push(`last_name = ?`);
    setFieldNames.push(editedUser.last_name);
  }
  if (editedUser.phone_number) {
    setClauses.push(`phone_number = ?`);
    setFieldNames.push(editedUser.phone_number);
  }
  if (setClauses.length !== 0 && editedUser.id) {
    const setClause = setClauses.join(", ");
    return {
      sql: `UPDATE users SET ${setClause} WHERE id = ?`,
      values: [...setFieldNames, editedUser.id],
    };
  } else {
    throw "Validation error: Set clauses or user ID is missing.";
  }
};

const editPetQuery = (petId, editedPet) => {
  const setClauses = [];
  const setFieldNames = [];

  if (editedPet.name) {
    setClauses.push(`name = ?`);
    setFieldNames.push(editedPet.name);
  }
  if (editedPet.adoption_status) {
    setClauses.push(`adoption_status = ?`);
    setFieldNames.push(editedPet.adoption_status);
  }
  if (editedPet.type) {
    setClauses.push(`type = ?`);
    setFieldNames.push(editedPet.type);
  }
  if (editedPet.height) {
    setClauses.push(`height = ?`);
    setFieldNames.push(editedPet.height);
  }
  if (editedPet.weight) {
    setClauses.push(`weight = ?`);
    setFieldNames.push(editedPet.weight);
  }
  if (editedPet.color) {
    setClauses.push(`color = ?`);
    setFieldNames.push(editedPet.color);
  }
  if (editedPet.bio) {
    setClauses.push(`bio = ?`);
    setFieldNames.push(editedPet.bio);
  }
  if (editedPet.hypoallergenic !== undefined) {
    setClauses.push(`hypoallergenic = ?`);
    setFieldNames.push(editedPet.hypoallergenic);
  }
  if (editedPet.dietary_restrictions) {
    setClauses.push(`dietary_restrictions = ?`);
    setFieldNames.push(editedPet.dietary_restrictions);
  }
  if (editedPet.breed) {
    setClauses.push(`breed = ?`);
    setFieldNames.push(editedPet.breed);
  }
  if (editedPet.imgFile) {
    setClauses.push(`imgFile = ?`);
    setFieldNames.push(editedPet.imgFile);
  }
  if (setClauses.length !== 0 && petId) {
    const setClause = setClauses.join(", ");
    return {
      sql: `UPDATE pets SET ${setClause} WHERE id = ?`,
      values: [...setFieldNames, petId],
    };
  } else {
    return "Validation error: Set clauses or pet ID is missing.";
  }
};

const addLikeQuery = (userId, petId) => {
  return {
    sql: `INSERT INTO petsdb.pet_status (userId, petId) VALUES(?, ?)`,
    values: [userId, petId],
  };
};

const getLikedPetsQuery = (likedPetIds) => {
  return {
    sql: `SELECT * FROM petsdb.pets WHERE id IN (?)`,
    values: [likedPetIds],
  };
};

const getLikesQuery = (userId, petId) => {
  return {
    sql: `SELECT * FROM petsdb.pet_status WHERE user_id = ? AND pet_id = ?`,
    values: [userId, petId],
  };
};

const returnPetQuery = (petId, userId) => {
  return {
    sql: `UPDATE petsdb.pets SET adoptedBy=NULL WHERE id = ? AND adoptedBy = ?`,
    values: [petId, userId],
  };
};

const adoptPetQuery = (petId, userId) => {
  return {
    sql: "UPDATE petsdb.pets SET adoptedBy = ? WHERE id = ?",
    values: [userId, petId],
  };
};

const removeLikeQuery = (userId, petId) => {
  return {
    sql: "DELETE FROM petsdb.pet_status WHERE userId = ? AND petId = ?",
    values: [userId, petId],
  };
};

// sortBy the pets that user did like:(`
//     SELECT * FROM users
//     ORDER BY id DESC
// `)

module.exports = {
  findEmailUser,
  addUserQuery,
  addPetQuery,
  editPetQuery,
  getUserByIdQuery,
  getUsersQuery,
  editUserQuery,
  getPetsByAndQuery,
  addLikeQuery,
  getLikesQuery,
  removeLikeQuery,
  returnPetQuery,
  adoptPetQuery,
  getLikedPetsQuery,
  getPasswordUserQuery,
};
