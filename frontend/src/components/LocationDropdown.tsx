import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LocationDropdown.css";
import { getToken } from "./Auth";

interface Location {
  identifier: string;
  locationName: string;
}

interface LocationDropdownProps {
  versionId: string;
  onLocationChange: (location: string) => void;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  versionId,
  onLocationChange,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    // Fetch locations from the API
    axios
      .get(
        import.meta.env.VITE_API_ENDPOINT + `locations?version_id=${versionId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // Include JWT token in the headers
          },
        }
      )
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the locations!", error);
      });
  }, [versionId]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const location = event.target.value;
    setSelectedLocation(location);
    onLocationChange(location);
  };

  return (
    <>
      <select
        id="location-select"
        value={selectedLocation}
        onChange={handleChange}
        className="location-select"
      >
        <option value="">Please choose a location</option>
        {locations.map((location) => (
          <option key={location.identifier} value={location.identifier}>
            {location.locationName}
          </option>
        ))}
      </select>
    </>
  );
};

export default LocationDropdown;
