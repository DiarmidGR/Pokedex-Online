import React, { useEffect, useState } from "react";
import axiosInstance from "../../shared/utils/axiosInstance";
import styles from "./PokedexList.module.css";
import { getToken } from "../../shared/utils/Auth";
import PokedexItem from "./components/PokedexItem";
import PokedexSearch from "./components/PokedexSearch";

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
  const [filteredPokemonDetails, setFilteredPokemonFetails] = useState<
    PokemonDetails[]
  >([]);

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

  // Event handler to filter pokemonDetails data according to search bar contents
  const handlePokedexSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Get user input (pokemon name)
    const searchTerm = event.target.value.toLowerCase();
    const filteredPokemonDetails = pokemonDetails.filter((pokemon) =>
      pokemon.pokemonName.toLowerCase().includes(searchTerm)
    );
    setFilteredPokemonFetails(filteredPokemonDetails);
  };

  return (
    <div className={styles["pokedex-items"]}>
      <div className={styles["pokedex-stats"]}>
        <div className={styles["statsItem"]}>
          {`Pokémon Caught: ${storedItems.length}/${pokemonDetails.length}`}
        </div>
        <div className={styles["statsItem"]}>
          <PokedexSearch onChange={handlePokedexSearchChange} />
        </div>
      </div>

      <div className={styles["pokemon-list-wrapper"]}>
        {
          // display all pokemon if search bar is empty
          (filteredPokemonDetails.length > 0
            ? filteredPokemonDetails
            : pokemonDetails
          ).map((pokemon, index) => (
            <PokedexItem
              pokemon={pokemon}
              key={index}
              storedItems={storedItems}
              handlePokemonClick={handlePokemonClick}
              handlePokemonRightClick={handlePokemonRightClick}
              showHiddenPokemon={showHiddenPokemon}
              versionId={versionId}
            ></PokedexItem>
          ))
        }
      </div>
    </div>
  );
};

export default PokedexList;
