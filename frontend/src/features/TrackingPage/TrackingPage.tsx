import React, { useState, useEffect } from "react";
import styles from "./TrackingPage.module.css";
import LocationDropdown from "./components/LocationDropdown";
import EncountersList from "../EncountersContainer/EncountersList";
import PokedexList from "../PokedexContainer/PokedexList";
import PokedexDropdown from "./components/PokedexDropdown";
import { getToken } from "../../shared/utils/Auth";
import CheckboxComponent from "../../shared/components/Checkbox";
import axiosInstance from "../../shared/utils/axiosInstance";
import PokemonCard from "../PokemonCard/PokemonCard";
import useFetchUserPokemon from "./hooks/useFetchUserPokemon";

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

  // Save the selected Pokedex to localStorage
  useEffect(() => {
    localStorage.setItem(versionLastPokedexString, selectedPokedex);
  }, [selectedPokedex]);

  // Click handler for pokemon catch data in both EncountersContainer and PokedexContainer
  const handlePokemonClick = (versionId: string, item: number) => {
    let storageString = versionId + "_" + item;
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
  };

  const handlePokemonClickAuthenticated = (
    versionId: string,
    pokemonId: number
  ) => {
    // Check storedItems collection if entry exists
    let storageString = versionId + "_" + pokemonId;
    let updatedStoredItems = userPokemon;

    // Item exists, execute delete query
    if (userPokemon.includes(storageString)) {
      const userId = localStorage.getItem("user_id");
      axiosInstance
        .post(
          `${import.meta.env.VITE_API_ENDPOINT}/user-pokemon/delete`,
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
        )
        .then((response: any) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error(
            "There was an error removing pokemon from the database!",
            error
          );
        });
      updatedStoredItems = userPokemon.filter(
        (storedItem) => storedItem !== storageString
      );

      // Item doesn't exist, execute insert query
    } else {
      const userId = localStorage.getItem("user_id");
      axiosInstance
        .post(
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
        )
        .then((response: any) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error(
            "There was an error inserting pokemon to database!",
            error
          );
        });
      updatedStoredItems = [...userPokemon, storageString];
    }
    setUserPokemon(updatedStoredItems);
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
          handlePokemonClick={
            getToken() == null
              ? handlePokemonClick
              : handlePokemonClickAuthenticated
          }
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
            handlePokemonClick={
              getToken() == null
                ? handlePokemonClick
                : handlePokemonClickAuthenticated
            }
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
