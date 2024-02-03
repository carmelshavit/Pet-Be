const validate = require('../validation/validateSchema');
const S = require('fluent-json-schema');
const express = require('express');
const router = express.Router();
const { getUser, addUser } = require('../db/users.js');


router.post('/login', async (req, res) => {
    console.log('try to get password');
    try {
        const { email, password } = req.body;
        console.log(email);
        const user = await getUser(email, password);
        console.log(user);
        if (!user) {
            res.status(401).json({ error: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error("Error in GET / route:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

const schema = S.object()
    .prop('email', S.string().required())
    .prop('password', S.string().required())
    .prop('firstName', S.string().required())
    .prop('lastName', S.string().required())
    .prop('phoneNumber', S.string().required())
    .valueOf()

router.post('/signup', validate(schema), (req, res) => {
    try {
        console.log(req.body);
        const data = req.body;
        addUser(data)
        return res.status(200).send('succesfully add user');

    } catch (error) {
        console.error('Error writing to file:', error);
        return res.status(500).send('Error writing to file');
    }
});

module.exports = router;
