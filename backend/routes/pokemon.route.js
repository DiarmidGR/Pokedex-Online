const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const redisClient = require('../config/redis.config');

const CACHE_TTL = 3600;

// Get pokemon details by pokemon_id
router.get('/pokemon_details', async (req, res) => {
    const pokemonId = req.query.pokemon_id;

    if (!pokemonId)
    {
        return res.status(400).send({error: 'pokemon_id is required to fetch pokemon details.'})
    };

    const cacheKey = `pokemon_detail:${pokemonId}`;

    try {
        console.log('{/pokemon_details} fetching pokemon details from cache');
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.send(JSON.parse(cached));
        }
    } catch (err) {
        console.error('Redis get error:', err);
    }

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

    try {
        console.log('{/pokemon_details} fetching pokemon details from api');
        const results = await new Promise((resolve, reject) => {
            db.query(query, [pokemonId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        try {
            await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(results));
        } catch (err) {
            console.error('Redis set error:', err);
        }

        res.send(results);
    } catch (error) {
        res.status(500).send({ error: error.message});
    }
});

// Get pokemon locations by pokemon_id and version_id
router.get('/pokemon_locations', async (req, res) => {
    const pokemonId = req.query.pokemon_id;
    const versionId = req.query.version_id;

    if (!pokemonId || !versionId)
    {
        return res.status(400).send({error: 'version_id and pokemon_id is required to fetch pokemon locations.'})
    };

    const cacheKey = `pokemon_location:${pokemonId}:${versionId}`;

        try {
        console.log('{/pokemon_locations} fetching pokemon details from cache');
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.send(JSON.parse(cached));
        }
    } catch (err) {
        console.error('Redis get error:', err);
    }

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

    try {
        console.log('{/pokemon_locations} fetching pokemon location from api');
        const results = await new Promise((resolve, reject) => {
            db.query(query, [versionId, pokemonId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        try {
            await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(results));
        } catch (err) {
            console.error('Redis set error:', err);
        }

        res.send(results);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get pokemon evolutions by pokemon id
router.get('/pokemon_evolutions', async (req, res) => {
    const pokemonId = req.query.pokemon_id;

    if(!pokemonId){
        return res.status(400).send({error:'pokemon_id is required to fetch pokemon evolutions.'})
    };

    const cacheKey = `pokemon_evolutions:${pokemonId}`;

    try {
        console.log('{/pokemon_evolutions} fetching pokemon details from cache');
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.send(JSON.parse(cached));
        }
    } catch (err) {
        console.error('Redis get error:', err);
    }

    const query = `
        SELECT
        psn.name as pokemonName,
        ps.id as pokemonId,
        et.identifier as evolutionTrigger,
        etp.name as evolutionTriggerDesc,
        pe.minimum_level as evolutionLevel
        FROM pokemon_species ps

        INNER JOIN pokemon_species_names psn
        ON psn.pokemon_species_id=ps.id

        LEFT JOIN pokemon_evolution pe
        ON pe.evolved_species_id=ps.id

        LEFT JOIN evolution_triggers et
        ON et.id=pe.evolution_trigger_id

        LEFT JOIN evolution_trigger_prose etp
        ON etp.evolution_trigger_id=et.id

        WHERE evolution_chain_id = (
            SELECT evolution_chain_id
            FROM pokemon_species
            WHERE id = ?
        )
        
        GROUP BY pokemonName, pokemonId, evolutionTrigger, evolutionTriggerDesc, evolutionLevel

        ORDER BY pokemonId
    `;

    try {
        console.log('{/pokemon_evolutions} fetching pokemon details from api');
        const results = await new Promise((resolve, reject) => {
            db.query(query, [pokemonId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        try {
            await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(results));
        } catch (err) {
            console.error('Redis set error:', err);
        }

        res.send(results);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
});

module.exports=router;
