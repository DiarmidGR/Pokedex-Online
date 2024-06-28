import { useState, useEffect } from "react";
import versionsData from "../data/versions.json";

interface Version {
  id: number;
  version_group_id: number;
  identifier: string;
}

export const useVersions = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        // Simulating data fetching
        setVersions(versionsData);
      } catch (err) {
        setError("Failed to load versions data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersions();
  }, []);

  return { versions, isLoading, error };
};
