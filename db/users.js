const fs = require('fs');
const userPath = 'db/user.json'
const bcrypt = require('bcrypt');

const getUser = async (email, password) => {
    try {
        const fileText = await fs.promises.readFile(userPath, 'utf8');
        let jsonData = JSON.parse(fileText);
        const user = jsonData.find((user) => {
            console.log('line 9', user);
            return user.email === email && user.password === password;

        });
        return user
    } catch (err) {
        console.log('Error from server:', err.message);
        throw err;
    }
};

const addUser = (user) => {
    //add validation
    
    fs.readFile(userPath, 'utf8', (err, fileText) => {
        if (err) {
            throw err;
        }

        let jsonData = JSON.parse(fileText);
        jsonData.push(user);

        fs.writeFile(userPath, JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                throw err;
            }

            console.log('User added successfully!');
        });
    });
};

module.exports = { addUser, getUser };
