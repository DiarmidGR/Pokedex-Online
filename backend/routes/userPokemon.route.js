const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const verifyToken = require('../middleware/auth.middleware');
const redis = require('../config/redis.config');

// Get a user's caught pokemon
router.get('/user-pokemon', verifyToken, async (req, res) => {
    const { version_id, user_id } = req.query;

    if (!version_id || !user_id) {
        return res.status(400).send({ error: 'version_id and user_id are required' });
    }

    const cacheKey = `user:${user_id}:version:${version_id}:pokemon`;

    try {
        // Check cache first
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log('Serving from Redis');
            return res.json(JSON.parse(cachedData));
        }

        // If not in cache, query DB
        const query = `
            SELECT pokemon_id
            FROM users_pokemon
            WHERE version_id = ? AND user_id = ?;
        `;

        db.query(query, [version_id, user_id], async (error, results) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }

            // Store in Redis (set TTL = 5 minutes)
            await redis.setEx(cacheKey, 300, JSON.stringify(results));

            console.log('Serving from MySQL + cached');
            res.send(results);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Redis error'});
    }
});

// Insert pokemon in user-pokemon db
router.post('/user-pokemon/insert', verifyToken, async (req, res) => {
    const { pokemon_id, version_id, user_id } = req.body;

    if (!pokemon_id || !version_id) {
        return res.status(400).json({ error: 'pokemon_id and version_id are required' });
    }

    const query = `
      INSERT IGNORE INTO users_pokemon (user_id, pokemon_id, version_id) VALUES (?, ?, ?)`;
    db.query(query, [user_id, pokemon_id, version_id], async (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Invalidate cache
        const cacheKey = `user:${user_id}:version:${version_id}:pokemon`;
        await redis.del(cacheKey);

        res.status(201).json({ message: 'Pokemon added successfully', id: results.insertId });
    });
});

// Delete pokemon in user-pokemon db
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

module.exports = router;
