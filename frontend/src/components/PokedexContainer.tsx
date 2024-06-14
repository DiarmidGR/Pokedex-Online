import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PokedexContainer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// interface for pokemon data received from api
interface PokemonDetail {
  pokemonName: string;
  pokemonId: number;
}

// interface for versionId property passed on component initialization
interface PokedexContainerProps {
  versionId: string;
  storedItems: string[];
  handlePokemonClick: (versionId: string, item: string) => void;
}

const PokedexContainer: React.FC<PokedexContainerProps> = ({
  versionId,
  storedItems,
  handlePokemonClick,
}) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetail[]>([]);
  const spritesPath = "/pokemon-sprites/";
  const [searchQuery, setSearchQuery] = useState("");

  // State for if PokedexContainer is offscreen or not
  const [isVisible, setIsVisible] = useState(false);

  // Mouse boundary check
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const screenWidth = window.innerWidth;
      const cursorFromRight = screenWidth - event.clientX;

      if (cursorFromRight < 50) {
        setIsVisible(true);
      } else if (cursorFromRight > 0.15 * screenWidth) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // fetch data from API using versionId
  useEffect(() => {
    if (versionId) {
      // Fetch pokedex details from the API
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT + `pokedex?version_id=${versionId}`
        )
        .then((response) => {
          const filteredData = response.data.filter(
            (detail: PokemonDetail) => detail.pokemonName !== null
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
  }, [versionId]);

  // function to check whether a pokemon is stored in localStorage already
  // is used to determine background color of pokedex item
  const isItemStored = (item: string) => {
    let storageString = versionId + "_" + item;
    return storedItems.includes(storageString);
  };

  // Filter the pokemonDetails based on the searchQuery
  const filteredPokemonDetails = pokemonDetails.filter((detail) =>
    detail.pokemonName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {filteredPokemonDetails.length > 0 ? (
        <div className={`pokedex-container ${isVisible ? "visible" : ""}`}>
          <div className="pokedex-search-bar-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search Pokémon"
              value={searchQuery}
              onFocus={() =>
                document.querySelector(".search-icon")?.classList.add("hide")
              }
              onBlur={() =>
                document.querySelector(".search-icon")?.classList.remove("hide")
              }
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pokedex-search-bar"
            />
          </div>
          <div className="pokedex-items-wrapper">
            {filteredPokemonDetails.map((detail, index) => (
              <div
                className="pokedex-item"
                key={index}
                style={{
                  backgroundColor: isItemStored(detail.pokemonName)
                    ? "#af3049"
                    : "transparent",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handlePokemonClick(versionId, detail.pokemonName)
                }
              >
                <img
                  src={spritesPath + detail.pokemonName.toLowerCase() + ".png"}
                  alt=""
                  className="pokedex-details"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </>
  );
};

export default PokedexContainer;
