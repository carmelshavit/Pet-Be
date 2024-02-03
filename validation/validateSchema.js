const { error } = require("ajv/dist/vocabularies/applicator/dependencies");

const Ajv = require("ajv").default;
const ajv = new Ajv();

function validate(schema) {
  const validate = ajv.compile(schema);
  return function (req, res, next) {
    const valid = validate(req.body);
    if (!valid) {
      console.log('reuest not valdiate', validate.errors);
      res.status(400).send(validate.errors);
    } else {
      next(); // call next only if valid
    }
  }
}
module.exports = validate