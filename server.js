const express = require("express");
const app = express();
const cors = require("cors");
const allUsersFunctions = require("./routes/user");
const pets = require("./routes/pet");
const cookieParser = require("cookie-parser");

const {
  getConnection,
  // ,migrate
} = require("./db/db");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/user", allUsersFunctions);
app.use("/pet", pets);

const port = 3001;

app.get("/", async (req, res) => {
  await getConnection();
  res.send("Pets application");
});

require("express-print-routes")(app, "routes.txt");

// migrate();
app.listen(port, () => {
  //console.log(`Example app listening at http://localhost:${port}`);
});
