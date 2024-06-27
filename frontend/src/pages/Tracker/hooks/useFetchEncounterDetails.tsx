import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../utils/Auth";
import { modifyEncounterData } from "../utils/encounterUtils";

interface EncounterDetails {
  minLevel: number;
  maxLevel: number;
  pokemonName: string;
  pokemonId: number;
  locationArea: string;
  locationName: string;
  encounterMethod: string;
  encounterRate: string;
  encounterCondition: string;
}

const useFetchEncounterDetails = (
  location: string,
  versionId: string,
  setExpandedLocations: (locations: string[]) => void
) => {
  const [encounterDetails, setEncounterDetails] = useState<EncounterDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch encounter details from the API
    axios
      .get(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/encounter-details?version_id=${versionId}&location_identifier=${location}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
          },
        }
      )
      .then((response) => {
        // Assuming response.data is an array of EncounterData
        const data = response.data;

        // Function to modify EncounterData based on conditions
        const updatedData = modifyEncounterData(data);

        // Set state with modified data
        setEncounterDetails(updatedData);

        // Initialize expandedLocations with all locationArea values
        const initialExpanded = updatedData.map(
          (encounter: EncounterDetails) => encounter.locationArea
        );
        setExpandedLocations(initialExpanded);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }, [versionId, location]);
  return { encounterDetails, loading, error };
};

export default useFetchEncounterDetails;
