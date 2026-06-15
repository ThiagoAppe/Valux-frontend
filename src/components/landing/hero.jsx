import { useState } from "react";
import { ChevronDown } from "lucide-react";

const HeroImageShort =
  "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/91e506d7c_PAGINAWEB-FONDOCONLOGOCORTO.png";

const HeroImageLong =
  "https://media.base44.com/images/public/69d00920c08acc30b8df3cb4/3533b45ac_PAGINAWEB-FONDOCONLOGOLARGO.png";

const Hero = () => {
  const [Hovered, SetHovered] = useState(false);

  const HandleScroll = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      onMouseEnter={() => SetHovered(true)}
      onMouseLeave={() => SetHovered(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={HeroImageShort}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <img
          src={HeroImageLong}
          alt="Valux Deco"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-[2500ms] ease-out"
          style={{
            clipPath: Hovered
              ? "circle(150% at center)"
              : "circle(0% at center)"
          }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Scroll Indicator */}
      <button
        onClick={HandleScroll}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-white transition-opacity hover:opacity-100"
      >
        <span className="mb-3 text-xs font-light uppercase tracking-[0.4em] text-white/80">
          Ver más
        </span>

        <ChevronDown
          size={36}
          strokeWidth={1.5}
          className="animate-bounce"
        />
      </button>
    </section>
  );
};

export default Hero;