import "./MenuItem.css";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  gameGroup: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ gameGroup }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/" + gameGroup);
  };

  return (
    <div className="grid-item" onClick={handleClick}>
      <img src={"/thumbnails/" + gameGroup + ".png"} alt={gameGroup} />
    </div>
  );
};

export default MenuItem;
