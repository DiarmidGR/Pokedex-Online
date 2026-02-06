const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Get pokedex by pokedex_id
router.get('/pokedex', (req, res) => {
    const pokedexId = req.query.pokedex_id;
    const versionId = req.query.version_id;

    // Ghetto method of limiting national dex based on the version
    let limit;
    switch(versionId){
        case '1'||'2'||'3':
            limit=151;
            break;
        case '4'||'5'||'6':
            limit=251;
            break;
        case '7'||'8'||'9'||'10'||'11':
            limit=386;
            break;
        case '12'||'13'||'14'||'15'||'16'||'37'||'38':
            limit=493;
            break;
        case '17'||'18'||'21'||'22'||'16':
            limit=649;
            break;
        case '23'||'24'||'25'||'26':
            limit=721;
            break;
        case '27'||'28'||'29'||'30':
            limit=809;
            break;
        case '27'||'28'||'29'||'30':
            limit=905;
            break;
        default:
            limit=null;
    }

    if (!pokedexId || !versionId) {
        return res.status(400).send({ error: 'pokedex_id and version_id is required' });
    }

    const query = `
        SELECT (SELECT psn.name FROM pokemon_species_names psn WHERE psn.pokemon_species_id = pdn.species_id) AS pokemonName,
        pdn.species_id AS pokemonId
        FROM pokemon_dex_numbers pdn
        WHERE pdn.pokedex_id = ?
        ORDER BY pdn.pokedex_number
        ${limit?`LIMIT ${limit}` : `;`}
    `;

    db.query(query, [pokedexId], (error, results) => {
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
