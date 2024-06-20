import "./Header.css";
import IconButton from "./components/IconButton";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface HeaderProps {
  expandNav: boolean;
  setExpandNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ expandNav, setExpandNav }) => {
  const handleHomeClick = () => {
    setExpandNav(!expandNav);
  };

  return (
    <div className="header-container">
      <div className="header-child collapse">
        <IconButton icon={faBars} onClick={handleHomeClick}></IconButton>
      </div>
      <div className="header-child title">
        <h1>Poketracker Online by Diarmid</h1>
      </div>
    </div>
  );
};

export default Header;
