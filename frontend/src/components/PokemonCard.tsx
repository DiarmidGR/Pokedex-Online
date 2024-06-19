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
  encounterCondition: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ encounter }) => {
  // Mapping of encounter condition keywords to image paths
  const conditionImages: { [key: string]: string } = {
    "time-day": "/time-icons/time-day.png",
    "time-morning": "/time-icons/time-morning.png",
    "time-night": "/time-icons/time-night.png",
  };

  // Function to render condition images or text if no images are available
  const renderConditionImagesOrText = () => {
    if (
      !encounter.encounterCondition ||
      typeof encounter.encounterCondition !== "string"
    ) {
      return null;
    }

    const conditions = encounter.encounterCondition.split(" ");
    const elements = conditions.map((condition, index) => {
      if (conditionImages[condition]) {
        return (
          <img
            key={index}
            src={conditionImages[condition]}
            alt={condition}
            className="condition-image"
            title={condition}
          />
        );
      } else {
        return <section key={index}>{condition}</section>;
      }
    });

    return <div className="condition-container">{elements}</div>;
  };

  return (
    <div className="pokemon-card-container">
      <section className="pokemon-card-name">{encounter.pokemonName}</section>
      <section className="pokemon-card-image">
        <img
          src={"/pokemon-sprites/" + encounter.pokemonId + ".png"}
          alt={encounter.pokemonName}
          className="pokemon-card-image"
        />
        <img
          src={"/item-sprites/" + encounter.encounterMethod + ".png"}
          alt=""
          className="pokemon-card-method"
          title={encounter.encounterMethod}
        />
      </section>
      <section>#{encounter.pokemonId}</section>
      <section>Rarity: {encounter.encounterRate}%</section>
      <section>
        Levels: {encounter.minLevel} - {encounter.maxLevel}
      </section>
      <section>{renderConditionImagesOrText()}</section>
    </div>
  );
};

export default PokemonCard;
