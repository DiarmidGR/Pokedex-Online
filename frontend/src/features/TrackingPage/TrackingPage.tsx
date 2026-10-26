import React, { useState, useEffect, useRef } from "react";
import styles from "./TrackingPage.module.css";
import LocationDropdown from "./components/LocationDropdown";
import EncountersList from "../EncountersContainer/EncountersList";
import PokedexList from "../PokedexList/PokedexList";
import CheckboxComponent from "../../shared/components/Checkbox";
import PokemonCard from "../PokemonCard/PokemonCard";
import useFetchUserPokemon from "./hooks/useFetchUserPokemon";
import { handleDeletePokemon } from "./trackingPage.utils";
import useDeleteUserPokemon from "./hooks/useDeleteUserPokemon";
import useInsertUserPokemon from "./hooks/useInsertUserPokemon";
import { useSearchParams, useOutletContext } from "react-router-dom";

interface OutletContext {
  isDark: boolean;
}

interface TrackingPageProps {
  version_id: string;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ version_id }) => {
  const { isDark } = useOutletContext<OutletContext>();
  const versionId = version_id;
  const [selectedPokemonId, setSelectedPokemonId] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<string>(
    searchParams.get("location") ?? ""
  );
  const hideCaughtPokemonKey = versionId + "_hideCaughtPokemon";
  const [hideCaughtPokemon, setHideCaughtPokemon] = useState<boolean>(() => {
    const storedValue = localStorage.getItem(hideCaughtPokemonKey);
    console.log("hideCaughtPokemon storedValue:", storedValue);
    return storedValue !== null ? storedValue === "true" : false;
  });
  const { userPokemon, setUserPokemon, error } =
    useFetchUserPokemon(versionId);
  const { deleteUserPokemon } = useDeleteUserPokemon();
  const { insertUserPokemon } = useInsertUserPokemon();

  const [isPokemonCardVisible, setIsPokemonCardVisible] = useState<boolean>(false);

  

  // Sync LocationDropdown selectedLocation with url search parameter for location
  useEffect(() => {
    if (selectedLocation) {
      setSearchParams({ location: selectedLocation }, {replace: true});
    } else {
      setSearchParams({}, {replace:true});
    }
  }, [selectedLocation]);

  // Save hide caught pokemon preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(hideCaughtPokemonKey, hideCaughtPokemon.toString());
  }, [hideCaughtPokemon, hideCaughtPokemonKey]);




  ////////////////////////////////////////////////////
  // ALL CODE RELATING TO POKEDEX CONTAINER RESIZING//
  ////////////////////////////////////////////////////
  const savedHeight = localStorage.getItem("pokedexHeight");
  const [pokedexHeight, setPokedexHeight] = useState<number | null>(
    savedHeight ? parseInt(savedHeight) : null
  );
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [startHeight, setStartHeight] = useState<number>(0);
  const pokedexContainerRef = useRef<HTMLDivElement>(null);
  const naturalHeightRef = useRef<number>(0);

  // Reize pokedex container when pokedex changes / data length changes
  // Used for when user switches from large data set to smaller, removes
  //  deadspace automatically
  const handlePokemonCountChange = () => {
    // Defer measurement until after React has painted the new DOM
    setTimeout(() => {
      if (pokedexContainerRef.current && pokedexHeight !== null) {
        const container = pokedexContainerRef.current;
        const currentHeight = container.style.height;
        container.style.height = '';
        void container.offsetHeight; // Force reflow
        const newNaturalHeight = container.scrollHeight;
        container.style.height = currentHeight;
        
        if (pokedexHeight > newNaturalHeight) {
          setPokedexHeight(newNaturalHeight);
          naturalHeightRef.current = newNaturalHeight;
        }
      }
    }, 0);
  };

  // Resize event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setStartY(e.clientY);
    const pokedexElement = pokedexContainerRef.current;
    if (pokedexElement){
      // Temporarily remove height constraint to measure natural height accurately
      const currentHeight = pokedexElement.style.height;
      pokedexElement.style.height = '';
      void pokedexElement.offsetHeight; // Force reflow
      naturalHeightRef.current = pokedexElement.scrollHeight;
      pokedexElement.style.height = currentHeight;
      setStartHeight(pokedexElement.offsetHeight);
    }
  };

  // Save pokedex height to localStorage whenever it changes
  useEffect(() => {
    if(pokedexHeight!==null){
      localStorage.setItem("pokedexHeight", pokedexHeight.toString());
    }
  }, [pokedexHeight]);

  // Measure natural content height once when pokedex content changes
  useEffect(() => {
    if (pokedexContainerRef.current) {
      const container = pokedexContainerRef.current;
      const currentHeight = container.style.height;
      container.style.height = '';
      void container.offsetHeight; // Force reflow
      naturalHeightRef.current = container.scrollHeight;
      container.style.height = currentHeight;
      
      // If current height exceeds new natural height, auto-adjust
      if (pokedexHeight !== null && pokedexHeight > naturalHeightRef.current) {
        setPokedexHeight(naturalHeightRef.current);
      }
    }
  }, [userPokemon]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaY = e.clientY - startY;
      // I dont know why the -8 is necessary im assuming its to do with some border causing issues
      const newHeight = (startHeight + deltaY)-8;

      // Use cached natural height (measured when unconstrained) to prevent deadspace
      const cappedHeight = Math.max(130, Math.min(newHeight, naturalHeightRef.current));

      setPokedexHeight(cappedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing){
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection and user interactions during resize
      document.body.style.userSelect='none';
      document.body.style.cursor = 'ns-resize'; // To keep our cursor consistent
    }else{
      // Reset styles when not resizing
      document.body.style.userSelect='';
      document.body.style.cursor='';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startY, startHeight])


  
  // Insert/Delete pokemon from user-pokemon database
  const handlePokemonClick = (versionId: string, pokemonId: number) => {
    let updatedStoredItems = handleDeletePokemon(
      versionId,
      pokemonId,
      userPokemon,
      deleteUserPokemon,
      insertUserPokemon
    );
    if (updatedStoredItems) {
      setUserPokemon(updatedStoredItems);
    }
  };

  // Open pokemon in PokemonCard component
  const handlePokemonRightClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pokemonId: number
  ) => {
    event.preventDefault();
    let newPokemonId = pokemonId.toString();
    setSelectedPokemonId(newPokemonId);
    setIsPokemonCardVisible(true);
  };

  // Function to toggle PokemonCard visibility
  const togglePokemonCard = () => {
    setIsPokemonCardVisible((prevState) => !prevState);
  };

  // Function that checks if user has caught a pokemon already or not
  const isItemStored = (item: string) => {
    let storageString = versionId + "_" + item;
    return userPokemon.includes(storageString);
  };

  if (error) {
    return <div>Error fetching pokémon details: {error.message}</div>;
  }

  return (
    <div className={styles["tracker-container"]}>
      <div
        ref={pokedexContainerRef}
        className={styles["pokedex-container"]}
        style={{height: pokedexHeight ? `${pokedexHeight}px` : 'max-content'}}
      >
        <PokedexList
          versionId={version_id}
          storedItems={userPokemon}
          handlePokemonClick={handlePokemonClick}
          handlePokemonRightClick={handlePokemonRightClick}
          isDark={isDark}
          onPokemonCountChange={handlePokemonCountChange}
        />
        <div
          className={styles["resize-handle"]}
          onMouseDown={handleMouseDown}
        >

        </div>
      </div>
      <div className={styles["controls-container"]}>
        

        <div className={styles["controls-child"]}>
          <p className="switzer-regular">{"Hide caught Pokemon?"}</p>
          <CheckboxComponent
            isChecked={hideCaughtPokemon}
            setIsChecked={setHideCaughtPokemon}
          ></CheckboxComponent>
        </div>

        <div className={styles["controls-child"]}>
          <LocationDropdown
            versionId={version_id}
            onLocationChange={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
        </div>
      </div>
      <div className={styles["encounters-layout"]}>
        <div className={styles["encounters-container"]}>
          <EncountersList
            versionId={versionId}
            locationIdentifier={selectedLocation}
            storedItems={userPokemon}
            handlePokemonClick={handlePokemonClick}
            hideCaughtPokemon={hideCaughtPokemon}
            handlePokemonRightClick={handlePokemonRightClick}
          />
        </div>
        <div className={styles["pokemon-container"]}>
          {isPokemonCardVisible && (
            <PokemonCard
            pokemonId={selectedPokemonId}
            versionId={version_id}
            setSelectedLocation={setSelectedLocation}
            isCaught={isItemStored(selectedPokemonId)}
            isDark={isDark}
            togglePokemonCard={togglePokemonCard}
            handlePokemonRightClick={handlePokemonRightClick}
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
