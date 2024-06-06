import "./App.css";
import data from "./data/dashboard-items.json";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TrackingPage from "./components/TrackingPage";

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
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        {Object.entries(myData).map(([gameVersion]) => (
          <Route
            key={gameVersion}
            path={`/${gameVersion}`}
            element={<TrackingPage gameVersion={gameVersion} />}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
