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
      versionId: String,
      pokemonId: number
    ) => void;
}
  
export interface EncounterProps {
    storedItems: string[];
    encounter: EncounterData;
    versionId: string;
    handlePokemonRightClick: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        versionId: string,
        pokemonId: number
    ) => void;
    handlePokemonClick: (versionId: string, item: number) => void;
    hideCaughtPokemon: boolean;
}
