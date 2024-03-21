const validate = require("../validation/validateSchema");
const S = require("fluent-json-schema");
const express = require("express");
const router = express.Router();
const auth = require("../authentication/authentication.js");
var jwt = require("jsonwebtoken");
// import Cookies from "react-cookie";
// const cookies = new Cookies();

const {
  login,
  addUser,
  getUserById,
  getUsers,
  editUser,
  getUserPetsArr,
} = require("../db/users.js");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    const isThisUserAnAdmin = user.is_admin === 1;
    const token = auth.sign({
      userId: user.id,
      isAdmin: isThisUserAnAdmin,
    });
    const copy = { ...user };
    delete copy.password;
    res.json({
      user: {
        ...copy,
        isAdmin: isThisUserAnAdmin,
      },
      token,
    });
  } catch (error) {
    console.error("line 24, Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const schema = S.object()
  .prop("email", S.string().required())
  .prop("password", S.string().required())
  .prop("first_name", S.string().required())
  .prop("last_name", S.string().required())
  .prop("phone_number", S.string().required())
  .valueOf();

router.post("/signup", validate(schema), async (req, res) => {
  try {
    const user = req.body;
    const newUser = await addUser(user);
    delete newUser.password;
    return res.json(newUser);
  } catch (error) {
    console.error("Error writing to db:", error);
    return res.status(500).send("Error writing to db");
  }
});

router.get("/", 
// auth.authenticateAdmin,
 async (req, res) => {
  try {
    // const userId = req.decoded.userId;
    const filters = req.query;
    const users = await getUsers(filters);

    const usersWithPets = await Promise.all(
      users.map(async (user) => {
        const pets = await getUserPetsArr(user.id);
        user.adoptedPets = pets;
        return user;
      })
    );

    res.json(usersWithPets);
  } catch (error) {
    console.error("Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", auth.authenticate, async (req, res) => {
  try {
    const userId = req.decoded.userId;
    const user = await getUserById(userId);
    //console.log("line 37", user);

    if (user === null) {
      res.status(404).json({ error: "User not found" });
      // Handle the case where the user is not found
    } else {
      // Process the user data or return it as needed
      res.json(user);
    }
  } catch (error) {
    console.error("Error in GET /:userId route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const getuserId = await getUserById(userId);
    if (getuserId === null) {
      // Handle the case where the user is not found
    } else {
      // Process the user data or return it as needed
      res.json(getuserId);
    }
  } catch (error) {
    console.error("Error in GET /:userId route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/full", async (req, res) => {});

router.put(
  "/:userId",
  //  auth.authenticate,
  async (req, res) => {
    try {
      const editedUser = req.body;
      //console.log("line 118", editedUser);
      const updatedUser = await editUser(editedUser);
      if (updatedUser) {
        res.status(200).json({
          success: true,
          message: "Updated user successfully",
        });
      } else {
        res.status(400).json({ error: "This user not found" });
      }
    } catch (error) {
      console.error("line 128,Error in PUT / route:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
