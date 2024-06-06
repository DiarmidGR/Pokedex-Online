import React from "react";
import RegionalDexData from "../data/regional_pokedex_data.json";
import "./TrackingPage.css";

// interface for game region string passed to component (ex: 'rby' or 'gsc')
interface TrackingPageProps {
  gameVersion: string;
}

// interface for pokemon data stored in regional_pokedex_data.json
interface Pokemon {
  number: string;
  name: string;
}

//interface to access regional dex data imported from regional_pokedex_data.json
interface Region {
  [regionName: string]: Pokemon[];
}

const TrackingPage: React.FC<TrackingPageProps> = ({ gameVersion }) => {
  const data: Region = RegionalDexData as Region;
  const sprites_path = "pokemon-sprites/";

  return (
    <div className="tracker-layout">
      <div className="pokedex-container">
        {data[gameVersion].map((pokemon) => (
          <div key={pokemon.number} className="pokedex-item">
            <p className="pokemon-name">{pokemon.name}</p>
            <p className="pokemon-number">{pokemon.number}</p>
            <img
              src={
                sprites_path +
                pokemon.name
                  .toString()
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace("♂", "f")
                  .replace("♀", "m")
                  .replace(".", "") +
                ".png"
              }
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingPage;
