// src/components/EncountersContainer.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EncountersContainer.css";

interface EncounterDetail {
  min_level: number;
  max_level: number;
  pokemonName: string;
  pokemonId: string;
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
  const [storedItems, setStoredItems] = useState<string[]>([]);

  useEffect(() => {
    if (locationIdentifier) {
      // Fetch encounter details from the API
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT +
            `encounter-details?version_id=${versionId}&location_identifier=${locationIdentifier}`
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

  useEffect(() => {
    // Load stored items from local storage on component mount
    const stored = JSON.parse(localStorage.getItem("storedItems") || "[]");
    setStoredItems(stored);
  }, []);

  const handlePokemonClick = (item: string) => {
    let storageString = versionId + "_" + item;
    let updatedStoredItems;
    if (storedItems.includes(storageString)) {
      updatedStoredItems = storedItems.filter(
        (storedItem) => storedItem !== storageString
      );
    } else {
      updatedStoredItems = [...storedItems, storageString];
    }
    setStoredItems(updatedStoredItems);
    localStorage.setItem("storedItems", JSON.stringify(updatedStoredItems));
  };

  const isItemStored = (item: string) => {
    let storageString = versionId + "_" + item;
    return storedItems.includes(storageString);
  };

  return (
    <>
      {encounterDetails.length > 0 ? (
        <div className="pokedex-container">
          {encounterDetails.map((detail, index) => (
            <div
              className="pokedex-item"
              key={index}
              style={{
                backgroundColor: isItemStored(detail.pokemonName)
                  ? "#af3049"
                  : "#cfd9e6",
                cursor: "pointer",
              }}
              onClick={() => handlePokemonClick(detail.pokemonName)}
            >
              <p className="pokedex-details">{detail.pokemonName}</p>
              <img
                src={spritesPath + detail.pokemonName.toLowerCase() + ".png"}
                alt=""
                className="pokedex-details"
              />
              <p className="pokedex-details">#{detail.pokemonId}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No encounter details available.</p>
      )}
    </>
  );
};

export default EncountersContainer;
