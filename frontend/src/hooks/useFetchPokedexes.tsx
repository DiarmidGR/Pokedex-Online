import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/Auth";

interface Pokedex {
  pokedexId: string;
  pokedexName: string;
}

const useFetchPokedexes = (versionId: string) => {
  const [pokedexes, setPokedexes] = useState<Pokedex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPokedexes = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_ENDPOINT +
            `pokedex_versions?version_id=${versionId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
            },
          }
        );
        setPokedexes(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokedexes();
  }, [versionId]);

  return { pokedexes, loading, error };
};

export default useFetchPokedexes;
