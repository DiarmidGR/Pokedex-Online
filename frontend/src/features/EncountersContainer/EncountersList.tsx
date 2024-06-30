import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EncountersList.module.css";
import EncounterListGroup from "./EncounterListGroup";
import { getToken } from "../../shared/utils/Auth";
import { modifyEncounterData } from "./encounterUtils";
import { EncounterData, EncountersListProps } from "./types";

const EncountersList: React.FC<EncountersListProps> = ({
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
          `${
            import.meta.env.VITE_API_ENDPOINT
          }/encounter-details?version_id=${versionId}&location_identifier=${locationIdentifier}`,
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

  return (
    <>
      {encounterDetails.length > 0 ? (
        <>
          {groupedEncounters.map((group) => (
            <div key={group.locationArea} className={styles["list-container"]}>
              <h2
                className={styles["encounters-location"]}
                onClick={() => toggleLocationExpansion(group.locationArea)}
              >
                {group.locationArea !== "" ? group.locationArea : "Area"}
              </h2>
              {expandedLocations.includes(group.locationArea) && (
                <div className={styles["encounters-list"]}>
                  {group.encounters.map((encounter) => (
                    <EncounterListGroup
                      encounter={encounter}
                      storedItems={storedItems}
                      versionId={versionId}
                      handlePokemonRightClick={handlePokemonRightClick}
                      handlePokemonClick={handlePokemonClick}
                      hideCaughtPokemon={hideCaughtPokemon}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default EncountersList;
