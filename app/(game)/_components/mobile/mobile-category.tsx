import axios from "axios";

const GameMobileCategory = async () => {
  const res = await axios.get(`/api/game/category`);
  if (res.data.length === 0) return null;
  return (
    <div>
      {res.data.map((category: any) => {
        return <div key={category.id}>{category.name}</div>;
      })}
    </div>
  );
};

export default GameMobileCategory;
