import "./Header.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import SignoutButton from "../ui/SignoutButton";

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
        <h1 onClick={handleHomeClick} title="Return to homepage">
          Pokétracker Online
        </h1>
      </div>
      <div className="header-child">
        <SignoutButton label="Sign Out" />
      </div>
    </div>
  );
};

export default Header;
