import Header from "./Header";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import { useState,useEffect } from "react";

const Layout: React.FC = () => {
  // Set theme from localStorage, default to false if not found
  const [isDark, setIsDark] = useState(()=>{
    const savedTheme = localStorage.getItem('isDark');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Save to localStorage whenever isDark changes
  useEffect(() => {
    localStorage.setItem('isDark', JSON.stringify(isDark));
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  }
  return (
    <div className={`layout-wrapper ${isDark ? `dark` : `light`}`}>
      <div className="layout-header layout-child switzer-bold">
        <Header toggleTheme={toggleTheme} isDark={isDark}/>
      </div>
      <div className="layout-content layout-child">
        <Outlet />
      </div>
      <div className="layout-footer layout-child switzer-bold">
        © Copyright 2024 Diarmid Rendell. All rights reserved.
      </div>
    </div>
  );
};

export default Layout;
