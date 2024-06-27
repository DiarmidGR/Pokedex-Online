import React, { useState, useEffect } from "react";
import styles from "./styles/EncountersPage.module.css";
import LocationDropdown from "./components/LocationDropdown";
import EncountersList from "./components/EncountersList";
import PokedexList from "./components/PokedexList";
import PokedexDropdown from "./components/PokedexDropdown";
import { getToken } from "../../utils/Auth";
import CheckboxComponent from "../../ui/Checkbox";
import axiosInstance from "../../utils/axiosInstance";
import PokemonCard from "./components/PokemonCard";

interface TrackingPageProps {
  version_id: string;
}

interface CaughtPokemonProps {
  pokemon_id: number;
  version_id: number;
}

const Tracking: React.FC<TrackingPageProps> = ({ version_id }) => {
  const [selectedPokemonId, setSelectedPokemonId] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const versionId = version_id;

  // State to update both Encounters and Pokedex container items together at the same time
  const [storedItems, setStoredItems] = useState<string[]>([]);

  // State to manage the selected Pokedex
  const versionLastPokedexString = versionId + "_lastPokedexId";
  const lastPokedexId = localStorage.getItem(versionLastPokedexString);
  const [selectedPokedex, setSelectedPokedex] = useState<string>(
    lastPokedexId != null ? lastPokedexId : "1"
  );

  const [hideCaughtPokemon, setHideCaughtPokemon] = useState<boolean>(false); // used for CheckboxComponent and passed to EncountersContainer

  // Save the selected Pokedex to localStorage
  useEffect(() => {
    localStorage.setItem(versionLastPokedexString, selectedPokedex);
  }, [selectedPokedex]);

  // Load stored items from local storage on component mount
  useEffect(() => {
    const fetchStoredItems = async () => {
      // Case for authenticated users
      try {
        const token = getToken();
        const userId = localStorage.getItem("user_id");
        if (token) {
          // Fetch stored items from backend API
          const response = await axiosInstance.get(
            import.meta.env.VITE_API_ENDPOINT +
              `user-pokemon?version_id=${versionId}&user_id=${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setStoredItems(convertCaughtPokemonData(response.data)); // Assuming your API response includes 'storedItems'
        } else {
          // Load stored items from local storage if not authenticated
          const stored = JSON.parse(
            localStorage.getItem("storedItems") || "[]"
          );
          setStoredItems(stored);
        }
      } catch (error) {
        console.error("Error fetching stored items:", error);
      }
    };

    fetchStoredItems();
  }, [versionId]);

  const convertCaughtPokemonData = (
    listData: CaughtPokemonProps[]
  ): string[] => {
    return listData.map((item) => `${version_id}_${item.pokemon_id}`);
  };

  // Click handler for pokemon catch data in both EncountersContainer and PokedexContainer
  const handlePokemonClick = (versionId: string, item: number) => {
    let storageString = versionId + "_" + item;
    let updatedStoredItems;
    if (storedItems.includes(storageString)) {
      updatedStoredItems = storedItems.filter(
        (storedItem) => storedItem !== storageString
      );
    } else {
      updatedStoredItems = [...storedItems, storageString];
    }
    setStoredItems(updatedStoredItems);
    localStorage.setItem("storedItems", JSON.stringify(updatedStoredItems));
  };

  const handlePokemonClickAuthenticated = (
    versionId: string,
    pokemonId: number
  ) => {
    // Check storedItems collection if entry exists
    let storageString = versionId + "_" + pokemonId;
    let updatedStoredItems = storedItems;

    // Item exists, execute delete query
    if (storedItems.includes(storageString)) {
      const userId = localStorage.getItem("user_id");
      axiosInstance
        .post(
          import.meta.env.VITE_API_ENDPOINT + `user-pokemon/delete`,
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
      updatedStoredItems = storedItems.filter(
        (storedItem) => storedItem !== storageString
      );

      // Item doesn't exist, execute insert query
    } else {
      const userId = localStorage.getItem("user_id");
      axiosInstance
        .post(
          import.meta.env.VITE_API_ENDPOINT + `user-pokemon/insert`,
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
      updatedStoredItems = [...storedItems, storageString];
    }
    setStoredItems(updatedStoredItems);
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

  return (
    <div className={styles["tracker-container"]}>
      <div className={styles["pokedex-container"]}>
        <PokedexList
          versionId={version_id}
          storedItems={storedItems}
          selectedPokedex={selectedPokedex}
          handlePokemonClick={
            getToken() == null
              ? handlePokemonClick
              : handlePokemonClickAuthenticated
          }
          handlePokemonRightClick={handlePokemonRightClick}
        />
      </div>
      <div className={styles["controls-container"]}>
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
            storedItems={storedItems}
            handlePokemonClick={
              getToken() == null
                ? handlePokemonClick
                : handlePokemonClickAuthenticated
            }
            hideCaughtPokemon={hideCaughtPokemon}
            handlePokemonRightClick={handlePokemonRightClick}
          />
        </div>
        <div className="pokemon-container">
          <PokemonCard
            pokemonId={selectedPokemonId}
            versionId={version_id}
            setSelectedLocation={setSelectedLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default Tracking;
