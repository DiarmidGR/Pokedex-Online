import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../utils/Auth";

interface PokemonDetails {
  name: string;
  nationalId: string;
  types: string;
}

const useFetchPokemonDetails = (pokemonId: string) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // fetch data from API using pokemonId
  useEffect(() => {
    // dont attempt to fetch data if pokemonId isn't provided
    if (pokemonId !== "") {
      // Fetch pokedex details from the API
      axios
        .get(
          `${
            import.meta.env.VITE_API_ENDPOINT
          }/pokemon_details?pokemon_id=${pokemonId}`,
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
          setError(error);
        })
        .finally(() => setLoading(false));
    }
  }, [pokemonId]);

  return { pokemonDetails, loading, error };
};

export default useFetchPokemonDetails;
