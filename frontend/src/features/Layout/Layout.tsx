import Header from "./Header";
import { Outlet } from "react-router-dom";
import "./Layout.css";

// Define props interface
interface LayoutProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({isDark, toggleTheme}) => {

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
