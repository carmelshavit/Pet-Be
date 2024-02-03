const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
// const signup = require('./routes/signup');
// const login = require('./routes/login');
const allUsersFunctions = require("./routes/user");
const pets = require("./routes/pet");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
// app.use('/signup', signup);
// app.use('/login', login);
app.use("/user", allUsersFunctions);
app.use("/pets", pets);

const port = 3001;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
