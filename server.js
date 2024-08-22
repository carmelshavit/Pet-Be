/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
const allUsersFunctions = require('./routes/user');
const pets = require('./routes/pet');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./db/db'); // Import the sequelize instance

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve('Public')));
} else {
	app.use(
		cors({
			origin: 'http://localhost:5173',
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			credentials: true,
		})
	);
}

const {
	getConnection,
	// ,migrate
} = require('./db/db');

app.use(express.json());
app.use(cookieParser());

app.use('/user', allUsersFunctions);
app.use('/pet', pets);

const port = 3001;

app.get('/', async (req, res) => {
	try {
		await sequelize.authenticate(); // Test the connection when the root route is hit
		res.send('Pets application connected to database');
	} catch (err) {
		res.status(500).send('Failed to connect to database');
	}
});

require('express-print-routes')(app, 'routes.txt');

// migrate();
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
