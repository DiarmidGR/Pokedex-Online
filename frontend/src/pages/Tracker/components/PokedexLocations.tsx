import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { getToken } from "../../../utils/Auth";
import "../styles/PokedexLocations.css";

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
      axiosInstance
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
  }, [pokemonId, versionId]);

  // change handler to set selected location to locationName
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocation = event.target.value;
    setSelectedLocation(selectedLocation);
  };

  return (
    <select
      onChange={handleChange}
      className="pokedex-dropdown switzer-regular"
    >
      <option value="">Select a location</option>
      {pokemonLocations.map((location, index) => (
        <option key={index} value={location.locationIdentifier}>
          {location.locationName}
        </option>
      ))}
    </select>
  );
};

export default PokedexLocations;
