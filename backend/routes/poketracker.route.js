const express = require('express');
const router = express.Router();
const db = require('../config/db.config'); // Adjust the path as needed
const verifyToken = require('../middleware/auth.middleware'); // Adjust the path as needed

// Insert a new user's pokemon
router.post('/user-pokemon/insert', verifyToken, async (req, res) => {
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

// Delete a user's pokemon
router.post('/user-pokemon/delete', verifyToken, async (req, res) => {
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

// Get a user's caught pokemon
router.get('/user-pokemon', verifyToken, (req, res) => {
    const { version_id, user_id } = req.query;

    if (!version_id || !user_id) {
        return res.status(400).send({ error: 'version_id and user_id are required' });
    }

    const query = `
        SELECT pokemon_id
        FROM users_pokemon
        WHERE version_id = ? AND user_id = ?;
    `;

    db.query(query, [version_id, user_id], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

// Get pokedex ids and names by version_id
router.get('/pokedex_versions', (req, res) => {
    const versionId = req.query.version_id;

    if (!versionId) {
        return res.status(400).send({error: 'version_id is required to fex pokedex data.'})
    }

    const query = `
        SELECT pvg.pokedex_id as pokedexId,
        (SELECT pp.name from pokedex_prose pp WHERE pp.pokedex_id = pvg.pokedex_id) AS pokedexName
        FROM pokedex_version_groups pvg
        INNER JOIN versions v
        ON pvg.version_group_id = v.version_group_id
        WHERE v.id = ?;
    `;

    db.query(query, [versionId], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
})

// Get location identifiers by version_id
router.get('/locations', (req, res) => {
    const versionId = req.query.version_id;

    if (!versionId) {
        return res.status(400).send({ error: 'version_id is required' });
    }

    const query = `
        SELECT l.identifier as identifier, l.id as location_id, ln.name as locationName
        FROM encounters e
        INNER JOIN location_areas la ON e.location_area_id = la.id
        INNER JOIN locations l ON la.location_id = l.id
        INNER JOIN location_names ln on l.id = ln.location_id
        WHERE e.version_id = ?
        GROUP BY identifier, location_id, locationName
        ORDER BY
            CASE
                WHEN locationName LIKE 'Route %' THEN CAST(SUBSTRING(locationName, 7) AS UNSIGNED)
                ELSE 0
            END,
            locationName;
    `;

    db.query(query, [versionId], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

// Get encounter details by version_id and location_identifier
router.get('/encounter-details', (req, res) => {
    const versionId = req.query.version_id;
    const locationIdentifier = req.query.location_identifier;

    if (!versionId || !locationIdentifier) {
        return res.status(400).send({ error: 'version_id and location_identifier are required' });
    }

    const query = `
        select e.pokemon_id as pokemonId, 
        psn.name as pokemonName, 
        min(min_level) as minLevel, 
        max(max_level) as maxLevel, 
        la.identifier as locationArea, 
        l.identifier as locationName, 
        em.identifier as encounterMethod, 
        sum(es.rarity) as encounterRate from encounters e

        inner join location_areas la
        on e.location_area_id=la.id

        inner join locations l
        on la.location_id=l.id

        inner join encounter_slots es
        on e.encounter_slot_id=es.id

        inner join encounter_methods em
        on es.encounter_method_id=em.id

        inner join pokemon_species_names psn
        on e.pokemon_id=psn.pokemon_species_id

        where e.version_id = ? and l.identifier=?

        group by pokemonId, locationArea, encounterMethod, pokemonName

        order by encounterMethod;
    `;

    db.query(query, [versionId, locationIdentifier], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.send(results);
    });
});

// Get pokedex by version_id
router.get('/pokedex', (req, res) => {
    const versionId = req.query.version_id;

    if (!versionId) {
        return res.status(400).send({ error: 'version_id is required' });
    }

    const query = `
        SELECT (SELECT psn.name FROM pokemon_species_names psn WHERE psn.pokemon_species_id = pdn.species_id) AS pokemonName,
        pdn.species_id AS pokemonId
        FROM pokemon_dex_numbers pdn
        WHERE pdn.pokedex_id = ?
        ORDER BY pdn.pokedex_number;
    `;

    db.query(query, [versionId], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

module.exports = router;
