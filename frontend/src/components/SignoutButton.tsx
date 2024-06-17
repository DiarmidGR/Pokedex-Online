import { useNavigate } from "react-router-dom";
import { removeToken } from "../components/Auth";
import "./SignoutButton.css";

const SignoutButton: React.FC = () => {
  let navigate = useNavigate();
  const handleSignOut = async (e: any) => {
    e.preventDefault();
    removeToken();
    navigate("/login");
  };

  return (
    <button className="signout-button" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignoutButton;
