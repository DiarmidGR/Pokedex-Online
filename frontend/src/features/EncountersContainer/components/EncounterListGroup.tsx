import styles from "./EncountersListGroup.module.css";
import {
  isItemStored,
  getCaughtStyle,
  getUniqueEncounterStats,
} from "../encounterUtils";
import EncounterCard from "./EncounterCard";
import { EncounterListGroupProps } from "../types";
import { useState } from "react";
import ArrowIcon from "./ArrowIcon";

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

  // Data to display # caught pokemon / total pokemon on each header for each locationArea
  const headerData = getUniqueEncounterStats(
    encounters,
    storedItems,
    versionId
  );

  return (
    <div className={styles["list-container"]}>
      <div className={styles["groupHeader"]}>
        <div className={styles["headerArrow"]}>
          <ArrowIcon hideEncounters={hideEncounters} />
        </div>

        <div className={styles["headerStats"]}>
          <img
            // Display coloured in pokeball if all pokemon in location area are caught, otherwise display dark pokeball
            src={
              headerData.uniqueEncountersCount ===
              headerData.uniqueStoredMatchesCount
                ? "icons/pokeball.png"
                : "icons/pokeball-dark.png"
            }
            alt=""
          />
          <p>{
            // Display number of caught pokemon in locationArea to user
            `${headerData.uniqueStoredMatchesCount}/${headerData.uniqueEncountersCount}`
          }</p>
        </div>
        <h2
          className={styles["encounters-location"]}
          // Toggle hideEncounter state, used to hide this EncounterGroupList
          onClick={() => {
            setHideEncounters(!hideEncounters);
          }}
        >
          {locationArea !== "" ? locationArea : "Area"}
        </h2>
      </div>
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
              handlePokemonRightClick(event, encounter.pokemonId)
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
