import { useState } from "react";
import styles from "./PokedexSearch.module.css";

interface PokedexSearchProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PokedexSearch: React.FC<PokedexSearchProps> = ({ onChange }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    onChange(event);
  }

  const handleClearSearch = () => {
    setSearchValue("");
    const event = {
      target: { value: ""}
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  }

  return (
    <div className={styles["search-pokedex-container"]}>
      <div className={styles["search-clear"]} onClick={handleClearSearch}>
        &times;
      </div>
      <input
        type="text"
        placeholder="Search pokédex"
        className={styles["searchPokedex"]}
        value={searchValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default PokedexSearch;
