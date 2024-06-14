import React from "react";
import "./TrackingPage.css";
import LocationDropdown from "./LocationDropdown";
import { useState, useEffect } from "react";
import EncountersContainer from "./EncountersContainer";
import { useNavigate } from "react-router-dom";
import PokedexContainer from "./PokedexContainer";

// interface for game region string passed to component (ex: 'rby' or 'gsc')
interface TrackingPageProps {
  version: string;
  version_id: string;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ version_id }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const versionId = version_id;

  // State to update both Encounters and Pokedex container items together at the same time
  const [storedItems, setStoredItems] = useState<string[]>([]);

  // Load stored items from local storage on component mount
  useEffect(() => {
    // Load stored items from local storage on component mount
    const stored = JSON.parse(localStorage.getItem("storedItems") || "[]");
    setStoredItems(stored);
  }, []);

  // Click handler for pokemon catch data in both EncountersContainer and PokedexContainer
  const handlePokemonClick = (versionId: string, item: string) => {
    let storageString = versionId + "_" + item;
    let updatedStoredItems;
    if (storedItems.includes(storageString)) {
      updatedStoredItems = storedItems.filter(
        (storedItem) => storedItem !== storageString
      );
    } else {
      updatedStoredItems = [...storedItems, storageString];
    }
    setStoredItems(updatedStoredItems);
    localStorage.setItem("storedItems", JSON.stringify(updatedStoredItems));
  };

  // Click handler for home page button
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="tracker-layout">
      <div className="encounters-nav">
        <div className="encounters-nav-child">
          <button className="home-button" onClick={handleClick}>
            Home
          </button>
        </div>
      </div>

      <PokedexContainer
        versionId={version_id}
        storedItems={storedItems}
        handlePokemonClick={handlePokemonClick}
      ></PokedexContainer>
      <LocationDropdown
        versionId={version_id}
        onLocationChange={setSelectedLocation}
      ></LocationDropdown>
      <EncountersContainer
        versionId={versionId}
        locationIdentifier={selectedLocation}
        storedItems={storedItems}
        handlePokemonClick={handlePokemonClick}
      ></EncountersContainer>
    </div>
  );
};

export default TrackingPage;
