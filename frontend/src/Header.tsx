import "./Header.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "./utils/Auth";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  // Click handler for home page button
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };
  return (
    <div className="header-container">
      <div className="header-child title">
        <h1 onClick={handleHomeClick}>Poketracker Online</h1>
      </div>
      <div className="header-child login-status">
        {isAuthenticated() ? (
          <p style={{ color: "green" }}>Authenticated</p>
        ) : (
          <p style={{ color: "red" }}>Unauthenticated</p>
        )}
      </div>
    </div>
  );
};

export default Header;
