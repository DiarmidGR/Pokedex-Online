import "./SideNav.css";
import { useNavigate } from "react-router-dom";
import IconButton from "./IconButton";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface SideNavProps {
  version_id: string;
  expandNav: boolean;
}

const SideNav: React.FC<SideNavProps> = ({ version_id, expandNav }) => {
  const versionBannerPath = "/version-banners/" + version_id + ".png";
  // Click handler for home page button
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return expandNav ? (
    <div className="side-nav-container">
      <div className="side-nav-child">
        <IconButton icon={faHome} onClick={handleHomeClick} />
      </div>
    </div>
  ) : (
    <div className="side-nav-container nav-expanded">
      <div className="side-nav-header">
        <img src={versionBannerPath} alt="" className="nav-banner" />
      </div>
      <div className="side-nav-child">
        <IconButton icon={faHome} onClick={handleHomeClick} label="Home" />
      </div>
    </div>
  );
};

export default SideNav;
