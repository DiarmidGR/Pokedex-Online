import { EncounterData } from "./types";

export const modifyEncounterData = (data: EncounterData[]): EncounterData[] => {
  const modifiedData = [...data];
  for (let i = 0; i < modifiedData.length; i++) {
    for (let j = i + 1; j < modifiedData.length; j++) {
      const encounter1 = modifiedData[i];
      const encounter2 = modifiedData[j];

      // Safely check if encounterCondition is not null or undefined
      const encounter1Condition = encounter1.encounterCondition || '';
      const encounter2Condition = encounter2.encounterCondition || '';

      if (
        encounter1.locationArea === encounter2.locationArea &&
        encounter1.minLevel === encounter2.minLevel &&
        encounter1.maxLevel === encounter2.maxLevel &&
        encounter1.pokemonName === encounter2.pokemonName &&
        encounter1.encounterMethod === encounter2.encounterMethod &&
        encounter1.encounterRate === encounter2.encounterRate &&
        (
          (encounter1Condition.includes("time") && encounter2Condition.includes("time")) ||
          (encounter1Condition.includes("season") && encounter2Condition.includes("season"))
        )
      ) {
        // Merge time-based encounter conditions
        modifiedData[i].encounterCondition += ` ${encounter2.encounterCondition}`;

        // Remove encounter2 from modifiedData
        modifiedData.splice(j, 1);
        // Since we removed an element, decrement j to adjust for the new length
        j--;
      }
    }
  }
  return modifiedData;
};


export const isItemStored = (storedItems:string[],item: number, versionId:string) => {
  let storageString = versionId + "_" + item;
  return storedItems.includes(storageString);
};

// Function to check hideCaughtPokemon and return the style
export const getCaughtStyle = (isCaught: boolean, hideCaughtPokemon:boolean) => {
  return hideCaughtPokemon && isCaught ? { display: "none" } : {};
};


// Function to get unique encounter statistics
export const getUniqueEncounterStats = (
  encounters: EncounterData[],
  storedItems: string[],
  versionId: string,
): { uniqueEncountersCount: number; uniqueStoredMatchesCount: number } => {
  // Calculate unique items in encounters by pokemonId
  const uniqueEncounters = new Set(encounters.map(encounter => encounter.pokemonId)).size;

  // Calculate distinct matches with storedItems
  const uniqueStoredMatches = new Set(
    encounters
      .filter(encounter => isItemStored(storedItems,encounter.pokemonId, versionId))
      .map(encounter => encounter.pokemonId)
  ).size;

  return {
    uniqueEncountersCount: uniqueEncounters,
    uniqueStoredMatchesCount: uniqueStoredMatches,
  };
};