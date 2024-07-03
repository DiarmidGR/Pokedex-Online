const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Get encounter details by version_id and location_identifier
router.get('/encounter-details', (req, res) => {
    const versionId = req.query.version_id;
    const locationIdentifier = req.query.location_identifier;

    if (!versionId || !locationIdentifier) {
        return res.status(400).send({ error: 'version_id and location_identifier are required' });
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

        inner join location_areas la
        on e.location_area_id=la.id

        inner join locations l
        on la.location_id=l.id

        inner join encounter_slots es
        on e.encounter_slot_id=es.id

        inner join encounter_methods em
        on es.encounter_method_id=em.id

        inner join pokemon_species_names psn
        on e.pokemon_id=psn.pokemon_species_id
        
        left join encounter_condition_value_map ecvm
        on e.id=ecvm.encounter_id
        
        where e.version_id = ? and l.identifier=?
        
        group by pokemonId, locationArea, encounterMethod, pokemonName, ecvm.encounter_condition_value_id

        order by encounterMethod, ecvm.encounter_condition_value_id, pokemonId;
    `;

    db.query(query, [versionId, locationIdentifier], (error, results) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.send(results);
    });
});

module.exports=router;
