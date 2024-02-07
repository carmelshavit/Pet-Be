const validate = require("../validation/validateSchema");
const S = require("fluent-json-schema");
const express = require("express");
const router = express.Router();
const auth = require("../authentication/authentication.js");
var jwt = require("jsonwebtoken");

const { getUser, addUser, getUserById } = require("../db/users.js");

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    // console.log(email);
    const user = await getUser(email, password);
    console.log("line 15", user);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    const token = auth.sign({ id: user.id });
    // res.setHeader("Set-Cookie", `token=${token}`);
    res.json({ user: { name: user.name, email: user.email }, token });
  } catch (error) {
    console.error("Error in GET / route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
  console.log(res);
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
    const data = req.body;
    await addUser(data);
    return res.status(200).send("succesfully add user");
  } catch (error) {
    console.error("Error writing to file:", error);
    return res.status(500).send("Error writing to file");
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const getuserId = await getUserById(userId); 
    console.log("line 37", getuserId);

    res.json(userId);
  } catch (error) {
    console.error("line 52,Error in GET / route:", error.message);
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
