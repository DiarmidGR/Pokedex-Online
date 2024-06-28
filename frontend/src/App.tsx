import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./features/HomePage/Home";
import Login from "./features/LoginPage/Login";
import { useVersions } from "./features/HomePage/hooks/useVersion";
import { versionRoutes } from "./shared/utils/routes";
import Layout from "./features/Layout/Layout";

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
