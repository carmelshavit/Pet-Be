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

const formatSqlQueryValue = (value) => {
  switch (value) {
    case "false":
      return 0;
    case "true":
      return 1;
    default:
      return value;
  }
};

const getPetsByAndQuery = (filters) => {
  let query = "SELECT * from petsdb.pets";
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
    "hypoallergenic",
    "dietary_restriction",
    "color",
    "imgFile",
  ];

  filterFields.forEach((fieldName) => {
    const value = filters[fieldName];
    if (value !== undefined && value !== "") {
      conditions.push(`${fieldName} = ?`);
    }
    if (filters.minHeight) {
      conditions.push(`height >= ?`);
    }
    if (filters.maxHeight) {
      conditions.push(`height <= ?`);
    }
    if (filters.minWeight) {
      conditions.push(`height >= ?`);
    }
    if (filters.maxWeight) {
      conditions.push(`height <= ?`);
    }
  });

  if (conditions.length > 0) {
    query = query + " WHERE " + conditions.join(" AND ");
  }

  return {
    sql: query,
    values: Object.values(filters).filter((value) => value !== ""),
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
  if (editedUser.new_password) {
    setClauses.push(`password = ?`);
  }
  if (editedUser.email) {
    setClauses.push(`email = ?`);
  }
  if (editedUser.first_name) {
    setClauses.push(`first_name = ?`);
  }
  if (editedUser.last_name) {
    setClauses.push(`last_name = ?`);
  }
  if (editedUser.phone_number) {
    setClauses.push(`phone_number = ?`);
  }
  if (setClauses.length !== 0 && editedUser.id) {
    const setClause = setClauses.join(", ");
    return {
      sql: `UPDATE users SET ${setClause} WHERE id = ?`,
      values: [
        ...Object.values(editedUser).filter((value) => value !== ""),
        editedUser.id,
      ],
    };
  } else {
    throw "Validation error: Set clauses or user ID is missing.";
  }
};

const editPetQuery = (petId, editedPet) => {
  const setClauses = [];
  if (editedPet.name) {
    setClauses.push(`name = ?`);
  }
  if (editedPet.adoption_status) {
    setClauses.push(`adoption_status = ?`);
  }
  if (editedPet.type) {
    setClauses.push(`type = ?`);
  }
  if (editedPet.height) {
    setClauses.push(`height = ?`);
  }
  if (editedPet.weight) {
    setClauses.push(`weight = ?`);
  }
  if (editedPet.color) {
    setClauses.push(`color = ?`);
  }
  if (editedPet.bio) {
    setClauses.push(`bio = ?`);
  }
  if (editedPet.hypoallergenic !== undefined) {
    setClauses.push(`hypoallergenic = ?`);
  }
  if (editedPet.dietary_restrictions) {
    setClauses.push(`dietary_restrictions = ?`);
  }
  if (editedPet.breed) {
    setClauses.push(`breed = ?`);
  }
  if (editedPet.imgFile) {
    setClauses.push(`imgFile = ?`);
  }
  if (setClauses.length !== 0 && petId) {
    const setClause = setClauses.join(", ");
    return {
      sql: `UPDATE pets SET ${setClause} WHERE id = ?`,
      values: [
        ...Object.values(editedPet).filter((value) => value !== ""),
        petId,
      ],
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
