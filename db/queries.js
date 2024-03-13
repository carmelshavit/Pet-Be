const { default: def } = require("ajv/dist/vocabularies/discriminator");
const { query } = require("express");

const findEmailUser = (email) => {
  return `SELECT * FROM petsdb.users WHERE email = '${email}'`;
};
const getUserByIdQuery = (userId) => {
  return `SELECT * FROM petsdb.users WHERE id = '${userId}'`;
};
const getUsersQuery = () => {
  return "SELECT * FROM petsdb.users";
};
const addUserQuery = () => {
  return `INSERT INTO petsdb.users SET ?`;
};
const addPetQuery = () => {
  return `INSERT INTO petsdb.pets SET ?`;
};
const getPetsQuery = () => {
  return "SELECT * FROM petsdb.pets";
};

const getPetByIdQuery = (petId) => {
  return `SELECT * FROM petsdb.pets WHERE id = '${petId}'`;
};

const getPetsByBreedTypeQuery = (petBreed, petType) => {
  return `SELECT * FROM petsdb.pets WHERE pet.breed = '${petBreed}' AND pet.type = '${petType}'`;
};

const formatSqlQueryValue = (value) => {
  switch (value) {
    case "false":
      return 0;
    case "true":
      return 1;
    default:
      return `"${value}"`;
  }
};
const getPetsByAndQuery = (filters) => {
  console.log(filters);
  let query = "SELECT * from petsdb.pets";
  if (!filters) {
    return query;
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
      // if (typeof value === "object" && value.length > 0) {
      //   const sqlArr = value
      //     .map((item) => {
      //       return formatSqlQueryValue(item);
      //     })
      //     .join(",");
      //   conditions.push(`${fieldName} IN (${sqlArr})`);
      // } else {
      conditions.push(`${fieldName} = ${formatSqlQueryValue(value)}`);
    }
    if (filters.minHeight) {
      conditions.push(`height >= ${filters.minHeight}`);
    }

    if (filters.maxHeight) {
      conditions.push(`height <= ${filters.maxHeight}`);
    }
    if (filters.minWeight) {
      conditions.push(`height >= ${filters.minWeight}`);
    }

    if (filters.maxWeight) {
      conditions.push(`height <= ${filters.maxWeight}`);
    }
  });
  if (conditions.length > 0) {
    query = query + " WHERE " + conditions.join(" AND ");
  }
  console.log(query);
  return query;
};

const editUserQuery = (editedUser) => {
  const setClauses = [];
  if (editedUser.password) {
    setClauses.push(`password = '${editedUser.password}'`);
  }
  if (editedUser.email) {
    setClauses.push(`email = '${editedUser.email}'`);
  }
  if (editedUser.first_name) {
    setClauses.push(`first_name = '${editedUser.first_name}'`);
  }
  if (editedUser.last_name) {
    setClauses.push(`last_name = '${editedUser.last_name}'`);
  }
  if (editedUser.phone_number) {
    setClauses.push(`phone_number = '${editedUser.phone_number}'`);
  }
  if (setClauses.length !== 0 && editedUser.userId) {
    const setClause = setClauses.join(", ");
    return `UPDATE users SET ${setClause} WHERE id = '${editedUser.userId}';`;
  } else {
    return "Validation error: Set clauses or user ID is missing.";
  }
};

const editPetQuery = (petId, editedPet) => {
  const setClauses = [];

  if (editedPet.name) {
    setClauses.push(`name = '${editedPet.name}'`);
  }
  if (editedPet.adoption_status) {
    setClauses.push(`adoption_status = '${editedPet.adoption_status}'`);
  }
  if (editedPet.type) {
    setClauses.push(`type = '${editedPet.type}'`);
  }
  if (editedPet.height) {
    setClauses.push(`height = ${editedPet.height}`);
  }
  if (editedPet.weight) {
    setClauses.push(`weight = ${editedPet.weight}`);
  }
  if (editedPet.color) {
    setClauses.push(`color = '${editedPet.color}'`);
  }
  if (editedPet.bio) {
    setClauses.push(`bio = '${editedPet.bio}'`);
  }
  if (editedPet.hypoallergenic !== undefined) {
    setClauses.push(`hypoallergenic = ${editedPet.hypoallergenic}`);
  }
  if (editedPet.dietary_restrictions) {
    setClauses.push(
      `dietary_restrictions = '${editedPet.dietary_restrictions}'`
    );
  }
  if (editedPet.breed) {
    setClauses.push(`breed = '${editedPet.breed}'`);
  }
  if (editedPet.imgFile) {
    setClauses.push(`imgFile = '${editedPet.imgFile}'`);
  }

  if (setClauses.length !== 0 && petId) {
    const setClause = setClauses.join(", ");
    return `UPDATE pets SET ${setClause} WHERE id = ${petId};`;
  } else {
    return "Validation error: Set clauses or pet ID is missing.";
  }
};
const addLikeQuery = (userId, petId) => {
  return `INSERT INTO petsdb.pet_status (userId, petId) VALUES("${userId}", "${petId}")`;
};
const getLikeQuery = (userId, petId) => {
  return `SELECT * FROM petsdb.pet_status WHERE userId = "${userId}" AND petId = "${petId}"`;
};
const removeLikeQuery = (userId, petId) => {
  //correct
  return `DELETE FROM petsdb.pet_status WHERE userId = '${userId}' 
  AND petId = ${petId}`;
  //Not correct
  // return `DELETE FROM petsdb.pet_status (userId, petId) WHERE userId = ${userId}
  // AND petId = ${petId}`;
};

//TODO- ID for like include petId userId.

// sortBy the pets that user did like:(`
//     SELECT * FROM users
//     ORDER BY id DESC
// `)

module.exports = {
  findEmailUser,
  addUserQuery,
  addPetQuery,
  getPetsQuery,
  getPetByIdQuery,
  editPetQuery,
  getUserByIdQuery,
  getUsersQuery,
  editUserQuery,
  getPetsByBreedTypeQuery,
  getPetsByAndQuery,
  addLikeQuery,
  getLikeQuery,
  removeLikeQuery,
};
