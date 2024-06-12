// src/components/EncountersContainer.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EncountersContainer.css";

interface EncounterDetail {
  min_level: number;
  max_level: number;
  Pokemon: string;
  Method: string;
}

interface EncountersContainerProps {
  versionId: string;
  locationIdentifier: string;
}

const EncountersContainer: React.FC<EncountersContainerProps> = ({
  versionId,
  locationIdentifier,
}) => {
  const [encounterDetails, setEncounterDetails] = useState<EncounterDetail[]>(
    []
  );
  const spritesPath = "/pokemon-sprites/";

  useEffect(() => {
    if (locationIdentifier) {
      // Fetch encounter details from the API
      axios
        .get(
          `http://localhost:3000/encounter-details?version_id=${versionId}&location_identifier=${locationIdentifier}`
        )
        .then((response) => {
          setEncounterDetails(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the encounter details!",
            error
          );
        });
    }
  }, [versionId, locationIdentifier]);

  return (
    <div>
      <h2>Encounter Details</h2>
      {encounterDetails.length > 0 ? (
        <div className="pokedex-container">
          {encounterDetails.map((detail, index) => (
            <div className="pokedex-item" key={index}>
              <p className="pokedex-name">{detail.Pokemon}</p>
              <img src={spritesPath + detail.Pokemon + ".png"} alt="" />
              <p className="pokedex-details">
                Levels: {detail.min_level} - {detail.max_level}
              </p>
              <p className="pokedex-details">{detail.Method}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No encounter details available.</p>
      )}
    </div>
  );
};

export default EncountersContainer;
