import React from "react";
import "./PokemonCard.css";

interface PokemonCardProps {
  encounter: EncounterData;
}

interface EncounterData {
  minLevel: number;
  maxLevel: number;
  pokemonName: string;
  pokemonId: number;
  locationArea: string;
  locationName: string;
  encounterMethod: string;
  encounterRate: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ encounter }) => {
  return (
    <>
      <section className="pokemon-card-name">{encounter.pokemonName}</section>
      <img
        src={"/pokemon-sprites/" + encounter.pokemonId + ".png"}
        alt={encounter.pokemonName}
        className="pokemon-card-image"
      />
      <section>#{encounter.pokemonId}</section>
      <section>Encounter Rate: {encounter.encounterRate}%</section>
      <section>
        Levels: {encounter.minLevel} - {encounter.maxLevel}
      </section>
      <img
        src={"/item-sprites/" + encounter.encounterMethod + ".png"}
        alt=""
        className="pokemon-card-method"
      />
    </>
  );
};

export default PokemonCard;
