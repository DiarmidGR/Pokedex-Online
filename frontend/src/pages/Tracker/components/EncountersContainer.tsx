import React, { useState } from "react";
import "../styles/EncountersContainer.css";
import PokemonCard from "./EncounterCard";
import useFetchEncounterDetails from "../hooks/useFetchEncounterDetails";

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

interface EncountersListProps {
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

const EncountersList: React.FC<EncountersListProps> = ({
  versionId,
  locationIdentifier,
  storedItems,
  handlePokemonClick,
  handlePokemonRightClick,
  hideCaughtPokemon,
}) => {
  // State to control encounters-list-container hiding/showing
  const [expandedLocations, setExpandedLocations] = useState<string[]>([]);

  const { encounterDetails, error, loading } = useFetchEncounterDetails(
    versionId,
    locationIdentifier,
    setExpandedLocations
  );

  const isItemStored = (item: number) => {
    let storageString = versionId + "_" + item;
    return storedItems.includes(storageString);
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

  if (loading) {
    return null;
  }

  if (error) {
    return <div>Error fetching encounter details: {error.message}</div>;
  }
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

export default EncountersList;
