import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../utils/Auth";
import styles from "../styles/PokemonCard.module.css";
import PokedexLocations from "./PokedexLocations";

interface PokedexCardProps {
  pokemonId: string;
  versionId: string;
  setSelectedLocation: (location: string) => void;
}

interface PokemonDetails {
  name: string;
  nationalId: string;
  types: string;
}

const PokedexCard: React.FC<PokedexCardProps> = ({
  pokemonId,
  setSelectedLocation,
  versionId,
}) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);

  // fetch data from API using pokemonId
  useEffect(() => {
    // dont attempt to fetch data if pokemonId isn't provided
    if (pokemonId !== "") {
      // Fetch pokedex details from the API
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT +
            `pokemon_details?pokemon_id=${pokemonId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
            },
          }
        )
        .then((response) => {
          setPokemonDetails(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the pokemon details!",
            error
          );
        });
    }
  }, [pokemonId]);

  // Return no component  if pokemon isn't selected
  if (pokemonId === "") {
    return null;
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

export default PokedexCard;
