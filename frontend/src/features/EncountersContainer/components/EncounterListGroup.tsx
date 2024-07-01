import styles from "./EncountersListGroup.module.css";
import { isItemStored, getCaughtStyle } from "../encounterUtils";
import EncounterCard from "./EncounterCard";
import { EncounterListGroupProps } from "../types";
import { useState } from "react";

const EncounterListGroup: React.FC<EncounterListGroupProps> = ({
  encounters,
  locationArea,
  storedItems,
  versionId,
  handlePokemonRightClick,
  handlePokemonClick,
  hideCaughtPokemon,
}) => {
  // Constant to toggle this EncounterListGroup's height, used to hide group when user clicks
  const [hideEncounters, setHideEncounters] = useState(false);
  return (
    <div className={styles["list-container"]}>
      <h2
        className={styles["encounters-location"]}
        // Toggle hideEncounter state, used to hide this EncounterGroupList
        onClick={() => {
          setHideEncounters(!hideEncounters);
        }}
      >
        {locationArea !== "" ? locationArea : "Area"}
      </h2>
      <div
        // Change classname depending on hideEncounters status, hides div if true
        className={`${styles["encounters-list"]} ${
          hideEncounters ? styles["closed"] : styles["open"]
        }`}
      >
        {encounters.map((encounter, index) => (
          <div
            className={`${styles["encounters-item"]} ${
              isItemStored(storedItems, encounter.pokemonId, versionId)
                ? styles["caught"]
                : styles["not-caught"]
            }`}
            onContextMenu={(event) =>
              handlePokemonRightClick(event, versionId, encounter.pokemonId)
            }
            onClick={() => handlePokemonClick(versionId, encounter.pokemonId)}
            style={getCaughtStyle(
              isItemStored(storedItems, encounter.pokemonId, versionId),
              hideCaughtPokemon
            )}
            key={index}
          >
            <EncounterCard
              encounter={encounter}
              isCaught={isItemStored(
                storedItems,
                encounter.pokemonId,
                versionId
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EncounterListGroup;
