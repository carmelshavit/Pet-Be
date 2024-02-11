const validate = require("../validation/validateSchema");
const S = require("fluent-json-schema");
const express = require("express");
const router = express.Router();
const auth = require("../authentication/authentication.js");
var jwt = require("jsonwebtoken");

const { login, addUser, getUserById, getUsers } = require("../db/users.js");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    console.log("line 14:", user);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const token = auth.sign({
      id: user.id,
    });
    res.setHeader("Set-Cookie", `token=${token}`);
    res.json({
      user: {
        id: user.id,
        name: user.first_name,
        email: user.email,
        isAdmin: user.is_admin === 1 ? true : false,
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
  // .prop("liked_pet", S.number())
  .valueOf();

router.post("/signup", validate(schema), async (req, res) => {
  try {
    const data = req.body;
    await addUser(data);
    return res.status(200).send("succesfully add user");
  } catch (error) {
    console.error("Error writing to file:", error);
    return res.status(500).send("Error writing to file");
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await getUsers();
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const getuserId = await getUserById(userId);
    console.log("line 37", getuserId);

    if (getuserId === null) {
      // Handle the case where the user is not found
      console.log("User not found");
    } else {
      // Process the user data or return it as needed
      res.json(getuserId);
    }
  } catch (error) {
    console.error("Error in GET /:userId route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const edituser = await edituser(userId);

    console.log("line 61", edituser);
    res.json({ message: `user  with id ${userId} add successfully` });
  } catch (error) {
    console.error("line 52,Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
