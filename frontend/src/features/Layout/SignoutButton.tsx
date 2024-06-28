import { useNavigate } from "react-router-dom";
import { removeToken } from "../../shared/utils/Auth";
import "./SignoutButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

// Define the interface for the props
interface SignoutButtonProps {
  label?: string;
}

const SignoutButton: React.FC<SignoutButtonProps> = ({ label }) => {
  let navigate = useNavigate();

  const handleSignOut = async () => {
    removeToken();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <button onClick={handleSignOut} className="signout-button switzer-regular">
      <FontAwesomeIcon icon={faSignOut} />
      {label && <span>{label}</span>}
    </button>
  );
};

export default SignoutButton;
