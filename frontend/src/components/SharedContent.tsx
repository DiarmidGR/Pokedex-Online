import React, { createContext, useContext, useState } from "react";

interface SharedStateContextProps {
  storedItems: string[];
  toggleStoredItem: (item: string) => void;
}

const SharedStateContext = createContext<SharedStateContextProps>({
  storedItems: [],
  toggleStoredItem: () => {},
});

export const useSharedState = () => useContext(SharedStateContext);

export const SharedStateProvider: React.FC = ({ children }: any) => {
  const [storedItems, setStoredItems] = useState<string[]>([]);

  const toggleStoredItem = (item: string) => {
    const updatedStoredItems = storedItems.includes(item)
      ? storedItems.filter((storedItem) => storedItem !== item)
      : [...storedItems, item];
    setStoredItems(updatedStoredItems);
    localStorage.setItem("storedItems", JSON.stringify(updatedStoredItems));
  };

  return (
    <SharedStateContext.Provider value={{ storedItems, toggleStoredItem }}>
      {children}
    </SharedStateContext.Provider>
  );
};
