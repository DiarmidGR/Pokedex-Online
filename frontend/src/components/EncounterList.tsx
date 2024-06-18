import PokemonCard from "./PokemonCard";
import "./EncounterList.css";

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

interface EncounterGroup {
  locationArea: string;
  encounters: EncounterData[];
}

interface EncounterListProps {
  encounters: EncounterData[];
}

const PokemonCardList: React.FC<EncounterListProps> = ({ encounters }) => {
  // Group encounters by locationArea
  const groupedEncounters: EncounterGroup[] = encounters.reduce(
    (acc: EncounterGroup[], encounter: EncounterData) => {
      let group = acc.find((g) => g.locationArea === encounter.locationArea);
      if (!group) {
        group = { locationArea: encounter.locationArea, encounters: [] };
        acc.push(group);
      }
      group.encounters.push(encounter);
      return acc;
    },
    []
  );

  return (
    <>
      {groupedEncounters.map((group) => (
        <div>
          <h2>{group.locationArea}</h2>
          <div key={group.locationArea} className="encounters-list">
            {group.encounters.map((encounter) => (
              <PokemonCard key={encounter.pokemonId} encounter={encounter} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default PokemonCardList;
