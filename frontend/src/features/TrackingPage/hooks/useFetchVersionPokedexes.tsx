import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../shared/utils/Auth";
import { PokedexProps } from "../trackingPageTypes";

const useFetchVersionPokedexes = (versionId: string) => {
  const [versionPokedexes, setVersionPokedexes] = useState<PokedexProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchVersionPokedexes = async () => {
      if (versionId) {
        setLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_ENDPOINT
            }/pokedex_versions?version_id=${versionId}`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
              },
              cancelToken: source.token, // Attach cancel token
            }
          );
          setVersionPokedexes(response.data);
          setError(null); // Clear previous errors if there were any
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

    fetchVersionPokedexes();

    return () => {
      source.cancel("Operation cancelled by the user.");
    };
  }, [versionId]);

  return { versionPokedexes, loading, error };
};

export default useFetchVersionPokedexes;
