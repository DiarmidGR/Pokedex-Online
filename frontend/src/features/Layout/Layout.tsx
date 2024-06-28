import Header from "./Header";
import { Outlet } from "react-router-dom";
import "./Layout.css";

const Layout: React.FC = () => {
  return (
    <div className="layout-wrapper">
      <div className="layout-header layout-child switzer-bold">
        <Header />
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
