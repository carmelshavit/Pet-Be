const validate = require("../validation/validateSchema");
const S = require("fluent-json-schema");
const express = require("express");
const router = express.Router();
const { addPet, editPet, getPetById } = require("../db/pets.js");

const schema = S.object()
  .prop("Type", S.string().required())
  .prop("Adoption Status,", S.string().required())
  .prop("Picture,", S.string().required())
  .prop("Height,", S.string().required())
  .prop("Color,,", S.string().required())
  .prop("Bio,,", S.string().required())
  .prop("Hypoallergenic,", S.string().required())
  .prop("dietary restrictions", S.string().required())
  .prop("breed of animal", S.string().required())
  .valueOf();

router.post("/", validate(schema), (req, res) => {
  try {
    console.log("line 21", req.body);
    const data = req.body;
    addPet(data);
    return res.status(200).send("succesfully add pet");
  } catch (error) {
    console.error("Error writing to file:", error);
    return res.status(500).send("Error writing to file");
  }
});

router.get("/:petId", async (req, res) => {
  try {
    const petId = req.params.petId;
    const getPetId = await getPetById(petId); // Wait for the asynchronous operation to complete

    console.log("line 37", getPetId);

    res.json(petId);
  } catch (error) {
    console.error("line 52,Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:petId", async (req, res) => {
  try {
    const petId = req.params.petId;
    const editPet = await editPet(petId);

    console.log("line 61", editPet);
    res.json({ message: `pet with id ${petId} add successfully` });
  } catch (error) {
    console.error("line 52,Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
