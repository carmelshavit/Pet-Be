/** @format */

// /** @format */

// const bcrypt = require('bcrypt');
// const { User, Pet, PetStatus } = require('./models'); // Import Sequelize models

// // Find user by email
// const findEmailUser = async (email) => {
// 	return await User.findOne({ where: { email } });
// };

// // Get user by ID
// const getUserByIdQuery = async (userId) => {
// 	return await User.findByPk(userId);
// };

// // Get users with filters
// const getUsersQuery = async (filters) => {
// 	const whereClause = {};

// 	const filterFields = ['email', 'first_name', 'last_name', 'phone_number'];

// 	filterFields.forEach((fieldName) => {
// 		const value = filters[fieldName];
// 		if (value !== undefined && value !== '') {
// 			whereClause[fieldName] = value;
// 		}
// 	});

// 	return await User.findAll({ where: whereClause });
// };

// // Add a new user
// const addUserQuery = async (userData) => {
// 	return await User.create(userData);
// };

// // Add a new pet
// const addPetQuery = async (petData) => {
// 	return await Pet.create(petData);
// };

// // Get pets with filters
// const getPetsByAndQuery = async (filters) => {
// 	const whereClause = {};

// 	const filterFields = [
// 		'breed',
// 		'id',
// 		'name',
// 		'type',
// 		'dietary_restriction',
// 		'color',
// 		'imgFile',
// 	];

// 	filterFields.forEach((fieldName) => {
// 		const value = filters[fieldName];
// 		if (value !== undefined && value !== '') {
// 			whereClause[fieldName] = value;
// 		}
// 	});

// 	if (filters.hypoallergenic !== undefined) {
// 		whereClause.hypoallergenic = filters.hypoallergenic === 'true';
// 	}

// 	if (filters.minHeight) {
// 		whereClause.height = { [Sequelize.Op.gte]: filters.minHeight };
// 	}
// 	if (filters.maxHeight) {
// 		whereClause.height = { [Sequelize.Op.lte]: filters.maxHeight };
// 	}
// 	if (filters.minWeight) {
// 		whereClause.weight = { [Sequelize.Op.gte]: filters.minWeight };
// 	}
// 	if (filters.maxWeight) {
// 		whereClause.weight = { [Sequelize.Op.lte]: filters.maxWeight };
// 	}

// 	return await Pet.findAll({
// 		where: whereClause,
// 		limit: filters.perPage,
// 		offset: (filters.pageNum - 1) * filters.perPage,
// 	});
// };

// // Get password for user by ID
// const getPasswordUserQuery = async (userId) => {
// 	const user = await User.findByPk(userId, {
// 		attributes: ['password'],
// 	});
// 	return user ? user.password : null;
// };

// // Edit user details
// const editUserQuery = async (editedUser) => {
// 	const user = await User.findByPk(editedUser.id);

// 	if (!user) throw new Error('User not found');

// 	const updatedData = {};

// 	if (editedUser.new_password) updatedData.password = editedUser.new_password;
// 	if (editedUser.email) updatedData.email = editedUser.email;
// 	if (editedUser.first_name) updatedData.first_name = editedUser.first_name;
// 	if (editedUser.last_name) updatedData.last_name = editedUser.last_name;
// 	if (editedUser.phone_number)
// 		updatedData.phone_number = editedUser.phone_number;

// 	return await user.update(updatedData);
// };

// // Edit pet details
// const editPetQuery = async (petId, editedPet) => {
// 	const pet = await Pet.findByPk(petId);

// 	if (!pet) throw new Error('Pet not found');

// 	const updatedData = {};

// 	if (editedPet.name) updatedData.name = editedPet.name;
// 	if (editedPet.adoption_status)
// 		updatedData.adoption_status = editedPet.adoption_status;
// 	if (editedPet.type) updatedData.type = editedPet.type;
// 	if (editedPet.height) updatedData.height = editedPet.height;
// 	if (editedPet.weight) updatedData.weight = editedPet.weight;
// 	if (editedPet.color) updatedData.color = editedPet.color;
// 	if (editedPet.bio) updatedData.bio = editedPet.bio;
// 	if (editedPet.hypoallergenic !== undefined)
// 		updatedData.hypoallergenic = editedPet.hypoallergenic;
// 	if (editedPet.dietary_restrictions)
// 		updatedData.dietary_restrictions = editedPet.dietary_restrictions;
// 	if (editedPet.breed) updatedData.breed = editedPet.breed;
// 	if (editedPet.imgFile) updatedData.imgFile = editedPet.imgFile;

// 	return await pet.update(updatedData);
// };

// // Add a like
// const addLikeQuery = async (userId, petId) => {
// 	return await PetStatus.create({ userId, petId });
// };

// // Get liked pets
// const getLikedPetsQuery = async (likedPetIds) => {
// 	return await Pet.findAll({ where: { id: likedPetIds } });
// };

// // Get like by user and pet ID
// const getLikesQuery = async (userId, petId) => {
// 	return await PetStatus.findOne({ where: { userId, petId } });
// };

// // Return a pet (remove adoption)
// const returnPetQuery = async (petId, userId) => {
// 	const pet = await Pet.findByPk(petId);
// 	if (pet && pet.adoptedBy === userId) {
// 		pet.adoptedBy = null;
// 		return await pet.save();
// 	}
// 	throw new Error('Pet not found or user did not adopt this pet');
// };

// // Adopt a pet
// const adoptPetQuery = async (petId, userId) => {
// 	const pet = await Pet.findByPk(petId);
// 	if (pet) {
// 		pet.adoptedBy = userId;
// 		return await pet.save();
// 	}
// 	throw new Error('Pet not found');
// };

// // Remove like
// const removeLikeQuery = async (userId, petId) => {
// 	const like = await PetStatus.findOne({ where: { userId, petId } });
// 	if (like) return await like.destroy();
// 	throw new Error('Like not found');
// };

// module.exports = {
// 	findEmailUser,
// 	addUserQuery,
// 	addPetQuery,
// 	editPetQuery,
// 	getUserByIdQuery,
// 	getUsersQuery,
// 	editUserQuery,
// 	getPetsByAndQuery,
// 	addLikeQuery,
// 	getLikesQuery,
// 	removeLikeQuery,
// 	returnPetQuery,
// 	adoptPetQuery,
// 	getLikedPetsQuery,
// 	getPasswordUserQuery,
// };
