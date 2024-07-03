import { CaughtPokemonProps } from "./trackingPageTypes";

export const convertCaughtPokemonData = (
    listData: CaughtPokemonProps[],
    versionId: string,
): string[] => {
    return listData.map((item) => `${versionId}_${item.pokemon_id}`);
};