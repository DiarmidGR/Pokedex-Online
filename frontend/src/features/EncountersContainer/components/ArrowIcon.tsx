import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface ArrowIconProps {
  hideEncounters: boolean;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ hideEncounters }) => {
  return <FontAwesomeIcon icon={hideEncounters ? faAngleRight : faAngleDown} />;
};

export default ArrowIcon;
