const jwt = require("jsonwebtoken");

const secret = "a_very_secret_password_to_store_secretly";

/**
 * Create a new token based on some data.
 * This data is encrypted into the token.
 * When using jwt.verify on the token, we decrypt it and get the data
 * we provided to create the token.
 * @param {*} data Data to be encrypted into the new generated token
 * @returns New generated token
 */
function sign(data) {
  return jwt.sign(data, secret);
}

function authenticate(req, res, next) {
  const token = req.headers.authorization.replace("Bearer ", "");

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.statusCode(401).send({ message: "Must authenticate" });
      return;
    }
    req.decoded = decoded;
    next();
  });
}

module.exports = { authenticate, sign };
