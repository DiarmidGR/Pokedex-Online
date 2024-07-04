import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../shared/utils/Auth";
import { PokemonDetails } from "../PokemonCard.types";

const useFetchPokemonDetails = (pokemonId: string) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // fetch data from API using pokemonId
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchPokemonDetails = async () => {
      // Don't fetch data if pokemonId is empty
      if (pokemonId !== "") {
        setLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_ENDPOINT
            }/pokemon_details?pokemon_id=${pokemonId}`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
              },
              cancelToken: source.token, // Attach cancel token
            }
          );
          setPokemonDetails(response.data);
          setError(null); // Clear previous erors if there were any
        } catch (err: any) {
          if (axios.isCancel(err)) {
            console.log("Request cancelled", err.message);
          } else {
            setError(err);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPokemonDetails();

    return () => {
      source.cancel("Operation cancelled by the user.");
    };
  }, [pokemonId]);

  return { pokemonDetails, loading, error };
};

export default useFetchPokemonDetails;
