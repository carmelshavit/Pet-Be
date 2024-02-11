const validate = require("../validation/validateSchema");
const S = require("fluent-json-schema");
const express = require("express");
const auth = require("../authentication/authentication.js");
const router = express.Router();
const { addPet, editPet, getPetById, getPet } = require("../db/pets.js");

router.get("/", async (req, res) => {
  try {
    const result = await getPet();
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const schema = S.object()
  .prop("type", S.string().required())
  .prop("adoption_status", S.string().required())
  .prop("picture", S.string().required())
  .prop("height", S.number().required())
  .prop("weight", S.number().required())
  .prop("color", S.string().required())
  .prop("bio", S.string().required())
  .prop("hypoallergenic", S.boolean().required())
  .prop("dietary_restrictions", S.string().required())
  .prop("breed", S.string().required())
  .valueOf();

router.post("/", validate(schema), auth.authenticate, (req, res) => {
  try {
    const data = req.body;
    if (req.decoded.isAdmin !== 1) {
      return res
        .status(403)
        .send({ message: "Permission denied. Must be an admin." });
    }
    const queryResult = addPet(data);

    if (!queryResult || queryResult.affectedRows === 0) {
      return res.status(404).send("Add pet failed");
    }
    return res.status(200).send("Successfully add pet");
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
