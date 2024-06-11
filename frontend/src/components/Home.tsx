import data from "../data/game_versions.json";
import MenuItem from "./MenuItem";

interface Data {
  [key: string]: {};
}

const Home: React.FC = () => {
  const myData: Data = data;

  return (
    <div className="grid-container">
      {Object.entries(myData).map(([gameGroup]) => (
        <MenuItem key={gameGroup} gameGroup={gameGroup} />
      ))}
    </div>
  );
};

export default Home;
