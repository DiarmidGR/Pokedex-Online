import styles from "../PokemonCard.module.css";
import useFetchPokemonEvolutions from "../hooks/useFetchPokemonEvolutions";
import { PokemonEvolutionsProps } from "../PokemonCard.types";
import PokedexItem from "../../PokedexContainer/components/PokedexItem";
import { mapEvolutionToPokemonDetails } from "../pokemonCard.utils";

const PokemonEvolutions: React.FC<PokemonEvolutionsProps> = ({
  pokemonId,
  versionId,
}) => {
  const { evolutionDetails, loading, error } =
    useFetchPokemonEvolutions(pokemonId);

  if (loading) {
    return null;
  }

  if (error) {
    return <div>Error fetching pokémon evolutions: {error.message}</div>;
  }

  return (
    <>
      {evolutionDetails.length > 1 && (
        <div className={styles["evolutionsLayout"]}>
          <h2>{"Evolution Details"}</h2>
          <div className={styles["evolutionsContainer"]}>
            {evolutionDetails.map((item: any, index: any) => (
              <div className={styles["evolutionsItem"]} key={index}>
                <p>{item.pokemonName}</p>
                <PokedexItem
                  pokemon={mapEvolutionToPokemonDetails(item)}
                  versionId={versionId}
                  showHiddenPokemon={true}
                />
                <p>{item.evolutionTriggerDesc}</p>
                {/* Display what level pokemon evolves at if field is not null */}
                <p>{item.evolutionLevel && `Lvl. ${item.evolutionLevel}`}</p>
                <img src={`/sprites/evolution-items/${item.evolutionItem}.png`} style={{"width":"48px"}} alt="" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PokemonEvolutions;
