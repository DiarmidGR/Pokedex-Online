import "./NavButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// Define the interface for the props
interface NavButtonProps {
  icon: IconDefinition;
  onClick: () => void;
  label?: string;
}

const SideNav: React.FC<NavButtonProps> = ({
  icon,
  onClick,
  label,
  ...props
}) => {
  return (
    <button onClick={onClick} {...props} className="nav-button">
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default SideNav;
