import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EncountersContainer.css";
import PokemonCard from "./PokemonCard";
import { getToken } from "./Auth";

interface EncounterData {
  minLevel: number;
  maxLevel: number;
  pokemonName: string;
  pokemonId: number;
  locationArea: string;
  locationName: string;
  encounterMethod: string;
  encounterRate: string;
  encounterCondition: string;
}

interface EncountersContainerProps {
  versionId: string;
  locationIdentifier: string;
  storedItems: string[];
  handlePokemonClick: (versionId: string, item: number) => void;
  hideCaughtPokemon: boolean;
  handlePokemonRightClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    versionId: String,
    pokemonId: number
  ) => void;
}

const EncountersContainer: React.FC<EncountersContainerProps> = ({
  versionId,
  locationIdentifier,
  storedItems,
  handlePokemonClick,
  handlePokemonRightClick,
  hideCaughtPokemon,
}) => {
  const [encounterDetails, setEncounterDetails] = useState<EncounterData[]>([]);

  // State to control encounters-list-container hiding/showing
  const [expandedLocations, setExpandedLocations] = useState<string[]>([]);

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
          // Assuming response.data is an array of EncounterData
          const data = response.data;

          // Function to modify EncounterData based on conditions
          const updatedData = modifyEncounterData(data);

          // Set state with modified data
          setEncounterDetails(updatedData);

          // Initialize expandedLocations with all locationArea values
          const initialExpanded = updatedData.map(
            (encounter) => encounter.locationArea
          );
          setExpandedLocations(initialExpanded);
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

  // Function to modify EncounterData based on conditions
  const modifyEncounterData = (data: EncounterData[]): EncounterData[] => {
    const modifiedData = [...data];
    for (let i = 0; i < modifiedData.length; i++) {
      for (let j = i + 1; j < modifiedData.length; j++) {
        const encounter1 = modifiedData[i];
        const encounter2 = modifiedData[j];
        if (
          encounter1.locationArea === encounter2.locationArea &&
          encounter1.minLevel === encounter2.minLevel &&
          encounter1.maxLevel === encounter2.maxLevel &&
          encounter1.pokemonName === encounter2.pokemonName &&
          encounter1.encounterMethod === encounter2.encounterMethod &&
          encounter1.encounterRate === encounter2.encounterRate &&
          ((encounter1.encounterCondition.includes("time") &&
            encounter2.encounterCondition.includes("time")) ||
            (encounter1.encounterCondition.includes("season") &&
              encounter2.encounterCondition.includes("season")))
        ) {
          // Merge time-based encounter conditions
          modifiedData[
            i
          ].encounterCondition += ` ${encounter2.encounterCondition}`;

          // Remove encounter2 from modifiedData
          modifiedData.splice(j, 1);
          // Since we removed an element, decrement j to adjust for the new length
          j--;
        }
      }
    }
    return modifiedData;
  };

  // Group encounters by locationArea
  const groupedEncounters = encounterDetails.reduce(
    (
      acc: { locationArea: string; encounters: EncounterData[] }[],
      encounter: EncounterData
    ) => {
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

  const toggleLocationExpansion = (locationArea: string) => {
    if (expandedLocations.includes(locationArea)) {
      setExpandedLocations(
        expandedLocations.filter((loc) => loc !== locationArea)
      );
    } else {
      setExpandedLocations([...expandedLocations, locationArea]);
    }
  };

  // Function to check hideCaughtPokemon and return the style
  const getCaughtStyle = (isCaught: boolean) => {
    return hideCaughtPokemon && isCaught ? { display: "none" } : {};
  };

  return (
    <div className="encounters-container">
      {encounterDetails.length > 0 ? (
        <>
          {groupedEncounters.map((group) => (
            <div key={group.locationArea} className="encounters-list-container">
              <h2
                className="encounters-location-area switzer-bold"
                onClick={() => toggleLocationExpansion(group.locationArea)}
              >
                {group.locationArea !== "" ? group.locationArea : "Area"}
              </h2>
              {expandedLocations.includes(group.locationArea) && (
                <div className="encounters-list">
                  {group.encounters.map((encounter, index) => (
                    <div
                      className={
                        isItemStored(encounter.pokemonId)
                          ? "encounters-item caught"
                          : "encounters-item not-caught"
                      }
                      key={index}
                      onContextMenu={(event) =>
                        handlePokemonRightClick(
                          event,
                          versionId,
                          encounter.pokemonId
                        )
                      }
                      onClick={() =>
                        handlePokemonClick(versionId, encounter.pokemonId)
                      }
                      style={getCaughtStyle(isItemStored(encounter.pokemonId))}
                    >
                      <PokemonCard key={index} encounter={encounter} />
                    </div>
                  ))}
                </div>
              )}
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
