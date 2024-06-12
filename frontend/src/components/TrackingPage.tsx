import React from "react";
import "./TrackingPage.css";
import LocationDropdown from "./LocationDropdown";
import { useState } from "react";
import EncountersContainer from "./EncountersContainer";

// interface for game region string passed to component (ex: 'rby' or 'gsc')
interface TrackingPageProps {
  version: string;
  version_id: string;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ version_id }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const versionId = version_id;
  return (
    <div className="tracker-layout">
      <LocationDropdown
        versionId={version_id}
        onLocationChange={setSelectedLocation}
      ></LocationDropdown>
      <EncountersContainer
        versionId={versionId}
        locationIdentifier={selectedLocation}
      ></EncountersContainer>
    </div>
  );
};

export default TrackingPage;
