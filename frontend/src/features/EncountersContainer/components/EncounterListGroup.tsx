import styles from "./EncountersListGroup.module.css";
import { isItemStored, getCaughtStyle } from "../encounterUtils";
import EncounterCard from "./EncounterCard";
import { EncounterListGroupProps } from "../types";

const EncounterListGroup: React.FC<EncounterListGroupProps> = ({
  encounters,
  locationArea,
  storedItems,
  versionId,
  handlePokemonRightClick,
  handlePokemonClick,
  hideCaughtPokemon,
}) => {
  return (
    <div className={styles["list-container"]}>
      <h2 className={styles["encounters-location"]}>
        {locationArea !== "" ? locationArea : "Area"}
      </h2>
      <div className={styles["encounters-list"]}>
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
