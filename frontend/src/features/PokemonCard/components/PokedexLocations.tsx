import "./PokedexLocations.css";
import useFetchPokemonLocations from "../hooks/useFetchPokemonLocations";
import { PokedexLocationsProps } from "../PokemonCard.types";

const PokedexLocations: React.FC<PokedexLocationsProps> = ({
  pokemonId,
  versionId,
  setSelectedLocation,
}) => {
  const { pokemonLocations, loading, error } = useFetchPokemonLocations(
    pokemonId,
    versionId
  );

  // change handler to set selected location to locationName
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocation = event.target.value;
    setSelectedLocation(selectedLocation);
  };

  if (loading) {
    return null;
  }

  if (error) {
    return <div>Error fetching pokémon locations: {error.message}</div>;
  }

  return pokemonLocations.length > 0 ? (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>{"Locations"}</h2>
      <select onChange={handleChange} className="pokedex-dropdown">
        <option value="">Select a location</option>
        {pokemonLocations.map((location, index) => (
          <option key={index} value={location.locationIdentifier}>
            {location.locationName}
          </option>
        ))}
      </select>
    </div>
  ) : (
    <h2>{"Locations unavailable"}</h2>
  );
};

export default PokedexLocations;
