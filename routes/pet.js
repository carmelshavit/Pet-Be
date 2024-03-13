const validate = require("../validation/validateSchema");
const S = require("fluent-json-schema");
const express = require("express");
const auth = require("../authentication/authentication.js");
const router = express.Router();
const {
  addPet,
  editPet,
  getPetById,
  getPets,
  addLike,
  removeLike,
} = require("../db/pets.js");

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
      console.log(req);
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

router.get("/:id", async (req, res) => {
  try {
    const petId = req.params.id;
    console.log(petId);
    const pet = await getPetById(petId); // Wait for the asynchronous operation to complete

    console.log("line 80", pet);

    res.json(pet);
  } catch (error) {
    console.error("line 85,Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put(
  "/:petId",
  // auth.authenticateAdmin,
  async (req, res) => {
    try {
      const petId = req.params.petId;
      const editedPet = req.body;
      const isUpdateSuccessful = await editPet(petId, editedPet); // Pass petId to the editPet function
      if (isUpdateSuccessful) {
        res
          .status(200)
          .json({ success: true, message: "Updated pet successfully" });
      } else {
        res.status(400).json({ error: "This pet not found" }); // Update error message
      }
    } catch (error) {
      console.error("Error in PUT / route:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/:id/return", auth.authenticate, async (req, res) => {
  const petId = req.params.id;

  const queryResult = returnPet(data);

  if (!queryResult || queryResult.affectedRows === 0) {
    return res.status(404).json({ error: "return pet failed" });
  }
});
router.post("/:id/adopt", auth.authenticate, async (req, res) => {});

router.post(
  "/:id/save",
  // auth.authenticate,
  async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const petId = id;
    console.log(petId);
    console.log(userId);
    const queryResult = await addLike(userId, petId);
    try {
      if (!queryResult || queryResult.affectedRows === 0) {
        res.status(404).send(queryResult);
      }

      res.send("Pet Like successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }
);

router.delete("/:id/save", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    const petId = id;
    const queryResult = await removeLike(userId, petId);

    if (!queryResult || queryResult.affectedRows === 0) {
      res.status(404).send("Pet not found or like not removed.");
    } else {
      res.send("Pet removed successfully!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

router.get(
  "/:id/save",
  // auth.authenticate,
  async (req, res) => {
    console.log(req);
    const { id } = req.params;
    const petId = id;
    console.log(petId);
    const queryResult = await getLike(userId, petId);
    try {
      if (!queryResult || queryResult.affectedRows === 0) {
        res.status(404).send(queryResult);
      }

      res.send("Pet Like successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }
);
module.exports = router;
