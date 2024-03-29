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
  returnPet,
  adoptPet,
  getLikedPets,
} = require("../db/pets.js");

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
  auth.authenticateAdmin,
  (req, res) => {
    try {
      //console.log(req);
      const data = req.body;

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

router.post("/like", async (req, res) => {
  // console.log("line 61", req);
  try {
    const likedPetIds = req.body;
    console.log("line 62", likedPetIds);
    const petsData = await getLikedPets(likedPetIds);
    res.json(petsData);
    console.log("line 67", petsData);
  } catch (error) {
    console.error("line 66, Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const filters = req.query;
    console.log("line 73", filters); // Use req.query to get the parameters from the query string
    const petsData = await getPets(filters); // Pass the filters to the function
    res.json(petsData); // Send the pet data as the response
  } catch (error) {
    console.error("line 77, Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const petId = req.params.id;
    //console.log(petId);
    const pet = await getPetById(petId); // Wait for the asynchronous operation to complete

    //console.log("line 80", pet);

    res.json(pet);
  } catch (error) {
    console.error("line 85,Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:petId", auth.authenticateAdmin, async (req, res) => {
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
});

router.post("/:id/return", auth.authenticate, async (req, res) => {
  const petId = req.params.id;
  const userId = req.decoded.userId;

  const queryResult = returnPet(petId, userId);

  if (!queryResult || queryResult.affectedRows === 0) {
    res.status(404).json({ error: "return pet failed" });
  }

  res.json({ message: "return pet successfully" });
});

router.post("/:id/adopt", auth.authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.decoded.userId;

  console.log("Pet ID:", id);
  console.log("User ID:", userId);

  try {
    const adoptedPet = await adoptPet(id, userId); // Pass id directly to adoptedPet function
    console.log("line 145", adoptedPet);

    if (!adoptedPet) {
      return res.status(404).json({ error: "Adopting pet failed" });
    }

    res.json(adoptedPet);
  } catch (error) {
    console.error("Error adopting pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/:id/save",
  // auth.authenticate,
  async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const petId = id;

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

module.exports = router;
