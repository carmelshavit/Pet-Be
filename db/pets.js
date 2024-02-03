const fs = require('fs');
const petsPath = 'db/pets.json'

const addPet = (pets) => {
    //add validation
    
    fs.readFile(petsPath, 'utf8', (err, fileText) => {
        if (err) {
            throw err;
        }

        let jsonData = JSON.parse(fileText);
        jsonData.push(pets);

        fs.writeFile(petsPath, JSON.stringify(jsonData), 'utf8', (err) => {
            if (err) {
                throw err;
            }

            console.log('pets added successfully!');
        });
    });
};

module.exports = { addPet };