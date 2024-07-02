import { useState, useEffect } from "react";
import "./MenuItem.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../shared/utils/axiosInstance";
import { getToken, isAuthenticated } from "../../../shared/utils/Auth";
import axios from "axios";

interface GameInfo {
  versionName: string;
  dexTotal: number;
  dexProgress: number;
}

interface MenuItemProps {
  version: string;
  versionId: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ version, versionId }) => {
  // Click handler to send user to page for specific game version they clicked on
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/" + version);
  };

  // State used for information fetched from pokemon_db
  const [gameInfo, setGameInfo] = useState<GameInfo[]>([]);

  // Fetch game info from API using versionId
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId !== null) {
      axiosInstance
        .get(
          `${
            import.meta.env.VITE_API_ENDPOINT
          }/version_details?user_id=${userId}&version_id=${versionId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
            },
          }
        )
        .then((response) => {
          setGameInfo(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the version details!",
            error
          );
        });
    } else {
      axios
        .get(
          `${
            import.meta.env.VITE_API_ENDPOINT
          }/version_details?version_id=${versionId}`
        )
        .then((response) => {
          setGameInfo(response.data);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the version details!",
            error
          );
        });
    }
  }, [versionId]);

  return (
    <div className="item-container" onClick={handleClick}>
      <img
        src={`/images/boxart/${version}.png`}
        alt=""
        className="item-image"
      />
      <div className="item-overlay">
        <div className="version-text">
          {gameInfo.length > 0 ? gameInfo[0].versionName : ""}
        </div>
        <div className="version-stats">
          {isAuthenticated() &&
            (gameInfo.length > 0
              ? `${gameInfo[0].dexProgress}/${gameInfo[0].dexTotal}`
              : "")}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
