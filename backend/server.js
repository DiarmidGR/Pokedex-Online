const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;
  
app.use(cors());

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Endpoint to get location identifiers by version_id
app.get('/locations', (req, res) => {
    const versionId = req.query.version_id;

    if (!versionId) {
        return res.status(400).send({ error: 'version_id is required' });
    }

    const query = `
        SELECT l.identifier as identifier, l.id as location_id
        FROM encounters e
        INNER JOIN location_areas la ON e.location_area_id = la.id
        INNER JOIN locations l ON la.location_id = l.id
        WHERE e.version_id = ?
        GROUP BY l.identifier, location_id;
    `;

    db.query(query, [versionId], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

// Endpoint to get encounter details by version_id and location_identifier
app.get('/encounter-details', (req, res) => {
    const versionId = req.query.version_id;
    const locationIdentifier = req.query.location_identifier;

    if (!versionId || !locationIdentifier) {
        return res.status(400).send({ error: 'version_id and location_identifier are required' });
    }

    const query = `
        SELECT MIN(e.min_level) as min_level, MAX(e.max_level) as max_level, p.identifier as pokemonName, p.species_id as pokemonId
        FROM encounters e
        INNER JOIN versions v ON e.version_id = v.id
        INNER JOIN pokemon p ON e.pokemon_id = p.id
        INNER JOIN location_areas la ON e.location_area_id = la.id
        INNER JOIN locations l ON la.location_id = l.id
        WHERE v.id = ? AND l.identifier = ?
        GROUP BY pokemonName, pokemonId;
    `;

    db.query(query, [versionId, locationIdentifier], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});