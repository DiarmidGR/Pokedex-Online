import { useNavigate } from "react-router-dom";
import { removeToken } from "../components/Auth";
import "./SignoutButton.css";
import IconButton from "./IconButton";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

const SignoutButton: React.FC = () => {
  let navigate = useNavigate();

  const handleSignOut = async () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="signout-button">
      <IconButton
        icon={faSignOut}
        onClick={handleSignOut}
        label="Sign out"
      ></IconButton>
    </div>
  );
};

export default SignoutButton;
