import React from "react";
import "./PokedexDropdown.css";
import useFetchVersionPokedexes from "../hooks/useFetchVersionPokedexes";

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
  const { versionPokedexes, loading, error } =
    useFetchVersionPokedexes(versionId);

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
        onChange={handleChange}
        className="pokedex-select-dropdown switzer-regular"
        value={defaultIndex}
      >
        <option value="">Please choose a Pokédex</option>
        <option value="1">National</option>
        {versionPokedexes.map((pokedex) => (
          <option key={pokedex.pokedexId} value={pokedex.pokedexId}>
            {pokedex.pokedexName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PokedexDropdown;
