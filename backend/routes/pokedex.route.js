const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

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

module.exports=router;
