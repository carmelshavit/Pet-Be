const validate = require('../validation/validateSchema');
const S = require('fluent-json-schema');
const express = require('express');
const router = express.Router();
const { addPet} = require('../db/pets.js');

const schema = S.object()
    .prop('Type', S.string().required())
    .prop('Adoption Status,', S.string().required())
    .prop('Picture,', S.string().required())
    .prop('Height,', S.string().required())
    .prop('Color,,', S.string().required())
    .prop('Bio,,', S.string().required())
    .prop('Hypoallergenic,', S.string().required())
    .prop('dietary restrictions', S.string().required())
    .prop('breed of animal', S.string().required())
    .valueOf()

router.post('/', validate(schema), (req, res) => {
    try {
        console.log(req.body);
        const data = req.body;
        addPet(data)
        return res.status(200).send('succesfully add pet');

    } catch (error) {
        console.error('Error writing to file:', error);
        return res.status(500).send('Error writing to file');
    }
});

module.exports = router;
