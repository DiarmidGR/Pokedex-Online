import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useVersions } from "./hooks/useVersion";
import { versionRoutes } from "./utils/routes";
import Layout from "./pages/Layout";

const App: React.FC = () => {
  const versions = useVersions();

  return (
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/" element={<Home />} />
    //     {versionRoutes(versions)}
    //   </Routes>
    // </Router>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {versionRoutes(versions)}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
