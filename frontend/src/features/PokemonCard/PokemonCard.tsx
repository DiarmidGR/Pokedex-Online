import styles from "./PokemonCard.module.css";
import PokedexLocations from "./components/PokedexLocations";
import useFetchPokemonDetails from "./hooks/useFetchPokemonDetails";
import { PokemonCardProps } from "./PokemonCard.types";
import PokemonEvolutions from "./components/PokemonEvolutions";

const PokemonCard: React.FC<PokemonCardProps & {togglePokemonCard: () => void}> = ({
  pokemonId,
  setSelectedLocation,
  versionId,
  isCaught,
  togglePokemonCard,
}) => {
  // Fetch pokemon details from api
  const { pokemonDetails, loading, error } = useFetchPokemonDetails(pokemonId);

  const darkSprite = () => {
    return (
      <img
        src="/icons/pokeball-dark.png"
        alt=""
        loading="lazy"
        className={styles["caught-icon"]}
      />
    );
  };

  const normalSprite = () => {
    return (
      <img
        src="/icons/pokeball.png"
        alt=""
        loading="lazy"
        className={styles["caught-icon"]}
      />
    );
  };

  if (loading) {
    return null;
  }

  if (error) {
    return <div>Error fetching pokémon details: {error.message}</div>;
  }

  return (
    <>
      {pokemonDetails.map((pokemon, index) => (
        <div
          className={`${styles["pokedex-card-item"]} ${
            isCaught && styles["caught"]
          }`}
          key={index}
        >
          <div className={styles["pokedex-card-item-exit"]} onClick={togglePokemonCard}>
            &times;
          </div>
          {isCaught ? normalSprite() : darkSprite()}
          <h1>{pokemon.name}</h1>
          <h2>#{pokemon.nationalId}</h2>
          <img src={`/sprites/pokemon/${pokemon.nationalId}.png`} alt="" />
          <div className={styles["pokedex-card-item-types"]}>
            {pokemon.types.split(",").map((type) => (
              <img
                key={type}
                src={"/images/types/" + type.trim() + ".png"}
                alt={type}
              />
            ))}
          </div>
          <PokedexLocations
            versionId={versionId}
            pokemonId={pokemonId}
            setSelectedLocation={setSelectedLocation}
          />
          <PokemonEvolutions pokemonId={pokemonId} versionId={versionId} />
        </div>
      ))}
    </>
  );
};

export default PokemonCard;
