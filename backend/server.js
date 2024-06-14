const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

const authRoutes = require('./routes/auth.route');

const verifyToken = require('./middleware/auth.middleware');

const db = require('./config/db.config');
  
app.use(cors(),express.json());

app.use('/api/', authRoutes);
// app.use('/api/', verifyToken);

require('dotenv').config();

app.post('/api/user-pokemon/insert',verifyToken,  async (req, res) => {
    const { pokemon_id, version_id, user_id } = req.body;

    if (!pokemon_id || !version_id) {
        return res.status(400).json({ error: 'pokemon_id and version_id are required' });
    }

    const query = `
      INSERT IGNORE INTO users_pokemon (user_id, pokemon_id, version_id) VALUES (?, ?, ?)`;
    db.query(query, [user_id, pokemon_id, version_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: 'Pokemon added successfully', id: results.insertId });
    });
});

app.post('/api/user-pokemon/delete',verifyToken,  async (req, res) => {
    const { pokemon_id, version_id, user_id } = req.body;

    if (!pokemon_id || !version_id) {
        return res.status(400).json({ error: 'pokemon_id and version_id are required' });
    }

    const query = `
      DELETE FROM users_pokemon
      WHERE user_id = ? AND pokemon_id = ? AND version_id = ?`;
      db.query(query, [user_id, pokemon_id, version_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No entry found to delete' });
        }
        res.status(200).json({ message: 'Pokemon removed successfully' });
    });
});

// Endpoint to get a users caught pokemon by user_id and version_id
app.get('/api/user-pokemon', (req, res) => {
    const { version_id, user_id } = req.query;

    // Validate presence of version_id and user_id
    if (!version_id || !user_id) {
        return res.status(400).send({ error: 'version_id and user_id are required' });
    }

    // MySQL query to select pokemon_id for a specific user and version
    const query = `
        SELECT pokemon_id
        FROM users_pokemon
        WHERE version_id = ? AND user_id = ?;
    `;

    // Execute the query with version_id and user_id as parameters
    db.query(query, [version_id, user_id], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

// Endpoint to get location identifiers by version_id
app.get('/api/locations', (req, res) => {
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
app.get('/api/encounter-details', (req, res) => {
    const versionId = req.query.version_id;
    const locationIdentifier = req.query.location_identifier;

    if (!versionId || !locationIdentifier) {
        return res.status(400).send({ error: 'version_id and location_identifier are required' });
    }

    const query = `
        SELECT psn.name as pokemonName, psn.pokemon_species_id as pokemonId
        FROM encounters e
        INNER JOIN pokemon_species_names psn ON e.pokemon_id = psn.pokemon_species_id
        INNER JOIN location_areas la ON e.location_area_id = la.id
        INNER JOIN locations l ON la.location_id = l.id
        WHERE e.version_id = ? AND l.identifier = ? AND psn.local_language_id='9'
        GROUP BY pokemonName, pokemonId;
    `;

    db.query(query, [versionId, locationIdentifier], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

// Endpoint to access pokedex by version_id
app.get('/api/pokedex', (req, res) => {
    const versionId = req.query.version_id;

    // return error code 400 if version_id is missing
    if (!versionId)
    {
        return res.status(400).send({ error: 'version_id is required' });
    }

    // query to select pokedex for specific version
    const query = `
        SELECT (SELECT psn.name FROM pokemon_species_names psn WHERE psn.pokemon_species_id = pgi.pokemon_id and psn.local_language_id = 9) AS pokemonName,
        pgi.pokemon_id AS pokemonId
        FROM pokemon_game_indices pgi
        WHERE pgi.version_id = ?;
    `;

    // send query to db
    db.query(query, [versionId], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});