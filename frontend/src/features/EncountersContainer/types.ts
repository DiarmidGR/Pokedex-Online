export interface EncounterData {
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

export interface EncountersListProps {
    versionId: string;
    locationIdentifier: string;
    storedItems: string[];
    handlePokemonClick: (versionId: string, item: number) => void;
    hideCaughtPokemon: boolean;
    handlePokemonRightClick: (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      pokemonId: number
    ) => void;
}
  
export interface EncounterListGroupProps {
    storedItems: string[];
    encounters: EncounterData[];
    versionId: string;
    locationArea: string;
    handlePokemonRightClick: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        pokemonId: number
    ) => void;
    handlePokemonClick: (versionId: string, item: number) => void;
    hideCaughtPokemon: boolean;
}
