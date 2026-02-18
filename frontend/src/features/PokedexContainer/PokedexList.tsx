import React, { useEffect, useState } from "react";
import axiosInstance from "../../shared/utils/axiosInstance";
import styles from "./PokedexList.module.css";
import { getToken } from "../../shared/utils/Auth";
import PokedexItem from "./components/PokedexItem";
import PokedexSearch from "./components/PokedexSearch";
import { MoonLoader } from "react-spinners";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // fetch data from API using selectedPokedex
  useEffect(() => {
    if (storedItems) {
      const fetchPokedexData = async() => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `${import.meta.env.VITE_API_ENDPOINT}/pokedex?pokedex_id=${selectedPokedex}&version_id=${versionId}`,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
              },
            }
          );
          const filteredData = response.data.filter(
            (detail: PokemonDetails) => detail.pokemonName !== null
          );
          setPokemonDetails(filteredData);
          setError(null);
        } catch(err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchPokedexData();
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

  if (loading){
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
          <MoonLoader color="var(--secondary-color)"/>
        </div>
      </div>
    );
  };

  if (error){
    return <div>Data failed to fetch . . .</div>
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
