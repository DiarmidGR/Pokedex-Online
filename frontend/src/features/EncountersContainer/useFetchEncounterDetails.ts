import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../shared/utils/Auth";
import { EncounterData } from "./types";

const useFetchEncounterDetails = (
  locationIdentifier: string,
  versionId: string
) => {
  const [encounterDetails, setEncounterDetails] = useState<EncounterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const source = axios.CancelToken.source();

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
            cancelToken: source.token, // Attach cancel token
          }
        );
        setEncounterDetails(response.data);
        setError(null);// Clear previous errors if there were any
      } catch (err: any) {
        if (axios.isCancel(err)){
          console.log('Request cancelled', err.message);
        }else{
          setError(err);
        }
      } finally {
        setLoading(false);
      }
      }
    };

    fetchEncounterDetails();

    return () => {
      source.cancel("Operation cancelled by the user.");
    };
  }, [versionId, locationIdentifier])

  return { encounterDetails, loading, error };
};

export default useFetchEncounterDetails;
