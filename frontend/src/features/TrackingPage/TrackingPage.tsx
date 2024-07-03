import React, { useState, useEffect } from "react";
import styles from "./TrackingPage.module.css";
import LocationDropdown from "./components/LocationDropdown";
import EncountersList from "../EncountersContainer/EncountersList";
import PokedexList from "../PokedexContainer/PokedexList";
import PokedexDropdown from "./components/PokedexDropdown";
import { getToken } from "../../shared/utils/Auth";
import CheckboxComponent from "../../shared/components/Checkbox";
import PokemonCard from "../PokemonCard/PokemonCard";
import useFetchUserPokemon from "./hooks/useFetchUserPokemon";
import useDeleteUserPokemon from "./hooks/useDeleteUserPokemon";
import useInsertUserPokemon from "./hooks/useInsertUserPokemon";

interface TrackingPageProps {
  version_id: string;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ version_id }) => {
  const versionId = version_id;
  const [selectedPokemonId, setSelectedPokemonId] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const versionLastPokedexString = versionId + "_lastPokedexId";
  const lastPokedexId = localStorage.getItem(versionLastPokedexString);
  const [selectedPokedex, setSelectedPokedex] = useState<string>(
    lastPokedexId != null ? lastPokedexId : "1"
  );
  const [hideCaughtPokemon, setHideCaughtPokemon] = useState<boolean>(false); // used for CheckboxComponent and passed to EncountersContainer
  const [showHiddenPokemon, setShowHiddenPokemon] = useState<boolean>(false); // used for CheckboxComponent and passed to PokedexList component
  const { userPokemon, setUserPokemon, loading, error } =
    useFetchUserPokemon(versionId);
  const { deleteUserPokemon } = useDeleteUserPokemon();
  const { insertUserPokemon } = useInsertUserPokemon();

  // Save the selected Pokedex to localStorage
  useEffect(() => {
    localStorage.setItem(versionLastPokedexString, selectedPokedex);
  }, [selectedPokedex]);

  const handlePokemonClick = (versionId: string, pokemonId: number) => {
    const userId = localStorage.getItem("user_id");
    const storageString = versionId + "_" + pokemonId;

    // Add pokemon to database if user is authenticated
    if (getToken() && userId) {
      // Check if pokemon exists in userPokemon collection
      let updatedStoredItems = userPokemon;

      // Item exists, execute delete query
      if (userPokemon.includes(storageString)) {
        deleteUserPokemon(pokemonId, versionId, userId);
        updatedStoredItems = userPokemon.filter(
          (storedItem) => storedItem !== storageString
        );

        // Item doesn't exist, execute insert query
      } else {
        insertUserPokemon(pokemonId, versionId, userId);
        updatedStoredItems = [...userPokemon, storageString];
      }
      setUserPokemon(updatedStoredItems);
    }
    // Handler for unauthenticated users
    else {
      let updatedStoredItems;
      if (userPokemon.includes(storageString)) {
        updatedStoredItems = userPokemon.filter(
          (storedItem) => storedItem !== storageString
        );
      } else {
        updatedStoredItems = [...userPokemon, storageString];
      }
      setUserPokemon(updatedStoredItems);
      localStorage.setItem("storedItems", JSON.stringify(updatedStoredItems));
    }
  };

  const handlePokemonRightClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    versionId: String,
    pokemonId: number
  ) => {
    event.preventDefault();
    console.log(
      `Pokemon with ID ${pokemonId} from version with ID ${versionId} opened in pokedex.`
    );
    let newPokemonId = pokemonId.toString();
    setSelectedPokemonId(newPokemonId);
  };

  const isItemStored = (item: string) => {
    let storageString = versionId + "_" + item;
    return userPokemon.includes(storageString);
  };

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>Error fetching pokémon details: {error.message}</div>;
  }

  return (
    <div className={styles["tracker-container"]}>
      <div className={styles["pokedex-container"]}>
        <PokedexList
          versionId={version_id}
          storedItems={userPokemon}
          selectedPokedex={selectedPokedex}
          handlePokemonClick={handlePokemonClick}
          handlePokemonRightClick={handlePokemonRightClick}
          showHiddenPokemon={showHiddenPokemon}
        />
      </div>
      <div className={styles["controls-container"]}>
        <div className={styles["controls-child"]}>
          <CheckboxComponent
            isChecked={showHiddenPokemon}
            setIsChecked={setShowHiddenPokemon}
          ></CheckboxComponent>
          <p className="switzer-regular">{"Show hidden pokemon?"}</p>
        </div>

        <div className={styles["controls-child"]}>
          <p className="switzer-regular">{"Pokedex"}</p>
          <PokedexDropdown
            versionId={versionId}
            onPokedexChange={setSelectedPokedex}
            defaultIndex={lastPokedexId != null ? lastPokedexId : "1"}
          />
        </div>

        <div className={styles["controls-child"]}>
          <p className="switzer-regular">{"Location"}</p>
          <LocationDropdown
            versionId={version_id}
            onLocationChange={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
        </div>
        <div className={styles["controls-child"]}>
          <CheckboxComponent
            isChecked={hideCaughtPokemon}
            setIsChecked={setHideCaughtPokemon}
          ></CheckboxComponent>
          <p className="switzer-regular">{"Hide caught Pokemon?"}</p>
        </div>
      </div>
      <div className={styles["encounters-layout"]}>
        <div className={styles["encounters-container"]}>
          <EncountersList
            versionId={versionId}
            locationIdentifier={selectedLocation}
            storedItems={userPokemon}
            handlePokemonClick={handlePokemonClick}
            hideCaughtPokemon={hideCaughtPokemon}
            handlePokemonRightClick={handlePokemonRightClick}
          />
        </div>
        <div className={styles["pokemon-container"]}>
          <PokemonCard
            pokemonId={selectedPokemonId}
            versionId={version_id}
            setSelectedLocation={setSelectedLocation}
            isCaught={isItemStored(selectedPokemonId)}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
