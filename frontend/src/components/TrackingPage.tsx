import React from "react";

interface TrackingPageProps {
  gameVersion: string;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ gameVersion }) => {
  console.log(gameVersion);

  return (
    <div>
      <h1>{gameVersion}</h1>
    </div>
  );
};

export default TrackingPage;
