import PopularityItem from "./popularity-item";

const Popularity = () => {
  const popularities = [
    {
      name: "Newest Games",
      value: "newest",
      img:'/bg1.webp'
    },
    {
      name: "Popular Games",
      value: "mostplayed",
      img:'/bg2.webp'
    },
    {
      name: "Hot Games",
      value: "hotgames",
      img:'/bg3.webp'
    },
    {
      name: "Best Games",
      value: "bestgames",
      img:'/bg4.webp'
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 px-4 md:px-0">
      {popularities.map((popularity, index) => {
        return (
          <PopularityItem
            name={popularity.name}
            value={popularity.value}
            img={popularity.img}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default Popularity;
