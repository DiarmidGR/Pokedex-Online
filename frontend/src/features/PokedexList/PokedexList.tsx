import React, { useEffect, useState } from "react";
import axiosInstance from "../../shared/utils/axiosInstance";
import styles from "./PokedexList.module.css";
import { getToken } from "../../shared/utils/Auth";
import PokedexItem from "./components/PokedexItem";
import PokedexSearch from "./components/PokedexSearch";
import { MoonLoader } from "react-spinners";
import PokedexDropdown from "./components/PokedexDropdown";
import CheckboxComponent from "../../shared/components/Checkbox";

// interface for pokemon data received from api
interface PokemonDetails {
  pokemonName: string;
  pokemonId: number;
}

interface PokedexListProps {
  versionId: string;
  storedItems: string[]; // array of pokemon to display passed to component in TrackingPage
  handlePokemonClick: (versionId: string, item: number) => void;
  handlePokemonRightClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pokemonId: number
  ) => void;
  isDark: boolean;
  onPokemonCountChange?: () => void;
}


const PokedexList: React.FC<PokedexListProps> = ({
  storedItems,
  versionId,
  handlePokemonClick,
  handlePokemonRightClick,
  isDark,
  onPokemonCountChange,
}) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);
  const [filteredPokemonDetails, setFilteredPokemonFetails] = useState<
    PokemonDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const versionLastPokedexString = versionId + "_lastPokedexId";
  const lastPokedexId = localStorage.getItem(versionLastPokedexString);
  const [selectedPokedex, setSelectedPokedex] = useState<string>(
    lastPokedexId != null ? lastPokedexId : "1"
  );

  const showHiddenPokemonKey = versionId + "_showHiddenPokemon";
  const [showHiddenPokemon, setShowHiddenPokemon] = useState<boolean>(() => {
    const storedValue = localStorage.getItem(showHiddenPokemonKey);
    return storedValue !== null ? storedValue === "true" : false;
  }); // used for CheckboxComponent and passed to PokedexList component

  // Save show hidden pokemon preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(showHiddenPokemonKey, showHiddenPokemon.toString());
  }, [showHiddenPokemon, showHiddenPokemonKey]);

  // Save the selected pokedex region to localStorage
  useEffect(() => {
    localStorage.setItem(versionLastPokedexString, selectedPokedex);
  }, [selectedPokedex]);

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

  // Notify parent when pokemon data changes (e.g., pokedex dropdown change)
  useEffect(() => {
    if (onPokemonCountChange) {
      onPokemonCountChange();
    }
  }, [pokemonDetails]);

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

  const pokedexItemsClassName = `${styles["pokedex-items"]} ${isDark ? styles.dark : ""}`;

  if (loading){
    return (
      <div className={pokedexItemsClassName}>
        <div className={styles["pokedex-stats"]}>
          <div className={styles["statsItem"]}>
            {`Pokémon Caught: ${storedItems.length}/${pokemonDetails.length}`}
          </div>


          <div className={styles["statsItem"]}>
            <PokedexSearch onChange={handlePokedexSearchChange} />
          </div>

          {/* Pokedex Selection Dropdown */}
          <div className={styles["statsItem"]}>
            <PokedexDropdown
              versionId={versionId}
              onPokedexChange={setSelectedPokedex}
              defaultIndex={lastPokedexId != null ? lastPokedexId : "1"}
            />
          </div>

          {/* Show uncaught pokemon checkbox */}
          <div className={styles["statsItem"]}>
            <p>Show Hidden Pokemon?</p>
            <CheckboxComponent
              isChecked={showHiddenPokemon}
              setIsChecked={setShowHiddenPokemon}
            >
            </CheckboxComponent>
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
    <div className={pokedexItemsClassName}>
      <div className={styles["pokedex-stats"]}>
        <div className={styles["statsItem"]}>
          {`Pokémon Caught: ${storedItems.length}/${pokemonDetails.length}`}
        </div>


        <div className={styles["statsItem"]}>
          <PokedexSearch onChange={handlePokedexSearchChange} />
        </div>

        {/* Pokedex Selection Dropdown */}
        <div className={styles["statsItem"]}>
          <PokedexDropdown
            versionId={versionId}
            onPokedexChange={setSelectedPokedex}
            defaultIndex={lastPokedexId != null ? lastPokedexId : "1"}
          />
        </div>

        {/* Show uncaught pokemon checkbox */}
        <div className={styles["statsItem"]}>
          <p>Show Hidden Pokemon?</p>
          <CheckboxComponent
            isChecked={showHiddenPokemon}
            setIsChecked={setShowHiddenPokemon}
          >
          </CheckboxComponent>
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
