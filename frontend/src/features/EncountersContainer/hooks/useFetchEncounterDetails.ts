import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../../shared/utils/Auth";
import { EncounterData } from "../types";
import { modifyEncounterData } from "../encounterUtils";

const useFetchEncounterDetails = (
  locationIdentifier: string,
  versionId: string
) => {
  const [encounterDetails, setEncounterDetails] = useState<EncounterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEncounterDetails = async () => {
    if(locationIdentifier){
      setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/encounter-details?version_id=${versionId}&location_identifier=${locationIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
          },
        }
      );
      // Modify encounters to separate by locationArea, and then set to new encounters
      setEncounterDetails(modifyEncounterData(response.data));
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
    }
  };

  useEffect(() => {
    fetchEncounterDetails();
  }, [versionId, locationIdentifier]);
  return { encounterDetails, loading, error };
};

export default useFetchEncounterDetails;
