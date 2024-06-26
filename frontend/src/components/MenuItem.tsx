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
    <div className="item-container" onClick={handleClick}>
      <img src={`/boxart/${version}.png`} alt="" className="item-image" />
      <div className="item-overlay"></div>
    </div>
  );
};

export default MenuItem;
