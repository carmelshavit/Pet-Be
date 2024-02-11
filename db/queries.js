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
  return `SELECT * FROM petsdb.pets WHERE pet.id = '${petId}'`;
};
// const editPetQuery = (petId,newPetObject) => {

//     return `UPDATE petsdb.pets SET
//               name = '${newPetObject.name}',
//               age = ${newPetObject.age},
//               breed = '${newPetObject.breed}'
//             WHERE id = '${petId}'`;

// };

module.exports = {
  findEmailUser,
  addUserQuery,
  addPetQuery,
  getPetsQuery,
  getPetByIdQuery,
  getUserByIdQuery,
  getUsersQuery,
  editPetQuery,
};
