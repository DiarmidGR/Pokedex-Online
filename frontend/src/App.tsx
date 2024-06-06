import "./App.css";
import data from "./data/pokedex-data.json";

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
        <div key={gameVersion} className="grid-item">
          <img src={"/thumbnails/" + gameVersion + ".png"} alt="" />
        </div>
      ))}
    </div>
  );
};

export default App;
