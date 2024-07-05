import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../shared/utils/Auth";
import { EvolutionDetails } from "../PokemonCard.types";

const useFetchPokemonEvolutions = (pokemonId: string) => {
    const [evolutionDetails, setEvolutionDetails] = useState<EvolutionDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const source = axios.CancelToken.source();

        const fetchPokemonEvolutions = async() => {
            // Only fetch if pokemonId is not empty
            if(pokemonId !== ""){
                setLoading(true);
                try{
                    const response = await axios.get(
                        `${
                          import.meta.env.VITE_API_ENDPOINT
                        }/pokemon_evolutions?pokemon_id=${pokemonId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
                          },
                          cancelToken: source.token, // Attach cancel token
                        }
                      );
                      setEvolutionDetails(response.data);
                      setError(null); // Clear previous errors if there were any
                }catch(err:any){
                    if(axios.isCancel(err)){
                        console.log("Request cancelled ", err.message);
                    }else{
                        setError(err);
                    }
                }finally{
                    setLoading(false);
                }
            }
        };
        fetchPokemonEvolutions();

        return () => {
            source.cancel("Operation cancelled by the user.");
        };
    }, [pokemonId]);

    return {evolutionDetails, loading, error};
}

export default useFetchPokemonEvolutions;