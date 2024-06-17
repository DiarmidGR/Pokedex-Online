import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/LocationDropdown.css";
import { getToken } from "../Auth";

interface Pokedex {
  pokedexId: string;
  pokedexName: string;
}

interface PokedexDropdownProps {
  versionId: string;
  onPokedexChange: (pokedexId: string) => void;
}

const PokedexDropdown: React.FC<PokedexDropdownProps> = ({
  versionId,
  onPokedexChange,
}) => {
  const [pokedexes, setPokedexes] = useState<Pokedex[]>([]);
  const [selectedPokedex, setSelectedPokedex] = useState<string>("1");

  useEffect(() => {
    // Fetch pokedexes from the API
    axios
      .get(
        import.meta.env.VITE_API_ENDPOINT +
          `pokedex_versions?version_id=${versionId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
          },
        }
      )
      .then((response) => {
        setPokedexes(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the pokedexes!", error);
      });
  }, [versionId]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const pokedexId = event.target.value;
    setSelectedPokedex(pokedexId);
    onPokedexChange(pokedexId);
  };

  return (
    <div>
      <select
        id="location-select"
        value={selectedPokedex}
        onChange={handleChange}
        className="location-select"
      >
        <option value="1">National</option>
        {pokedexes.map((pokedexes) => (
          <option key={pokedexes.pokedexId} value={pokedexes.pokedexId}>
            {pokedexes.pokedexName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PokedexDropdown;
