import styles from "../styles/PokemonCard.module.css";
import PokedexLocations from "./PokedexLocations";
import useFetchPokemonDetails from "../hooks/useFetchPokemonDetails";

interface PokemonCardProps {
  pokemonId: string;
  versionId: string;
  setSelectedLocation: (location: string) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemonId,
  setSelectedLocation,
  versionId,
}) => {
  // Fetch pokemon details from api
  const { pokemonDetails, loading, error } = useFetchPokemonDetails(pokemonId);

  if (loading) {
    return null;
  }

  if (error) {
    return <div>Error fetching pokémon details: {error.message}</div>;
  }

  return (
    <>
      {pokemonDetails.map((pokemon, index) => (
        <div className={styles["pokedex-card-item"]} key={index}>
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
