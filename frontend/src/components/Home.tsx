import data from "../data/dashboard-items.json";
import MenuItem from "./MenuItem";

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

const Home: React.FC = () => {
  const myData: DataType = data;

  return (
    <div className="grid-container">
      {Object.entries(myData).map(([gameVersion]) => (
        <MenuItem key={gameVersion} gameVersion={gameVersion} />
      ))}
    </div>
  );
};

export default Home;
