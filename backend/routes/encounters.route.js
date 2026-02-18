const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const redisClient = require('../config/redis.config');

const CACHE_TTL = 3600;

router.get('/encounter-details', async (req, res) => {
    const versionId = req.query.version_id;
    const locationIdentifier = req.query.location_identifier;

    if (!versionId || !locationIdentifier) {
        return res.status(400).send({ error: 'version_id and location_identifier are required' });
    }

    const cacheKey = `encounter:${versionId}:${locationIdentifier}`;

    try {
        console.log('fetching from cache');
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.send(JSON.parse(cached));
        }
    } catch (err) {
        console.error('Redis get error:', err);
    }

    const query = `
        select e.pokemon_id as pokemonId, 
        psn.name as pokemonName, 
        min(min_level) as minLevel, 
        max(max_level) as maxLevel, 
        la.identifier as locationArea, 
        l.identifier as locationName, 
        em.identifier as encounterMethod, 
        sum(es.rarity) as encounterRate,
        (select ecv.identifier from encounter_condition_values ecv where ecv.id=ecvm.encounter_condition_value_id) as encounterCondition
        from encounters e
        inner join location_areas la on e.location_area_id=la.id
        inner join locations l on la.location_id=l.id
        inner join encounter_slots es on e.encounter_slot_id=es.id
        inner join encounter_methods em on es.encounter_method_id=em.id
        inner join pokemon_species_names psn on e.pokemon_id=psn.pokemon_species_id
        left join encounter_condition_value_map ecvm on e.id=ecvm.encounter_id
        where e.version_id = ? and l.identifier=?
        group by pokemonId, locationArea, encounterMethod, pokemonName, ecvm.encounter_condition_value_id
        order by encounterMethod, ecvm.encounter_condition_value_id, pokemonId;
    `;

    try {
        console.log('fetching from api');
        // Wrap db.query in a Promise so we can use await
        const results = await new Promise((resolve, reject) => {
            db.query(query, [versionId, locationIdentifier], (error, results) => {
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

module.exports = router;