import "./MenuItem.css";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  gameVersion: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ gameVersion }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/" + gameVersion);
  };

  return (
    <div className="grid-item" onClick={handleClick}>
      <img src={"/thumbnails/" + gameVersion + ".png"} alt={gameVersion} />
    </div>
  );
};

export default MenuItem;
