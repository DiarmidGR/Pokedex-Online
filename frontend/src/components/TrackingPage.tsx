import React from "react";
import PokedexData from "../data/pokedex_data.json";
import "./TrackingPage.css";

// interface for game region string passed to component (ex: 'rby' or 'gsc')
interface TrackingPageProps {
  gameGroup: string;
}

// interface for pokemon data stored in regional_pokedex_data.json
interface Pokemon {
  number: string;
  name: string;
}

//interface to access regional dex data imported from regional_pokedex_data.json
interface PokedexData {
  [name: string]: Pokemon[];
}

const TrackingPage: React.FC<TrackingPageProps> = ({ gameGroup }) => {
  const pokedexData: PokedexData = PokedexData as PokedexData;
  const sprites_path = "pokemon-sprites/";

  return (
    <div className="tracker-layout">
      <div className="pokedex-container">
        {pokedexData[gameGroup].map((pokemon) => (
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
      <div className="controls-container">
        <h2>Controls</h2>
        <div className="controls-route"></div>
      </div>
    </div>
  );
};

export default TrackingPage;
