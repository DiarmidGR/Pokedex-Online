import { useState } from "react";
import axiosInstance from "../../../shared/utils/axiosInstance";
import { getToken } from "../../../shared/utils/Auth";

const useInsertUserPokemon = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const insertUserPokemon = async (pokemonId: number, versionId: string, userId: string) => {
        setLoading(true);
        try{
            const token = getToken();

            if(token){
                await axiosInstance.post(
                    `${import.meta.env.VITE_API_ENDPOINT}/user-pokemon/insert`,
                    {
                        pokemon_id: pokemonId,
                        version_id: versionId,
                        user_id: userId,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
                        },
                      }
                );
                console.log("Pokemon inserted successfully!");
                setError(null);
            }else{
                throw new Error("Unauthorized: Token not found.");
            }
        }catch(err){
            console.error("Error inserting pokemon: ", err);
            setError("Error inserting pokemon. Please try again.");
        }finally{
            setLoading(false);
        }
    };
    return {insertUserPokemon, loading, error};
};

export default useInsertUserPokemon;