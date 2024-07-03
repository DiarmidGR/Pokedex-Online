import { CaughtPokemonProps } from "./trackingPage.types";
import { getToken } from "../../shared/utils/Auth";

export const convertCaughtPokemonData = (
    listData: CaughtPokemonProps[],
    versionId: string,
): string[] => {
    return listData.map((item) => `${versionId}_${item.pokemon_id}`);
};

export const handleDeletePokemon = (
    versionId: string,
    pokemonId: number,
    userPokemon: string[],
    deleteUserPokemon: Function,
    insertUserPokemon: Function
  ) => {
    const userId = localStorage.getItem("user_id");
    const storageString = versionId + "_" + pokemonId;
    let updatedStoredItems = userPokemon;
  
    // Add pokemon to database if user is authenticated
    if (getToken() && userId) {
      // Item exists, execute delete query
      if (userPokemon.includes(storageString)) {
        deleteUserPokemon(pokemonId, versionId, userId);
        updatedStoredItems = userPokemon.filter(
          (storedItem) => storedItem !== storageString
        );
      } else {
        // Item doesn't exist, execute insert query
        insertUserPokemon(pokemonId, versionId, userId);
        updatedStoredItems = [...userPokemon, storageString];
      }
    } else {
      // Handler for unauthenticated users
      updatedStoredItems = userPokemon.includes(storageString)
        ? userPokemon.filter((storedItem) => storedItem !== storageString)
        : [...userPokemon, storageString];
  
      localStorage.setItem("storedItems", JSON.stringify(updatedStoredItems));
    }
    return updatedStoredItems;
  };
  