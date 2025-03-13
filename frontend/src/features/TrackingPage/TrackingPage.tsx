import React, { useState, useEffect } from "react";
import styles from "./TrackingPage.module.css";
import LocationDropdown from "./components/LocationDropdown";
import EncountersList from "../EncountersContainer/EncountersList";
import PokedexList from "../PokedexContainer/PokedexList";
import PokedexDropdown from "./components/PokedexDropdown";
import CheckboxComponent from "../../shared/components/Checkbox";
import PokemonCard from "../PokemonCard/PokemonCard";
import useFetchUserPokemon from "./hooks/useFetchUserPokemon";
import { handleDeletePokemon } from "./trackingPage.utils";
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

  const [isPokemonCardVisible, setIsPokemonCardVisible] = useState<boolean>(false);

  // Save the selected pokedex region to localStorage
  useEffect(() => {
    localStorage.setItem(versionLastPokedexString, selectedPokedex);
  }, [selectedPokedex]);

  // Insert/Delete pokemon from user-pokemon database
  const handlePokemonClick = (versionId: string, pokemonId: number) => {
    let updatedStoredItems = handleDeletePokemon(
      versionId,
      pokemonId,
      userPokemon,
      deleteUserPokemon,
      insertUserPokemon
    );
    if (updatedStoredItems) {
      setUserPokemon(updatedStoredItems);
    }
  };

  // Open pokemon in PokemonCard component
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

    setIsPokemonCardVisible(true);
  };

  // Function to toggle PokemonCard visibility
  const togglePokemonCard = () => {
    setIsPokemonCardVisible((prevState) => !prevState);
  };

  // Function that checks if user has caught a pokemon already or not
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
          {isPokemonCardVisible && (
            <PokemonCard
            pokemonId={selectedPokemonId}
            versionId={version_id}
            setSelectedLocation={setSelectedLocation}
            isCaught={isItemStored(selectedPokemonId)}
            togglePokemonCard={togglePokemonCard}
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
