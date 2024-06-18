import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EncountersContainer.css";
import { getToken } from "./Auth";
import PokemonCard from "./PokemonCard";

interface EncounterData {
  minLevel: number;
  maxLevel: number;
  pokemonName: string;
  pokemonId: number;
  locationArea: string;
  locationName: string;
  encounterMethod: string;
  encounterRate: string;
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
  const [encounterDetails, setEncounterDetails] = useState<EncounterData[]>([]);

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

  interface EncounterGroup {
    locationArea: string;
    encounters: EncounterData[];
  }

  // Group encounters by locationArea
  const groupedEncounters = encounterDetails.reduce(
    (acc: EncounterGroup[], encounter: EncounterData) => {
      let group = acc.find((g) => g.locationArea === encounter.locationArea);
      if (!group) {
        group = { locationArea: encounter.locationArea, encounters: [] };
        acc.push(group);
      }
      group.encounters.push(encounter);
      return acc;
    },
    []
  );

  return (
    <div className="encounters-container">
      {encounterDetails.length > 0 ? (
        <>
          {groupedEncounters.map((group, index) => (
            <div key={group.locationArea} className="encounters-list-container">
              <h2 className="encounters-location-area">
                {group.locationArea != "" ? group.locationArea : "Area"}
              </h2>
              <div className="encounters-list">
                {group.encounters.map((encounter) => (
                  <div
                    className="encounters-item"
                    key={encounter.pokemonId}
                    style={{
                      backgroundColor: isItemStored(encounter.pokemonId)
                        ? "#af3049"
                        : "#e6f1ff",
                      cursor: "pointer",
                    }}
                    onContextMenu={handleRightClick}
                    onClick={() =>
                      handlePokemonClick(versionId, encounter.pokemonId)
                    }
                  >
                    <PokemonCard key={index} encounter={encounter} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default EncountersContainer;
