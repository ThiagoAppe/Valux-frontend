const HeroImageDesktop =
  "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/3533b45ac_PAGINAWEB-FONDOCONLOGOLARGO.png";

const HeroImageMobile =
  "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/91e506d7c_PAGINAWEB-FONDOCONLOGOCORTO.png";

const Hero = () => {
  return (
    <section className="-mx-4 -mt-6 h-[60vh] md:h-full">
      <picture className="h-full w-full">
        {/* Mobile */}
        <source media="(max-width: 768px)" srcSet={HeroImageMobile} />

        {/* Desktop / fallback */}
        <img
          src={HeroImageDesktop}
          alt="Valux Deco"
          className="h-full w-full object-cover object-center"
        />
      </picture>
    </section>
  );
};

export default Hero;