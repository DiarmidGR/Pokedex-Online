import React from "react";
import styles from "./EncounterCard.module.css";

interface EncounterCardProps {
  encounter: EncounterData;
  isCaught: boolean;
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

const EncounterCard: React.FC<EncounterCardProps> = ({
  encounter,
  isCaught,
}) => {
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
            src={`/icons/${conditionImages[condition]}`}
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

  const darkSprite = () => {
    return (
      <img
        src="/icons/pokeball-dark.png"
        alt=""
        loading="lazy"
        className={styles["pokeball-icon"]}
      />
    );
  };

  const normalSprite = () => {
    return (
      <img
        src="/icons/pokeball.png"
        alt=""
        loading="lazy"
        className={styles["pokeball-icon"]}
      />
    );
  };

  return (
    <div className={styles["pokemon-card-container"]}>
      {isCaught ? normalSprite() : darkSprite()}
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
              ? "/icons/grass-spots.gif"
              : `/icons/${encounter.encounterMethod}.png`
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
