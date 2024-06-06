import "./MenuItem.css";

interface MenuItemProps {
  gameVersion: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ gameVersion }) => {
  return (
    <div className="grid-item">
      <img src={"/thumbnails/" + gameVersion + ".png"} alt={gameVersion} />
    </div>
  );
};

export default MenuItem;
