const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const redis = require('../config/redis.config');

const CACHE_TTL = 86400 // 24 hours - static data

// Get location identifiers by version_id
router.get('/locations', async (req, res) => {
    const versionId = req.query.version_id;

    if (!versionId) {
        return res.status(400).send({ error: 'version_id is required' });
    }

    const cacheKey = `locations:${versionId}`;

    // Try to fetch data from redis cache first
    try {
        console.log('Querying locations data using Redis cache');
        const cached = await redis.get(cacheKey);
        if (cached) {
            return res.send(JSON.parse(cached));
        }
    } catch (err) {
        console.error('Redis GET error', err.message);
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

    // Query api if redis cache is unavailable
    db.query(query, [versionId], async (error, results) => {
        console.log('Querying locations data using API');
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

module.exports=router;
