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
}

export interface PokemonEvolutionsProps {
    pokemonId: string;
    versionId: string;
}