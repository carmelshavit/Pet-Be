/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
const allUsersFunctions = require('./routes/user');
const pets = require('./routes/pet');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const { getConnection } = require('./db/db');

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

app.use(express.json());
app.use(cookieParser());

app.use('/user', allUsersFunctions);
app.use('/pet', pets);

const port = 3001;

// Function to execute the SQL schema
const executeSchema = async () => {
	try {
		const sql = fs.readFileSync('migration/schema.sql', 'utf8');

		// Get MySQL connection
		const connection = await getConnection();

		// Execute the SQL queries
		await connection.query(sql);

		// Close the connection
		console.log('Schema executed successfully.');
	} catch (error) {
		console.error('Error reading or executing schema.sql:', error);
	}
};

// Execute the schema on server start
executeSchema();

app.get('/', async (req, res) => {
	res.send('Pets application');
});

require('express-print-routes')(app, 'routes.txt');

// Start the server
app.listen(port, async () => {
	await getConnection();
	console.log(`Example app listening at http://localhost:${port}`);
});
