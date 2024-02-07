const jwt = require("jsonwebtoken");

const secret = "a_very_secret_password_to_store_secretly";

function sign(data) {
  return jwt.sign(data, secret);
}

function authenticate(req, res, next) {
  const token = req.headers.authorization.replace("Bearer ", "");

  jwt.verify(token, password, (err, decoded) => {
    if (err) {
      res.statusCode(401).send({ message: "Must authenticate" });
      return;
    }
    req.decoded = decoded;
    next();
  });
}

module.exports = { authenticate, sign };
