import "./App.css";
import versionsData from "./data/versions.json";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TrackingPage from "./components/TrackingPage";
import { useState, useEffect } from "react";
import Login from "./components/Login";
//import PrivateRoute from "./components/PrivateRoute";

interface Version {
  id: number;
  version_group_id: number;
  identifier: string;
}

const App: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    // Load versions data
    setVersions(versionsData);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        {versions.map((version) => (
          <Route
            key={version.id}
            path={`/${version.identifier}`}
            element={
              <TrackingPage
                version={version.identifier}
                version_id={version.id.toString()}
              />
            }
          />
        ))}
        {/* <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          {versions.map((version) => (
            <Route
              key={version.id}
              path={`/${version.identifier}`}
              element={
                <TrackingPage
                  version={version.identifier}
                  version_id={version.id.toString()}
                />
              }
            />
          ))}
        </Route> */}
      </Routes>
    </Router>
  );
};

export default App;
