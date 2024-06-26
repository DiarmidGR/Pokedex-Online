import styles from "./PokemonCard.module.css";
import PokedexLocations from "./components/PokedexLocations";
import useFetchPokemonDetails from "./useFetchPokemonDetails";

interface PokemonCardProps {
  pokemonId: string;
  versionId: string;
  setSelectedLocation: (location: string) => void;
  isCaught: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemonId,
  setSelectedLocation,
  versionId,
  isCaught,
}) => {
  // Fetch pokemon details from api
  const { pokemonDetails, loading, error } = useFetchPokemonDetails(pokemonId);

  const darkSprite = () => {
    return (
      <img
        src="/pokeball-dark.png"
        alt=""
        loading="lazy"
        className={styles["caught-icon"]}
      />
    );
  };

  const normalSprite = () => {
    return (
      <img
        src="/pokeball.png"
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
        </div>
      ))}
    </>
  );
};

export default PokemonCard;
