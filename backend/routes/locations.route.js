const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Get location identifiers by version_id
router.get('/locations', (req, res) => {
    const versionId = req.query.version_id;

    if (!versionId) {
        return res.status(400).send({ error: 'version_id is required' });
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

    db.query(query, [versionId], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        res.send(results);
    });
});

module.exports=router;
