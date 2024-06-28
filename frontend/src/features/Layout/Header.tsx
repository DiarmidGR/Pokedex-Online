import styles from "./Header.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import SignoutButton from "./SignoutButton";
import { getUsername, getToken } from "../../shared/utils/Auth";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  // Click handler for home page button
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };
  return (
    <header>
      <div className={styles["header-title"]}>
        <h1 onClick={handleHomeClick} title="Return to homepage">
          Pokétracker Online
        </h1>
      </div>
      <div className={styles["header-user"]}>
        {getToken() && <p>Logged in: {getUsername()}</p>}
      </div>
      <div className={styles["header-logout"]}>
        <SignoutButton label="Sign Out" />
      </div>
    </header>
  );
};

export default Header;
