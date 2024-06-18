import versionsData from "../data/versions.json";
import MenuItem from "../components/MenuItem";
import { useState, useEffect } from "react";
import "./Home.css";
import SignoutButton from "../components/SignoutButton";

interface Version {
  id: number;
  version_group_id: number;
  identifier: string;
}

const Home: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    // Load versions data
    setVersions(versionsData);
  }, []);

  return (
    <div className="grid-container">
      <SignoutButton></SignoutButton>
      {versions.map((version) => (
        <MenuItem key={version.id} version={version.identifier} />
      ))}
    </div>
  );
};

export default Home;
