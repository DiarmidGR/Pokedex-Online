import versionsData from "../data/versions.json";
import MenuItem from "../components/MenuItem";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../components/Auth";
import "./Home.css";

interface Version {
  id: number;
  version_group_id: number;
  identifier: string;
}

const Home: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);

  let navigate = useNavigate();
  const handleSignOut = async (e: any) => {
    e.preventDefault();
    removeToken();
    navigate("/login");
  };

  useEffect(() => {
    // Load versions data
    setVersions(versionsData);
  }, []);

  return (
    <div className="grid-container">
      <button className="signout-button" onClick={handleSignOut}>
        Sign Out
      </button>
      {versions.map((version) => (
        <MenuItem key={version.id} version={version.identifier} />
      ))}
    </div>
  );
};

export default Home;
