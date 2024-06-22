// src/index.ts

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Path to the JSON database file
const dbPath = path.resolve(__dirname, 'db.json');

// Initialize the database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
}

// Endpoint to check server status
app.get('/ping', (req, res) => {
    res.send(true);
});

// Endpoint to submit a new form
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).send('All fields are required.');
    }

    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    db.push(newSubmission);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.send('Submission successful');
});

// Endpoint to read a submission by index
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    if (isNaN(index) || index < 0 || index >= db.length) {
        return res.status(400).send('Invalid index.');
    }

    res.json(db[index]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
