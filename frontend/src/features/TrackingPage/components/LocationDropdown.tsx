import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LocationDropdown.css";
import { getToken } from "../../../shared/utils/Auth";

interface Location {
  identifier: string;
  locationName: string;
}

interface LocationDropdownProps {
  versionId: string;
  onLocationChange: (location: string) => void;
  selectedLocation: string;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  versionId,
  onLocationChange,
  selectedLocation,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    // Fetch locations from the API
    axios
      .get(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/locations?version_id=${versionId}`,
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

  useEffect(() => {
    if (selectedLocation) {
      onLocationChange(selectedLocation);
    }
  }, [selectedLocation, onLocationChange]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const location = event.target.value;
    onLocationChange(location);
  };

  return (
    <>
      <select
        id="location-select"
        value={selectedLocation}
        onChange={handleChange}
        className="location-select switzer-regular"
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
