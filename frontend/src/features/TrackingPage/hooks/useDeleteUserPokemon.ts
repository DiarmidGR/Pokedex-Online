import { useState } from "react";
import axiosInstance from "../../../shared/utils/axiosInstance";
import { getToken } from "../../../shared/utils/Auth";

const useDeleteUserPokemon = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteUserPokemon = async (pokemonId: number, versionId: string, userId: string) => {
        setLoading(true);
        try {
            const token = getToken();

            if (token) {
                await axiosInstance.post(
                    `${import.meta.env.VITE_API_ENDPOINT}/user-pokemon/delete`,
                    {
                        pokemon_id: pokemonId,
                        version_id: versionId,
                        user_id: userId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Pokemon deleted successfully!");
                setError(null);
            } else {
                throw new Error("Unauthorized: Token not found.");
            }
        } catch (err) {
            console.error("Error deleting pokemon: ", err);
            setError("Error deleting pokemon. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return { deleteUserPokemon, loading, error };
};

export default useDeleteUserPokemon;
