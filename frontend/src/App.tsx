import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./features/HomePage/Home";
import Login from "./features/LoginPage/Login";
import { useVersions } from "./features/HomePage/hooks/useVersion";
import { versionRoutes } from "./shared/utils/routes";
import Layout from "./features/Layout/Layout";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

const App: React.FC = () => {
  const versions = useVersions();

  // Set theme from localStorage, default to false if not found
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('isDark');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem('isDark', JSON.stringify(isDark));
  }, [isDark]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDark((prev: any) => !prev);
  };

  return (
    <div className={`app-wrapper ${isDark ? 'dark' : 'light'}`} style={{ width: "100%" }}>
      <Toaster/>
      <Router>
        <Routes>
          <Route path="/login" element={<Login isDark={isDark} toggleTheme={toggleTheme} />} />
          <Route element={<Layout isDark={isDark} toggleTheme={toggleTheme} />}>
            <Route path="/" element={<Home />} />
            {versionRoutes(versions.versions)}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
