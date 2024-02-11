const express = require("express");
const app = express();
const cors = require("cors");
const allUsersFunctions = require("./routes/user");
const pets = require("./routes/pet");
const { getConnection } = require("./db/db");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

app.use("/users", allUsersFunctions);
app.use("/pets", pets);

const port = 3001;

app.get("/", async (req, res) => {
  await getConnection();
  res.send("Notes application");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
