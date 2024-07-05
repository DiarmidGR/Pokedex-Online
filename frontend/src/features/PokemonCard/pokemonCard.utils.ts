import { EvolutionDetails } from "./PokemonCard.types";

interface PokemonDetails {
    pokemonName: string;
    pokemonId: number;
}

export const mapEvolutionToPokemonDetails = (evolutionDetails: EvolutionDetails): PokemonDetails => {
    return {
        pokemonName: evolutionDetails.pokemonName,
        pokemonId: evolutionDetails.pokemonId
    };
};
