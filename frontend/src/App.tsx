import "./App.css";
import data from "./data/pokedex-data.json";
import MenuItem from "./components/MenuItem";

interface Pokemon {
  number: string;
  name: string;
}

interface Region {
  [regionName: string]: Pokemon[];
}

interface DataType {
  [key: string]: Region;
}

const App: React.FC = () => {
  const myData: DataType = data;

  return (
    <div className="grid-container">
      {Object.entries(myData).map(([gameVersion]) => (
        <MenuItem key={gameVersion} gameVersion={gameVersion} />
      ))}
    </div>
  );
};

export default App;
