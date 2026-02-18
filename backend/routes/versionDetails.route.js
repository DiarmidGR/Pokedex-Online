const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const verifyToken = require('../middleware/auth.middleware');
const redis = require('../config/redis.config');

const CACHE_TTL = {
    unauthenticated: 60 * 60 * 24, // 24 hours - static data, rarely changes
    authenticated: 60 * 5,         // 5 minutes - user-specific, changes on catches
};

// Middleware to check for user_id and apply verifyToken if present
const checkUserId = (req, res, next) => {
    if (req.query.user_id) {
        verifyToken(req, res, next);
    } else {
        next();
    }
};

// Get game version info for MenuItem component in frontend for AUTHENTICATED users
router.get('/version_details', checkUserId, async (req, res) => {
    const versionId = req.query.version_id;
    const userId = req.query.user_id;

    if(userId)
    {
        if(!versionId || !userId)
        {
            return res.status(400).send({error: 'version_id is required to fetch game details when authenticated.'})
        }

        const cacheKey = `version_details:user:${userId}:version:${versionId}`;

        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.send(JSON.parse(cached));
            }
        } catch (err) {
            console.error('Redis GET error (authenticated):', err.message);
            // non-fatal, fall through to DB
        }

        const query = `
            SELECT vn.name as versionName,
            COUNT(DISTINCT pdn.species_id) as dexTotal,
            COUNT(DISTINCT up.pokemon_id) as dexProgress
            FROM pokedex_version_groups pvg
            INNER JOIN versions v
            ON pvg.version_group_id = v.version_group_id
            INNER JOIN version_names vn
            ON v.id=vn.version_id
            INNER JOIN pokemon_dex_numbers pdn
            ON pvg.pokedex_id=pdn.pokedex_id
            LEFT JOIN users_pokemon up
            ON v.id=up.version_id AND up.user_id=?
            WHERE v.id = ?
            GROUP BY vn.name;
        `;
    
        db.query(query, [userId, versionId], async (error, results) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }

            try {
                await redis.setEx(cacheKey, CACHE_TTL.authenticated, JSON.stringify(results));
            } catch (err) {
                console.error('Redis SET error (authenticated):', err.message);
                // non-fatal, still return results
            }
    
            res.send(results);
        });
    }
    else
    {
        if(!versionId)
        {
            return res.status(400).send({error: 'version_id is required to fetch game details when authenticated.'})
        }

        const cacheKey = `version_details:version${versionId}`;

        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.send(JSON.parse(cached));
            }
        } catch (err) {
            console.error('Redis GET error (unauthenticated):', err.message);
        }

        const query = `
            SELECT vn.name as versionName,
            COUNT(DISTINCT pdn.species_id) as dexTotal
            FROM pokedex_version_groups pvg
            INNER JOIN versions v
            ON pvg.version_group_id = v.version_group_id
            INNER JOIN version_names vn
            ON v.id=vn.version_id
            INNER JOIN pokemon_dex_numbers pdn
            ON pvg.pokedex_id=pdn.pokedex_id
            WHERE v.id = ?
            GROUP BY vn.name;
        `

        db.query(query, [versionId], async (error, results) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }

            try {
                await redis.setEx(cacheKey, CACHE_TTL.unauthenticated, JSON.stringify(results));
            } catch (err) {
                console.error('Redis SET error (unauthenticated):', err.message);
            }

            res.send(results);
        });
    }
    
});

module.exports=router;
