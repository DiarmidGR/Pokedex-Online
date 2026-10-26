import styles from "./Header.module.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SignoutButton from "./SignoutButton";
import { getUsername, getToken } from "../../shared/utils/Auth";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSun, faMoon} from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
}

const Header: React.FC<HeaderProps> = ({toggleTheme, isDark}) => {
  // Click handler for home page button
  const navigate = useNavigate();
  const location = useLocation();
  const [titleSrc, setTitleSrc] = useState<string | null>(null);

  const handleHomeClick = () => {
    navigate("/");
  };

  // Extract version from URL path (e.g., "/alpha-sapphire" -> "alpha-sapphire")
  useEffect(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    // If URL is like "/alpha-sapphire" or "/alpha-sapphire/something", use the first segment
    if (pathParts.length > 0) {
      const versionIdentifier = pathParts[0];
      const imageSrc = `/images/titles/${versionIdentifier}.png`;
      // Check if the image exists by attempting to load it
      const img = new Image();
      img.onload = () => setTitleSrc(imageSrc);
      img.onerror = () => setTitleSrc(null);
      img.src = imageSrc;
    } else {
      setTitleSrc(null);
    }
  }, [location.pathname]);

  return (
    <header>
      <div className={styles["header-title"]}>
        <h1 onClick={handleHomeClick} title="Return to homepage" className={styles["title-with-image"]}>
          Pokétracker Online
          {titleSrc && <img src={titleSrc} alt="" className={styles["title-image"]} />}
        </h1>
      </div>
      <div className={styles["header-right"]}>

        <div className={styles["header-user"]}>
          {getToken() && <p>Logged in: {getUsername()}</p>}
        </div>

        <div className={styles["header-dark-toggle"]}>
          <button 
            className={styles["toggle-button"]} 
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <FontAwesomeIcon icon={isDark?faSun:faMoon}/>
          </button>
        </div>
        
      </div>
      
      <div className={styles["header-logout"]}>
        <SignoutButton label={getToken() ? "Sign Out" : "Authenticate"} />
      </div>
      
    </header>
  );
};

export default Header;
