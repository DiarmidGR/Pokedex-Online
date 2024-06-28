import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import styles from "../styles/PokedexList.module.css";
import { getToken } from "../../../utils/Auth";
import PokedexItem from "./PokedexItem";

// interface for pokemon data received from api
interface PokemonDetails {
  pokemonName: string;
  pokemonId: number;
}

interface PokedexListProps {
  versionId: string;
  storedItems: string[]; // array of pokemon to display passed to component in TrackingPage
  selectedPokedex: string; // Prop for selected pokedex
  handlePokemonClick: (versionId: string, item: number) => void;
  handlePokemonRightClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    versionId: String,
    pokemonId: number
  ) => void;
  showHiddenPokemon: boolean;
}

const PokedexList: React.FC<PokedexListProps> = ({
  storedItems,
  versionId,
  selectedPokedex,
  handlePokemonClick,
  handlePokemonRightClick,
  showHiddenPokemon,
}) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);

  // fetch data from API using selectedPokedex
  useEffect(() => {
    if (storedItems) {
      // Fetch pokedex details from the API
      axiosInstance
        .get(
          `${
            import.meta.env.VITE_API_ENDPOINT
          }/pokedex?version_id=${selectedPokedex}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
            },
          }
        )
        .then((response) => {
          const filteredData = response.data.filter(
            (detail: PokemonDetails) => detail.pokemonName !== null
          );
          setPokemonDetails(filteredData);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the encounter details!",
            error
          );
        });
    }
  }, [selectedPokedex]);

  return (
    <div className={styles["pokemon-list-wrapper"]}>
      {pokemonDetails.map((pokemon, index) => (
        <PokedexItem
          pokemon={pokemon}
          key={index}
          storedItems={storedItems}
          handlePokemonClick={handlePokemonClick}
          handlePokemonRightClick={handlePokemonRightClick}
          showHiddenPokemon={showHiddenPokemon}
          versionId={versionId}
        ></PokedexItem>
      ))}
    </div>
  );
};

export default PokedexList;
