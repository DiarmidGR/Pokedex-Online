import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "./Auth";
import "./PokedexLocations.css";

interface PokedexLocationsProps {
  pokemonId: string;
  versionId: string;
  setSelectedLocation: (location: string) => void;
}

interface LocationDetails {
  locationIdentifier: string;
  locationName: string;
}

const PokedexLocations: React.FC<PokedexLocationsProps> = ({
  pokemonId,
  versionId,
  setSelectedLocation,
}) => {
  const [pokemonLocations, setPokemonLocations] = useState<LocationDetails[]>(
    []
  );

  // fetch data from API using pokemonId
  useEffect(() => {
    // dont attempt to fetch data if pokemonId isn't provided
    if (pokemonId !== "") {
      // Fetch pokedex details from the API
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT +
            `pokemon_locations?pokemon_id=${pokemonId}&version_id=${versionId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
            },
          }
        )
        .then((response) => {
          setPokemonLocations(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the pokemon details!",
            error
          );
        });
    }
  }, [pokemonId]);

  // click handler to set selected location to locationName
  const handleClick = (locationName: string) => {
    console.log(locationName);
    setSelectedLocation(locationName);
  };

  return (
    <>
      {pokemonLocations.map((location, index) => (
        <div
          key={index}
          onClick={() => handleClick(location.locationIdentifier)}
          className="pokedex-card-location"
          title="Left click to show location encounters"
        >
          {location.locationName}
        </div>
      ))}
    </>
  );
};

export default PokedexLocations;
