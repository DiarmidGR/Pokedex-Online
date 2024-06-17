import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PokedexContainer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "./Auth";
import PokedexDropdown from "./PokedexDropdown";

// interface for pokemon data received from api
interface PokemonDetails {
  pokemonName: string;
  pokemonId: number;
}

interface PokedexContainerProps {
  versionId: string;
  storedItems: string[]; // array of pokemon to display passed to component in TrackingPage
  handlePokemonClick: (versionId: string, item: number) => void; // Click handler to add / remove pokemon from db storage
}

const PokedexContainer: React.FC<PokedexContainerProps> = ({
  storedItems,
  versionId,
  handlePokemonClick,
}) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);
  const spritesPath = "/pokemon-sprites/";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokedex, setSelectedPokedex] = useState<string>("1");

  // fetch data from API using versionId
  useEffect(() => {
    if (storedItems) {
      // Fetch pokedex details from the API
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT +
            `pokedex?version_id=${selectedPokedex}`,
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

  // function to check whether a pokemon is stored in localStorage already
  // is used to determine background color of pokedex item
  const isItemStored = (item: number) => {
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
        <div className={`pokedex-container`}>
          <PokedexDropdown
            versionId={versionId}
            onPokedexChange={setSelectedPokedex}
          ></PokedexDropdown>
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
                  backgroundColor: isItemStored(detail.pokemonId)
                    ? "#af3049"
                    : "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handlePokemonClick(versionId, detail.pokemonId)}
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
