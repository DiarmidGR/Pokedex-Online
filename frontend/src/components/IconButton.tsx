// Import necessary modules
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "./IconButton.css";

// Define the interface for the props
interface IconButtonProps {
  icon: IconDefinition;
  onClick: () => void;
  label?: string;
  width?: number;
}

// Define the Button component
const IconButton: React.FC<IconButtonProps> = ({ icon, onClick, label }) => {
  return (
    <>
      {label ? (
        <button onClick={onClick} className={"icon-button-text"}>
          <FontAwesomeIcon icon={icon} />
          {label && <span className="button-label">{label}</span>}
        </button>
      ) : (
        <button onClick={onClick} className={"icon-button"}>
          <FontAwesomeIcon icon={icon} />
          {label && <span className="button-label">{label}</span>}
        </button>
      )}
    </>
  );
};

export default IconButton;
