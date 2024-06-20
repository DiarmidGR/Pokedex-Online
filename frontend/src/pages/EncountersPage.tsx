import React, { useState, useEffect } from "react";
import "./EncountersPage.css";
import LocationDropdown from "../components/LocationDropdown";
import EncountersContainer from "../components/EncountersContainer";
import PokedexContainer from "../components/PokedexContainer";
import PokedexDropdown from "../components/PokedexDropdown";
import { getToken } from "../components/Auth";
import axios from "axios";
import SideNav from "../components/SideNav";
import CheckboxComponent from "../ui/Checkbox";

interface EncountersPageProps {
  version_id: string;
}

interface CaughtPokemonProps {
  pokemon_id: number;
  version_id: number;
}

const EncountersPage: React.FC<EncountersPageProps> = ({ version_id }) => {
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
          const response = await axios.get(
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
      axios
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
      axios
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

  // State to toggle whether to hide caught pokemon or not
  const [hideCaughtPokemon, setHideCaughtPokemon] = useState<boolean>(false);

  //
  useEffect(() => {
    console.log(hideCaughtPokemon);
  }, [hideCaughtPokemon]);

  return (
    <div className="encounters-layout">
      <SideNav version_id={versionId} />
      <div className="encounters-div">
        <PokedexContainer
          versionId={version_id}
          storedItems={storedItems}
          selectedPokedex={selectedPokedex}
          handlePokemonClick={
            getToken() == null
              ? handlePokemonClick
              : handlePokemonClickAuthenticated
          }
        />
        <div className="encounters-controls-container">
          <div className="encounters-controls-child">
            <p className="encounters-controls-child">{"Pokedex"}</p>
            <PokedexDropdown
              versionId={versionId}
              onPokedexChange={setSelectedPokedex}
              defaultIndex={lastPokedexId != null ? lastPokedexId : "1"}
            />
          </div>

          <div className="encounters-controls-child">
            <p className="encounters-controls-child">{"Location"}</p>
            <LocationDropdown
              versionId={version_id}
              onLocationChange={setSelectedLocation}
            />
          </div>
          <div className="encounters-controls-child">
            <CheckboxComponent
              isChecked={hideCaughtPokemon}
              setIsChecked={setHideCaughtPokemon}
            ></CheckboxComponent>
            <p className="encounters-controls-child">
              {"Hide caught Pokemon?"}
            </p>
          </div>
        </div>
        <EncountersContainer
          versionId={versionId}
          locationIdentifier={selectedLocation}
          storedItems={storedItems}
          handlePokemonClick={
            getToken() == null
              ? handlePokemonClick
              : handlePokemonClickAuthenticated
          }
          hideCaughtPokemon={hideCaughtPokemon}
        />
      </div>
    </div>
  );
};

export default EncountersPage;
