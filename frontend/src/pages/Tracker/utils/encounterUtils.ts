interface EncounterDetails {
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

export const modifyEncounterData = (data: EncounterDetails[]): EncounterDetails[] => {
    const modifiedData = [...data];
    for (let i = 0; i < modifiedData.length; i++) {
      for (let j = i + 1; j < modifiedData.length; j++) {
        const encounter1 = modifiedData[i];
        const encounter2 = modifiedData[j];
        if (
          encounter1.locationArea === encounter2.locationArea &&
          encounter1.minLevel === encounter2.minLevel &&
          encounter1.maxLevel === encounter2.maxLevel &&
          encounter1.pokemonName === encounter2.pokemonName &&
          encounter1.encounterMethod === encounter2.encounterMethod &&
          encounter1.encounterRate === encounter2.encounterRate &&
          ((encounter1.encounterCondition.includes("time") &&
            encounter2.encounterCondition.includes("time")) ||
            (encounter1.encounterCondition.includes("season") &&
              encounter2.encounterCondition.includes("season")))
        ) {
          // Merge time-based encounter conditions
          modifiedData[
            i
          ].encounterCondition += ` ${encounter2.encounterCondition}`;

          // Remove encounter2 from modifiedData
          modifiedData.splice(j, 1);
          // Since we removed an element, decrement j to adjust for the new length
          j--;
        }
      }
    }
    return modifiedData;
  };