import "./MenuItem.css";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  version: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ version }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/" + version);
  };

  return (
    <img
      src={`/boxart/${version}.png`}
      alt=""
      className="home-item"
      onClick={handleClick}
    />
  );
};

export default MenuItem;
