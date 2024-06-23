import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "./Auth";
import "./PokedexCard.css";

interface PokedexCardProps {
  pokemonId: string;
  versionId: string;
}

interface PokemonDetails {
  name: string;
  nationalId: string;
  types: string;
}

const PokedexCard: React.FC<PokedexCardProps> = ({ pokemonId }) => {
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
    <div className="pokedex-card-container">
      {pokemonDetails.map((pokemon, index) => (
        <div className="pokedex-card-item" key={index}>
          <h1>{pokemon.name}</h1>
          <h2>#{pokemon.nationalId}</h2>
          <img src={`/sprites/pokemon/${pokemon.nationalId}.png`} alt="" />
          <div className="pokedex-card-item-types">
            {pokemon.types.split(",").map((type) => (
              <img
                key={type}
                src={"/images/types/" + type.trim() + ".png"}
                alt={type}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PokedexCard;
