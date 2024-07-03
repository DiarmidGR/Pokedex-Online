const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Get pokemon details by pokemon_id
router.get('/pokemon_details', (req, res) => {
    const pokemonId = req.query.pokemon_id;

    if (!pokemonId)
        {
            return res.status(400).send({error: 'pokemon_id is required to fetch pokemon details.'})
        };

    const query = `
        SELECT
            p.species_id as nationalId,
            psn.name AS name,
            GROUP_CONCAT(DISTINCT t.identifier ORDER BY t.identifier SEPARATOR ', ') AS types
        FROM
            pokemon p
            INNER JOIN pokemon_species_names psn ON psn.pokemon_species_id = p.species_id
            INNER JOIN pokemon_types pt ON pt.pokemon_id = p.species_id
            INNER JOIN types t ON t.id=pt.type_id
        WHERE
            p.species_id = ?
        GROUP BY
            p.species_id, p.height, p.weight, psn.name
        LIMIT 1;
    `

    db.query(query, [pokemonId], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

// Get pokemon locations by pokemon_id and version_id
router.get('/pokemon_locations', (req, res) => {
    const pokemonId = req.query.pokemon_id;
    const versionId = req.query.version_id;

    if (!pokemonId || !versionId)
        {
            return res.status(400).send({error: 'version_id and pokemon_id is required to fetch pokemon locations.'})
        };

    const query = `
        SELECT 
        l.identifier as locationIdentifier, 
        ln.name locationName
        FROM encounters e
        inner join location_areas la
        ON e.location_area_id=la.id
        inner join locations l
        ON l.id=la.location_id
        inner join location_names ln
        ON l.id=ln.location_id
        WHERE e.version_id=? and e.pokemon_id=?
        group by l.identifier, ln.name;
    `

    db.query(query, [versionId, pokemonId], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

module.exports=router;
