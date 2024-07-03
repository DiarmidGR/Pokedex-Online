const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const verifyToken = require('../middleware/auth.middleware');

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
        `
    
        db.query(query, [userId, versionId], (error, results) => {
            if (error) {
                return res.status(500).send({ error: error.message });
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

        db.query(query, [versionId], (error, results) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }

            res.send(results);
        });
    }
    
});

module.exports=router;
