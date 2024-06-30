import styles from "./EncountersList.module.css";
import { isItemStored, getCaughtStyle } from "./encounterUtils";
import EncounterCard from "./EncounterCard";
import { EncounterProps } from "./types";

const EncounterListGroup: React.FC<EncounterProps> = ({
  encounter,
  storedItems,
  versionId,
  handlePokemonRightClick,
  handlePokemonClick,
  hideCaughtPokemon,
}) => {
  return (
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
    >
      <EncounterCard
        encounter={encounter}
        isCaught={isItemStored(storedItems, encounter.pokemonId, versionId)}
      />
    </div>
  );
};

export default EncounterListGroup;
