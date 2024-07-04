import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../../shared/utils/axiosInstance";
import { getToken } from "../../../shared/utils/Auth";
import { LocationDetails } from "../PokemonCard.types";

const useFetchPokemonLocations = (pokemonId:string, versionId:string) => {
    const [pokemonLocations, setPokemonLocations] = useState<LocationDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(()=>{
        const source = axios.CancelToken.source();

        const fetchPokemonLocations = async () => {
            // dont attempt to fetch data if pokemonId isn't provided
            if (pokemonId !== "") {
                setLoading(true);
                try{
                    const response = await axiosInstance.get(
                        `${
                          import.meta.env.VITE_API_ENDPOINT
                        }/pokemon_locations?pokemon_id=${pokemonId}&version_id=${versionId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
                          },
                          cancelToken: source.token, // Attach cancel token
                        }
                    );
                    setPokemonLocations(response.data);
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
        fetchPokemonLocations();

        return () => {
            source.cancel("Operation cancelled by the user.");
        };
    }, [pokemonId, versionId]);

    return {pokemonLocations, loading, error};
};

export default useFetchPokemonLocations;