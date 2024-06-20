import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PokedexContainer.css";
import { getToken } from "./Auth";

// interface for pokemon data received from api
interface PokemonDetails {
  pokemonName: string;
  pokemonId: number;
}

interface PokedexContainerProps {
  versionId: string;
  storedItems: string[]; // array of pokemon to display passed to component in TrackingPage
  selectedPokedex: string; // Prop for selected pokedex
  handlePokemonClick: (versionId: string, item: number) => void;
}

const PokedexContainer: React.FC<PokedexContainerProps> = ({
  storedItems,
  versionId,
  selectedPokedex,
  handlePokemonClick,
}) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);
  const spritesPath = "/pokemon-sprites/";

  // fetch data from API using selectedPokedex
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

  return (
    <>
      {pokemonDetails.length > 0 ? (
        <div className={`pokedex-container`}>
          <div className="pokedex-items-wrapper">
            {pokemonDetails.map((detail, index) => (
              <div
                className={
                  isItemStored(detail.pokemonId)
                    ? "pokedex-item caught"
                    : "pokedex-item not-caught"
                }
                key={index}
                onClick={() => handlePokemonClick(versionId, detail.pokemonId)}
              >
                <img
                  src={spritesPath + detail.pokemonId + ".png"}
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
