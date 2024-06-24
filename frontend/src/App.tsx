import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useVersions } from "./hooks/useVersion";
import { versionRoutes } from "./utils/routes";

const App: React.FC = () => {
  const versions = useVersions();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        {versionRoutes(versions)}
      </Routes>
    </Router>
  );
};

export default App;
