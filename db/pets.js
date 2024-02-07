const fs = require("fs");
const petsPath = "db/pets.json";

const addPet = (pet) => {
  //add validation
  fs.readFile(petsPath, "utf8", (err, fileText) => {
    if (err) {
      throw err;
    }
    let jsonData = JSON.parse(fileText);
    jsonData.push(pet);

    fs.writeFile(petsPath, JSON.stringify(jsonData), "utf8", (err) => {
      if (err) {
        throw err;
      }
      console.log("pets added successfully!");
    });
  });
};

const getPetById = async (petId) => {
  console.log("line 26", petId);
  try {
    const fileText = await fs.promises.readFile(petPath, "utf8");
    let jsonData = JSON.parse(fileText);

    console.log("All pets:", jsonData);

    const pet = jsonData.find((pet) => {
      console.log("Checking pet:", pet);
      return pet.id === petId;
    });

    console.log("Final pet:", pet);
  } catch (err) {
    console.log("Error from server:", err.message);
    throw err;
  }
};


module.exports = { addPet, getPetById };
