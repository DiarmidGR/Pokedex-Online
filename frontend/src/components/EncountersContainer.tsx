import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EncountersContainer.css";
import { getToken } from "./Auth";

interface EncounterDetail {
  min_level: number;
  max_level: number;
  pokemonName: string;
  pokemonId: number;
}

interface EncountersContainerProps {
  versionId: string;
  locationIdentifier: string;
  storedItems: string[];
  handlePokemonClick: (versionId: string, item: number) => void;
}

const EncountersContainer: React.FC<EncountersContainerProps> = ({
  versionId,
  locationIdentifier,
  storedItems,
  handlePokemonClick,
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
          import.meta.env.VITE_API_ENDPOINT +
            `encounter-details?version_id=${versionId}&location_identifier=${locationIdentifier}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
            },
          }
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

  const isItemStored = (item: number) => {
    let storageString = versionId + "_" + item;
    return storedItems.includes(storageString);
  };

  // Right click handler on encounter-item
  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent the default context menu from appearing
  };

  return (
    <>
      {encounterDetails.length > 0 ? (
        <div className="encounters-container">
          {encounterDetails.map((detail, index) => (
            <div
              className="encounters-item"
              key={index}
              style={{
                backgroundColor: isItemStored(detail.pokemonId)
                  ? "#af3049"
                  : "#cfd9e6",
                cursor: "pointer",
              }}
              onContextMenu={handleRightClick}
              onClick={() => handlePokemonClick(versionId, detail.pokemonId)}
            >
              <p className="encounters-details">{detail.pokemonName}</p>
              <img
                src={spritesPath + detail.pokemonId + ".png"}
                alt=""
                className="encounters-details"
              />
              <p className="encounters-details">#{detail.pokemonId}</p>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default EncountersContainer;
