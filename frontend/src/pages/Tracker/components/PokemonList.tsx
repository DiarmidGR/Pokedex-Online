import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "../styles/PokemonList.css";
import { getToken } from "../../../utils/Auth";

// interface for pokemon data received from api
interface PokemonDetails {
  pokemonName: string;
  pokemonId: number;
}

interface PokemonListProps {
  versionId: string;
  storedItems: string[]; // array of pokemon to display passed to component in TrackingPage
  selectedPokedex: string; // Prop for selected pokedex
  handlePokemonClick: (versionId: string, item: number) => void;
  handlePokemonRightClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    versionId: String,
    pokemonId: number
  ) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({
  storedItems,
  versionId,
  selectedPokedex,
  handlePokemonClick,
  handlePokemonRightClick,
}) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);

  // fetch data from API using selectedPokedex
  useEffect(() => {
    if (storedItems) {
      // Fetch pokedex details from the API
      axiosInstance
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
        <div className={`pokemon-list-container`}>
          <div className="pokemon-list-wrapper">
            {pokemonDetails.map((detail, index) => (
              <div
                className={
                  isItemStored(detail.pokemonId)
                    ? "pokemon-list-item caught"
                    : "pokemon-list-item not-caught"
                }
                key={index}
                onClick={() => handlePokemonClick(versionId, detail.pokemonId)}
                onContextMenu={(event) =>
                  handlePokemonRightClick(event, versionId, detail.pokemonId)
                }
              >
                <img
                  src={`/sprites/pokemon/${detail.pokemonId}.png`}
                  alt=""
                  className="pokemon-details"
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

export default PokemonList;
