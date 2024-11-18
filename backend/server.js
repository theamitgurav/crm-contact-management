const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'root', // Your MySQL password
    database: 'crm' // Database name
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Create the contacts table if it doesn't exist
db.query(`CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255),
    phoneNumber VARCHAR(255),
    company VARCHAR(255),
    jobTitle VARCHAR(255)
)`, (err) => {
    if (err) throw err;
});

// API Endpoints
app.post('/contacts', (req, res) => {
    const contact = req.body;
    db.query('INSERT INTO contacts SET ?', contact, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: result.insertId, ...contact });
    });
});

app.get('/contacts', (req, res) => {
    db.query('SELECT * FROM contacts', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.put('/contacts/:id', (req, res) => {
    const contact = req.body;
    db.query('UPDATE contacts SET ? WHERE id = ?', [contact, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send(contact);
    });
});

app.delete('/contacts/:id', (req, res) => {
    db.query('DELETE FROM contacts WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

app.get('/contacts', async (req, res) => {
    try {
        const contacts = await getContactsFromDatabase(); // Your logic to fetch contacts
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error); // Log the error
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/contacts', async (req, res) => {
    try {
        // Your logic to add a contact
        const contact = await addContact(req.body);
        res.status(201).json(contact);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
