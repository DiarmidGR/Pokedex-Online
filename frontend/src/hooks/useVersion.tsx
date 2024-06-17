import { useState, useEffect } from "react";
import versionsData from "../data/versions.json";

interface Version {
  id: number;
  version_group_id: number;
  identifier: string;
}

export const useVersions = () => {
  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    setVersions(versionsData);
  }, []);

  return versions;
};
