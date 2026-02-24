export interface LocationDetails {
    locationIdentifier: string;
    locationName: string;
}

export interface PokedexLocationsProps {
    pokemonId: string;
    versionId: string;
    setSelectedLocation: (location: string) => void;
}

export interface PokemonCardProps {
    pokemonId: string;
    versionId: string;
    setSelectedLocation: (location: string) => void;
    isCaught: boolean;
    handlePokemonRightClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, pokemonId: number) => void;
}

export interface PokemonDetails {
    name: string;
    nationalId: string;
    types: string;
}

export interface EvolutionDetails {
    pokemonName: string;
    pokemonId: number;
    evolutionTrigger: string;
    evolutionTriggerDesc: string;
    evolutionLevel: string;
    evolutionItem: string;
}

export interface PokemonEvolutionsProps {
    pokemonId: string;
    versionId: string;
    handlePokemonRightClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, pokemonId: number) => void;
}