import React, { useEffect } from "react";
import EncounterListGroup from "./components/EncounterListGroup";
import { EncounterData, EncountersListProps } from "./types";
import useFetchEncounterDetails from "./useFetchEncounterDetails";
import { modifyEncounterData } from "./encounterUtils";
import { ScaleLoader } from "react-spinners";

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

  useEffect(() => {
    modifyEncounterData(encounterDetails);
  }, [encounterDetails]);

  if (loading) {
    return <ScaleLoader color={"var(--primary-dark)"}/>;
  }

  if (error) {
    return <div>{"Error fetching encounter details . . ."}</div>;
  }

  return (
    <>
      {groupedEncounters.map((group, index) => (
        <EncounterListGroup
          encounters={group.encounters}
          locationArea={group.locationArea}
          storedItems={storedItems}
          versionId={versionId}
          handlePokemonRightClick={handlePokemonRightClick}
          handlePokemonClick={handlePokemonClick}
          hideCaughtPokemon={hideCaughtPokemon}
          key={index}
        />
      ))}
    </>
  );
};

export default EncountersList;
