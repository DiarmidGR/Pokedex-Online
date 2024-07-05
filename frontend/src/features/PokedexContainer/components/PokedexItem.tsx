import styles from "./PokedexItem.module.css";

interface PokedexItemProps {
  pokemon: PokemonDetails;
  storedItems?: string[];
  handlePokemonClick?: (versionId: string, item: number) => void;
  handlePokemonRightClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    versionId: String,
    pokemonId: number
  ) => void;
  showHiddenPokemon?: boolean;
  versionId: string;
}

// interface for pokemon data received from api
interface PokemonDetails {
  pokemonName: string;
  pokemonId: number;
}

const PokedexItem: React.FC<PokedexItemProps> = ({
  pokemon,
  storedItems,
  handlePokemonClick,
  handlePokemonRightClick,
  showHiddenPokemon,
  versionId,
}) => {
  // function to check whether a pokemon is stored in localStorage already
  // is used to determine background color of pokedex item
  const isItemStored = (item: number) => {
    let storageString = versionId + "_" + item;

    // Return false if storedItems is undefined
    return storedItems?.includes(storageString) ?? false;
  };

  const darkSprite = () => {
    return (
      <img
        src={`/sprites/pokemon-dark/${pokemon.pokemonId}.png`}
        alt=""
        loading="lazy"
        className={styles["pokemon-sprite"]}
      />
    );
  };

  const normalSprite = () => {
    return (
      <img
        src={`/sprites/pokemon/${pokemon.pokemonId}.png`}
        alt=""
        loading="lazy"
        className={styles["pokemon-sprite"]}
      />
    );
  };

  return (
    <div
      className={`${styles["pokemon-list-item"]} ${
        isItemStored(pokemon.pokemonId)
          ? styles["caught"]
          : styles["not-caught"]
      }`}
      onClick={() => handlePokemonClick?.(versionId, pokemon.pokemonId)}
      onContextMenu={(event) =>
        handlePokemonRightClick?.(event, versionId, pokemon.pokemonId)
      }
    >
      {isItemStored(pokemon.pokemonId)
        ? normalSprite()
        : showHiddenPokemon
        ? normalSprite()
        : darkSprite()}
    </div>
  );
};

export default PokedexItem;
