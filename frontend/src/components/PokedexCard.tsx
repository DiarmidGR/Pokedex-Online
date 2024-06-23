interface PokedexCardProps {
  pokemonId: string;
  versionId: string;
}

const PokedexCard: React.FC<PokedexCardProps> = ({ pokemonId, versionId }) => {
  // Return no component  if pokemon isn't selected
  if (pokemonId === "") {
    return null;
  }
  return (
    <>
      <section>{pokemonId}</section>
      <section>{versionId}</section>
    </>
  );
};

export default PokedexCard;
