import React from "react";
import "./TrackingPage.css";
import LocationDropdown from "./LocationDropdown";
import { useState, useEffect } from "react";
import EncountersContainer from "./EncountersContainer";
import { useNavigate } from "react-router-dom";
import PokedexContainer from "./PokedexContainer";
import { getToken } from "./Auth";
import axios from "axios";

// interface for game region string passed to component (ex: 'rby' or 'gsc')
interface TrackingPageProps {
  version: string;
  version_id: string;
}

interface CaughtPokemonProps {
  pokemon_id: number;
  version_id: number;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ version_id }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const versionId = version_id;

  // State to update both Encounters and Pokedex container items together at the same time
  const [storedItems, setStoredItems] = useState<string[]>([]);

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

  // Click handler for home page button
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="tracker-layout">
      <div className="encounters-nav">
        <div className="encounters-nav-child">
          <button className="home-button" onClick={handleClick}>
            Home
          </button>
        </div>
      </div>
      <PokedexContainer
        versionId={version_id}
        storedItems={storedItems}
        handlePokemonClick={
          getToken() == null
            ? handlePokemonClick
            : handlePokemonClickAuthenticated
        }
      ></PokedexContainer>
      <LocationDropdown
        versionId={version_id}
        onLocationChange={setSelectedLocation}
      ></LocationDropdown>
      <EncountersContainer
        versionId={versionId}
        locationIdentifier={selectedLocation}
        storedItems={storedItems}
        handlePokemonClick={
          getToken() == null
            ? handlePokemonClick
            : handlePokemonClickAuthenticated
        }
      ></EncountersContainer>
    </div>
  );
};

export default TrackingPage;
