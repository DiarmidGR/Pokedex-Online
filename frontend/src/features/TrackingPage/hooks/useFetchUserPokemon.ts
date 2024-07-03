import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../../shared/utils/axiosInstance";
import { getToken } from "../../../shared/utils/Auth";
import { convertCaughtPokemonData } from "../trackingPageUtils";

const useFetchUserPokemon = (versionId: string) => {
    const [userPokemon, setUserPokemon] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const source = axios.CancelToken.source();

        const fetchUserPokemon = async () => {
            const token = getToken();
            const userId = localStorage.getItem("user_id");

            // Operations for authenticated users
            setLoading(true);
            if(token&&userId){
                try{
                    const response = await axiosInstance.get(
                        `${
                          import.meta.env.VITE_API_ENDPOINT
                        }/user-pokemon?version_id=${versionId}&user_id=${userId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                          cancelToken: source.token, // Attach cancel token
                        }
                    );
                    setUserPokemon(convertCaughtPokemonData(response.data, versionId))
                    setError(null); // Clear previous errors if there were any
                }catch(err:any){
                    if(axios.isCancel(err)){
                        console.log("Request cancelled", err.message);
                    }else{
                        setError(err);
                    }
                }finally{
                    setLoading(false);
                }
            }else{
                // Operations for unauthenticated users
                const stored = JSON.parse(localStorage.getItem("storedItems") || "[]");
                setUserPokemon(stored);
                setLoading(false);
            }
          };
          fetchUserPokemon();

          return () => {
            source.cancel("Operation cancelled by the user.");
          };
    }, [versionId]);

    return {userPokemon, setUserPokemon, loading, error};
}

export default useFetchUserPokemon;