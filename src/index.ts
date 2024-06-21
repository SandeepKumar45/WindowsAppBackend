import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { Database, Submission } from './types';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.json({ message: 'True' });
});

app.post('/submit', (req, res) => {
    const submission: Submission = req.body;

    // Read the current database file
    const dbData = fs.readFileSync(DB_FILE, 'utf-8');
    const db: Database = JSON.parse(dbData);

    // Add the new submission to the database
    db.submissions.push(submission);

    // Write the updated database back to the file
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

    res.status(201).json({ message: 'Submission successful' });
});

app.get('/read', (req, res) => {
    try {
        const index = parseInt(req.query.index as string);

        if (isNaN(index)) {
            return res.status(400).send('Invalid index');
        }

        const dbData = fs.readFileSync(DB_FILE, 'utf-8');
        const db: Database = JSON.parse(dbData);
        const submissions = db.submissions;

        if (index >= 0 && index < submissions.length) {
            res.json(submissions[index]); // Return the single submission directly
        } else {
            res.status(404).send('Submission not found');
        }
    } catch (error) {
        console.error('Error reading submissions:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
