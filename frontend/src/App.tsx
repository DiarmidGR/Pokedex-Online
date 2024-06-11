import "./App.css";
import data from "./data/game_versions.json";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TrackingPage from "./components/TrackingPage";

interface Versions {
  versions?: string[];
}

interface Data {
  [key: string]: Versions;
}

const App: React.FC = () => {
  const myData: Data = data;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        {Object.entries(myData).map(([gameGroup]) => (
          <Route
            key={gameGroup}
            path={`/${gameGroup}`}
            element={<TrackingPage gameGroup={gameGroup} />}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
