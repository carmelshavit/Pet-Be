const jwt = require("jsonwebtoken");
require("dotenv").config();
// const secret = "a_very_secret_password_to_store_secretly";

/**
 * Create a new token based on some data.
 * This data is encrypted into the token.
 * When using jwt.verify on the token, we decrypt it and get the data
 * we provided to create the token.
 * @param {*} data Data to be encrypted into the new generated token
 * @returns New generated token
 */
function sign(data) {
  return jwt.sign(data, process.env.SECRET);
}

function authenticate(req, res, next) {
  // //console.log(req.cookies);
  const token = req.headers.authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Must authenticate" });
      return;
    }
    // decoded - {id: USER_ID, isAdmin: true/false}. See 'login' endpoint
    req.decoded = decoded;
    console.log(req);
    next();
  });
}

function authenticateAdmin(req, res, next) {
  const token = req.headers.authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Must authenticate" });
      return;
    }
    if (!decoded || decoded.is_admin !== 1) {
      res.status(403).send({ message: "Permission denied. Must be an admin." });
      return;
    }
    // Set req.decoded to the decoded payload
    req.decoded = decoded;
    next();
  });
}

// function getAuthenticateMiddleware(validateIsAdmin=false) {
//   return function authenticate(req, res, next) {
//     const token = req.headers.authorization.replace("Bearer ", "");
//     jwt.verify(token, secret, (err, decoded) => {
//       if (err) {
//         res.statusCode(401).send({ message: "Must authenticate" });
//         return;
//       }
//       if (validateIsAdmin) {
//           if (req.decoded.isAdmin !== true) {
//              res.statusCode(403).send({ message: "Permission denied. Must be an admin." });
//             }
//       }
//       // decoded - {id: USER_ID, isAdmin: true/false}. See 'login' endpoint
//       req.decoded = decoded
//       next();
//     });
//   }
// }

module.exports = { authenticateAdmin, authenticate, sign };
