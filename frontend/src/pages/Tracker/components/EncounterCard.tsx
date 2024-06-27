import React from "react";
import styles from "../styles/EncounterCard.module.css";

interface EncounterCardProps {
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

const EncounterCard: React.FC<EncounterCardProps> = ({ encounter }) => {
  // Mapping of encounter condition keywords to image paths
  const conditionImages: { [key: string]: string } = {
    "time-day": "time-day.png",
    "time-morning": "time-morning.png",
    "time-night": "time-night.png",
    "season-winter": "season-winter.png",
    "season-autumn": "season-autumn.png",
    "season-spring": "season-spring.png",
    "season-summer": "season-summer.png",
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
            className={styles["pokemon-card-condition-image"]}
            title={condition}
          />
        );
      } else {
        return <section key={index}>{condition}</section>;
      }
    });

    return (
      <div className={styles["pokemon-card-condition-container"]}>
        {elements}
      </div>
    );
  };

  return (
    <div className={styles["pokemon-card-container"]}>
      <section className={styles["pokemon-card-name"]}>
        {encounter.pokemonName}
      </section>
      <section className={styles["pokemon-card-image"]}>
        <img
          src={`/sprites/pokemon/${encounter.pokemonId}.png`}
          alt={encounter.pokemonName}
          className={styles["pokemon-card-image"]}
        />
        <img
          src={
            encounter.encounterMethod == "grass-spots"
              ? "grass-spots.gif"
              : encounter.encounterMethod + ".png"
          }
          alt=""
          className={styles["pokemon-card-method"]}
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

export default EncounterCard;
