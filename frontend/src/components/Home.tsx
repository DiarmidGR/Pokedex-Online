import versionsData from "../data/versions.json";
import MenuItem from "./MenuItem";
import { useState, useEffect } from "react";

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
      {versions.map((version) => (
        <MenuItem key={version.id} version={version.identifier} />
      ))}
    </div>
  );
};

export default Home;
