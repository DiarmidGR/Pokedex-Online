import React from "react";
import styles from "./EncountersList.module.css";
import EncounterListGroup from "./EncounterListGroup";
import { EncounterData, EncountersListProps } from "./types";
import useFetchEncounterDetails from "./hooks/useFetchEncounterDetails";

const EncountersList: React.FC<EncountersListProps> = ({
  versionId,
  locationIdentifier,
  storedItems,
  handlePokemonClick,
  handlePokemonRightClick,
  hideCaughtPokemon,
}) => {
  const { encounterDetails, loading, error } = useFetchEncounterDetails(
    locationIdentifier,
    versionId
  );

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

  if (loading) {
    return null;
  }

  if (error) {
    return <div>{"Error fetching encounter details . . ."}</div>;
  }

  return (
    <>
      {encounterDetails.length > 0 ? (
        <>
          {groupedEncounters.map((group) => (
            <div key={group.locationArea} className={styles["list-container"]}>
              <h2 className={styles["encounters-location"]}>
                {group.locationArea !== "" ? group.locationArea : "Area"}
              </h2>
              <div className={styles["encounters-list"]}>
                {group.encounters.map((encounter, index) => (
                  <EncounterListGroup
                    encounter={encounter}
                    storedItems={storedItems}
                    versionId={versionId}
                    handlePokemonRightClick={handlePokemonRightClick}
                    handlePokemonClick={handlePokemonClick}
                    hideCaughtPokemon={hideCaughtPokemon}
                    key={index}
                  />
                ))}
              </div>
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
