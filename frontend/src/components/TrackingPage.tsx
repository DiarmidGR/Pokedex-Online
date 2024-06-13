import React from "react";
import "./TrackingPage.css";
import LocationDropdown from "./LocationDropdown";
import { useState } from "react";
import EncountersContainer from "./EncountersContainer";
import { useNavigate } from "react-router-dom";

// interface for game region string passed to component (ex: 'rby' or 'gsc')
interface TrackingPageProps {
  version: string;
  version_id: string;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ version_id }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const versionId = version_id;

  // Click handler for home page button
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="tracker-layout">
      <EncountersContainer
        versionId={versionId}
        locationIdentifier={selectedLocation}
      ></EncountersContainer>
      <div className="encounters-nav">
        <div className="encounters-nav-child">
          <button className="home-button" onClick={handleClick}>
            Home
          </button>
        </div>

        <div className="encounters-nav-child">
          <LocationDropdown
            versionId={version_id}
            onLocationChange={setSelectedLocation}
          ></LocationDropdown>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
