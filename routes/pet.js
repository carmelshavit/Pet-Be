const validate = require("../validation/validateSchema");
const S = require("fluent-json-schema");
const express = require("express");
const auth = require("../authentication/authentication.js");
const router = express.Router();
const { addPet, editPet, getPetById, getPets } = require("../db/pets.js");

router.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const result = await getPets(filters);
    res.json(result);
  } catch (error) {
    console.error("Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const schema = S.object()
  .prop("type", S.string().required())
  .prop("adoption_status", S.string().required())
  .prop("height", S.number().required())
  .prop("weight", S.number().required())
  .prop("color", S.string().required())
  .prop("bio", S.string().required())
  .prop("hypoallergenic", S.boolean().required())
  .prop("dietary_restrictions", S.string().required())
  .prop("breed", S.string().required())
  .prop("imgFile", S.string().required())
  .valueOf();

router.post(
  "/",
  // validate(schema),
  auth.authenticate,
  (req, res) => {
    try {
      const data = req.body;
      if (req.decoded.isAdmin !== true) {
        return res
          .status(403)
          .send({ message: "Permission denied. Must be an admin." });
      }

      const queryResult = addPet(data);

      if (!queryResult || queryResult.affectedRows === 0) {
        return res.status(404).json({ error: "Add pet failed" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Successfully add pet" });
    } catch (error) {
      console.error("Error writing to file:", error);
      return res.status(500).json({ error: "Error writing to file" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const filters = req.query; // Use req.query to get the parameters from the query string
    const petsData = await getPetsByAndQuery(filters); // Pass the filters to the function

    console.log("line 37", petsData);

    res.json(petsData); // Send the pet data as the response
  } catch (error) {
    console.error("line 52, Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
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

router.put(
  "/:petId",
  //  auth.authenticateAdmin,
  async (req, res) => {
    try {
      const petId = req.params.petId;
      const editedPet = req.body;
      const isUpdateSuccessful = await editPet(petId, editedPet);
      if (isUpdateSuccessful) {
        res
          .status(200)
          .json({ success: true, message: "Updated pet successfully" });
      } else {
        res.status(400).json({ error: "This user not found" });
      }
    } catch (error) {
      console.error("line 52, Error in PUT / route:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/pet/:id/return", auth.authenticate, async (req, res) => {});
router.post("/pet/:id/adopt", auth.authenticate, async (req, res) => {});

router.post("/pet/:id/save", auth.authenticate, async (req, res) => {});
router.delete("/pet/:id/save", auth.authenticate, async (req, res) => {});

module.exports = router;
