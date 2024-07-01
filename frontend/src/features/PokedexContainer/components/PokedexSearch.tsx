import styles from "./PokedexSearch.module.css";

interface PokedexSearchProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PokedexSearch: React.FC<PokedexSearchProps> = ({ onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search pokédex"
      className={styles["searchPokedex"]}
      onChange={onChange}
    />
  );
};

export default PokedexSearch;
