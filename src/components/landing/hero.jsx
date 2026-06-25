const HeroImageLong =
  "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/3533b45ac_PAGINAWEB-FONDOCONLOGOLARGO.png";

const Hero = () => {
  return (
    <section className="-mx-4 -mt-6 flex h-full">
      <img
        src={HeroImageLong}
        alt="Valux Deco"
        className="h-full w-full object-cover"
      />
    </section>
  );
};

export default Hero;