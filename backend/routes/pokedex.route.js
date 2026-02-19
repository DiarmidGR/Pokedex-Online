const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const redis = require('../config/redis.config');

const CACHE_TTL = 86400 // 24 hours - static data

// Get pokedex by pokedex_id
router.get('/pokedex', async (req, res) => {
    const pokedexId = req.query.pokedex_id;
    const versionId = req.query.version_id;

    // Ghetto method of limiting national dex based on the version
    let limit;
    switch(versionId){
        case '1':
        case '2':
        case '3':
            limit=151;
            break;
        case '4':
        case '5':
        case '5':
            limit=251;
            break;
        case '7':
        case '8':
        case '9':
        case '10':
        case '11':
            limit=386;
            break;
        case '12':
        case '13':
        case '14':
        case '15':
        case '16':
        case '37':
        case '38':
            limit=493;
            break;
        case '17':
        case '18':
        case '21':
        case '22':
        case '16':
            limit=649;
            break;
        case '23':
        case '24':
        case '25':
        case '26':
            limit=721;
            break;
        case '27':
        case '28':
        case '29':
        case '30':
            limit=809;
            break;
        case '27':
        case '28':
        case '29':
        case '30':
            limit=905;
            break;
        default:
            limit=null;
    }

    if (!pokedexId || !versionId) {
        return res.status(400).send({ error: 'pokedex_id and version_id is required' });
    }

    const cacheKey = `pokedex:${pokedexId}:${versionId}`;

    // Try to fetch data from redis cache first
    try {
        const cached = await redis.get(cacheKey);
        if (cached) {
            return res.send(JSON.parse(cached));
        }
    } catch (err) {
        console.error('Redis GET error', err.message);
    }

    const query = `
        SELECT (SELECT psn.name FROM pokemon_species_names psn WHERE psn.pokemon_species_id = pdn.species_id) AS pokemonName,
        pdn.species_id AS pokemonId
        FROM pokemon_dex_numbers pdn
        WHERE pdn.pokedex_id = ?
        ORDER BY pdn.pokedex_number
        ${limit?`LIMIT ${limit}` : `;`}
    `;

    // Query API if redis cache is unavailable

    db.query(query, [pokedexId], async (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        try {
            await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(results));
        } catch (err) {
            console.error('Redis SET error:', err.message);
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
