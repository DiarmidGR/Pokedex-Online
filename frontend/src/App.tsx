import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { useVersions } from "./pages/Home/hooks/useVersion";
import { versionRoutes } from "./utils/routes";
import Layout from "./components/Layout";

const App: React.FC = () => {
  const versions = useVersions();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {versionRoutes(versions.versions)}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
