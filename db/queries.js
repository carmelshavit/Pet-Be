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

const getAllPetTypes = () => {
  return "SELECT DISTINCT type FROM petsdb.pets";
};
const getPetByIdQuery = (petId) => {
  return `SELECT * FROM petsdb.pets WHERE id = '${petId}'`;
};
const getPetsByBreedTypeQuery = (petBreed, petType) => {
  return `SELECT * FROM petsdb.pets WHERE pet.breed = '${petBreed}' AND pet.type = '${petType}'`;
};

const formatSqlQueryValue = (value) => {
  if (value === null) {
    return `NULL`;
  }
  switch (typeof value) {
    case "string":
      return `"${value}"`;
    case "boolean":
      return `${value}`;
    case "undefined":
      return `NULL`;
    default:
      return `${value}`;
  }
};
const getPetsByAndQuery = (filters) => {
  let query = "SELECT * from petsdb.pets";
  if (!filters) {
    return query;
  }
  let conditions = [];

  const filterFields = [
    "breed",
    "id",
    "type",
    "height",
    "weight",
    "hypoallergenic",
    "dietary_restriction",
  ];

  filterFields.forEach((fieldName) => {
    const value = filters[fieldName];
    if (value !== null && value !== undefined && value !== "") {
      if (typeof value === "object" && value.length > 0) {
        const sqlArr = value
          .map((item) => {
            return formatSqlQueryValue(item);
          })
          .join(",");
        conditions.push(`${fieldName} IN (${sqlArr})`);
      } else {
        conditions.push(`${fieldName} = ${formatSqlQueryValue(value)}`);
      }
    }
  });

  if (conditions.length > 0) {
    query = query + " WHERE " + conditions.join(" AND ");
  }
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


const editPetQuery = (petId, editedPet) => `
  UPDATE pets SET 
    name = '${editedPet.name}',
    adoption_status = '${editedPet.adoption_status}',
    type = '${editedPet.type}',
    height = ${editedPet.height},
    weight = ${editedPet.weight},
    color = '${editedPet.color}',
    bio = '${editedPet.bio}',
    hypoallergenic = ${editedPet.hypoallergenic},
    dietary_restrictions = '${editedPet.dietary_restrictions}',
    breed = '${editedPet.breed}',
    imgFile = '${editedPet.imgFile}'
  WHERE id = ${petId};
`;

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
};
