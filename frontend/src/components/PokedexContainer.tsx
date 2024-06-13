import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PokedexContainer.css";

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

  return (
    <>
      {pokemonDetails.length > 0 ? (
        <div className="pokedex-container">
          {pokemonDetails.map((detail, index) => (
            <div
              className="pokedex-item"
              key={index}
              style={{
                backgroundColor: isItemStored(detail.pokemonName)
                  ? "#af3049"
                  : "transparent",
                cursor: "pointer",
              }}
              onClick={() => handlePokemonClick(versionId, detail.pokemonName)}
            >
              <img
                src={spritesPath + detail.pokemonName.toLowerCase() + ".png"}
                alt=""
                className="pokedex-details"
              />
            </div>
          ))}
        </div>
      ) : (
        <p></p>
      )}
    </>
  );
};

export default PokedexContainer;
