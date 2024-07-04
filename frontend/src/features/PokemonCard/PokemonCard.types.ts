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