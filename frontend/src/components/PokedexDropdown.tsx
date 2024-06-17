import React from "react";
import useFetchPokedexes from "../hooks/useFetchPokedexes";
interface PokedexDropdownProps {
  versionId: string;
  defaultIndex: string;
  onPokedexChange: (pokedexId: string) => void;
}

const PokedexDropdown: React.FC<PokedexDropdownProps> = ({
  versionId,
  defaultIndex,
  onPokedexChange,
}) => {
  const { pokedexes, loading, error } = useFetchPokedexes(versionId);

  if (loading) {
    return <div>Loading pokedexes...</div>;
  }

  if (error) {
    return <div>Error fetching pokedexes: {error.message}</div>;
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const pokedexId = event.target.value;
    // Save selected value to localStorage
    const versionLastPokedexString = versionId + "_lastPokedexId";
    localStorage.setItem(versionLastPokedexString, pokedexId);
    onPokedexChange(pokedexId);
  };
  return (
    <div>
      <select
        id="location-select"
        onChange={handleChange}
        className="location-select"
        value={defaultIndex}
      >
        <option value="1">National</option>
        {pokedexes.map((pokedex) => (
          <option key={pokedex.pokedexId} value={pokedex.pokedexId}>
            {pokedex.pokedexName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PokedexDropdown;
