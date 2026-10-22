import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  CircleCheck,
  Heart,
  MessageCircle,
  Palette,
  Ruler,
  Send,
  Sparkles,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Categories from "../../components/landing/Categories";
import FeaturedProducts from "../../components/landing/featuredProducts";

const placeholder = (label, width = 900, height = 700) =>
  `https://placehold.co/${width}x${height}/d9bfa7/3e2c23?text=${encodeURIComponent(label)}`;

const benefits = [
  {
    icon: Palette,
    title: "Diseño con identidad",
    text: "Objetos creados para hacer que cada espacio se sienta propio.",
  },
  {
    icon: Ruler,
    title: "Hecho a tu medida",
    text: "Opciones para adaptar detalles, tamaños y terminaciones.",
  },
  {
    icon: Truck,
    title: "Envíos cuidados",
    text: "Preparamos cada pedido para que llegue listo para disfrutar.",
  },
  {
    icon: MessageCircle,
    title: "Atención cercana",
    text: "Te acompañamos antes y después de elegir tu próxima pieza.",
  },
];

const steps = [
  {
    number: "01",
    title: "Inspirate",
    text: "Recorré las colecciones y encontrá las piezas que hablan de vos.",
  },
  {
    number: "02",
    title: "Elegí o personalizá",
    text: "Seleccioná la variante ideal o consultanos para crear algo especial.",
  },
  {
    number: "03",
    title: "Disfrutalo en casa",
    text: "Recibí tu pedido y dale un nuevo carácter a tu espacio.",
  },
];

const testimonials = [
  {
    quote:
      "Encontré detalles simples que hicieron que mi living se sintiera completamente nuevo.",
    name: "Sofía M.",
    place: "Buenos Aires",
  },
  {
    quote:
      "La atención fue cálida y la pieza quedó perfecta en el rincón que tenía en mente.",
    name: "Lucía R.",
    place: "La Plata",
  },
  {
    quote:
      "Me encantó poder elegir una terminación que combine con el resto de mi casa.",
    name: "Martín G.",
    place: "CABA",
  },
];

const faqs = [
  [
    "¿Puedo pedir una pieza personalizada?",
    "Sí. Contanos qué tenés en mente y evaluaremos medidas, colores y terminaciones para crear una propuesta.",
  ],
  [
    "¿Cómo sé cuándo estará listo mi pedido?",
    "Te mantenemos al tanto de cada etapa. Los tiempos pueden variar según el tipo de pieza y su nivel de personalización.",
  ],
  [
    "¿Realizan envíos?",
    "Sí, coordinamos envíos para que recibas tu compra de forma cómoda y segura.",
  ],
  [
    "¿Cómo cuido mis productos?",
    "Cada material tiene sus particularidades. Incluiremos las recomendaciones de cuidado junto a tu pedido.",
  ],
];

const Hero = () => (
  <section className="-mx-4 relative h-[60vh] overflow-hidden md:h-full">
    <div>
      <img
        src="/Landing/landingBG.webp"
        alt=""
        className="relative z-20 h-full w-full translate-y-10 object-cover object-center md:translate-y-0"
      />
    </div>

    <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-background via-background/70 to-transparent" />

    <img
      src="/Landing/VALUX-DECO.webp"
      alt="Valux Deco"
      className="absolute inset-0 z-10 h-full w-full -translate-y-20 object-contain object-center md:-translate-y-20          "
    />

    <motion.div
      className="absolute inset-x-0 bottom-10 z-30 flex justify-center md:bottom-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Link
        to="/catalog"
        className="group flex items-center gap-3 rounded-full bg-primary px-8 py-3 text-xl font-medium tracking-wide text-white transition-all duration-300 hover:bg-primary-dark hover:shadow-lg"
      >
        <span>Ver catálogo</span>
        <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  </section>
);

const Benefits = () => (
  <section className="border-y border-border bg-white">
    <div className="mx-auto grid max-w-7xl divide-y divide-border px-2 sm:px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
      {benefits.map(({ icon: Icon, title, text }) => (
        <article key={title} className="flex gap-4 px-4 py-7 sm:px-6">
          <div className="mt-0.5 rounded-xl bg-primary/10 p-2.5 text-primary">
            <Icon size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-text">{title}</h2>
            <p className="mt-1 text-sm leading-5 text-text-secondary">{text}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const EditorialSection = () => (
  <section className="mx-auto grid max-w-7xl items-center gap-10 px-2 py-18 sm:px-6 lg:grid-cols-2 lg:gap-18">
    <div className="overflow-hidden rounded-3xl bg-primary-light">
      <img
        src={placeholder("Un espacio hecho a tu manera")}
        alt="Inspiración para decorar tu hogar"
        className="aspect-[4/3] h-full w-full object-cover"
      />
    </div>
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
        Para espacios vividos
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        Diseño que acompaña tus rituales de todos los días.
      </h2>
      <p className="mt-5 leading-7 text-text-secondary">
        Una mesa compartida, una tarde de lectura o ese rincón que te recibe al
        volver: cada detalle puede convertir lo cotidiano en algo especial.
      </p>
      <Link
        to="/catalog"
        className="mt-7 inline-flex items-center gap-2 font-semibold text-primary transition hover:text-primary-dark"
      >
        Encontrá tu próxima pieza <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="bg-background-dark py-18 text-white">
    <div className="mx-auto max-w-7xl px-2 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary-light">
          Simple y cercano
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Así empieza tu próxima transformación.
        </h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.number}
            className="rounded-2xl border border-white/15 bg-white/5 p-7"
          >
            <p className="text-sm font-bold tracking-[0.25em] text-primary-light">
              {step.number}
            </p>
            <h3 className="mt-7 text-2xl font-semibold">{step.title}</h3>
            <p className="mt-3 leading-7 text-white/70">{step.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const CustomOrder = () => (
  <section className="mx-auto max-w-7xl px-2 py-18 sm:px-6">
    <div className="grid overflow-hidden rounded-3xl bg-primary-light lg:grid-cols-[0.9fr_1.1fr]">
      <img
        src={placeholder("Tu idea, hecha objeto", 850, 650)}
        alt="Ejemplo de un proyecto personalizado"
        className="h-full min-h-72 w-full object-cover"
      />
      <div className="flex flex-col justify-center p-8 sm:p-12">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/60 text-primary-dark">
          <Sparkles size={23} />
        </div>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.3em] text-primary-dark">
          Proyectos especiales
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          ¿Tenés una idea en mente?
        </h2>
        <p className="mt-4 max-w-lg leading-7 text-text-secondary">
          Contanos qué imaginás. Podemos ayudarte a explorar una pieza única,
          una adaptación o un detalle para un ambiente especial.
        </p>
        <Link
          to="/about"
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-background-dark px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark"
        >
          Quiero consultar <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  </section>
);

const Story = () => (
  <section className="mx-auto grid max-w-7xl items-center gap-10 px-2 py-18 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
        Hecho con intención
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        Creemos en los objetos que cuentan una historia.
      </h2>
      <p className="mt-5 leading-7 text-text-secondary">
        Valux Deco nació del deseo de crear piezas con presencia: objetos que no
        solo completan un ambiente, sino que lo vuelven más tuyo.
      </p>
      <p className="mt-4 leading-7 text-text-secondary">
        Diseñamos con sensibilidad por las formas, los materiales y esos
        detalles que se descubren con el tiempo.
      </p>
      <Link
        to="/about"
        className="mt-7 inline-flex items-center gap-2 font-semibold text-primary transition hover:text-primary-dark"
      >
        Nuestra historia <ArrowRight size={18} />
      </Link>
    </div>
    <img
      src={placeholder("Detalles que hacen hogar", 1000, 750)}
      alt="Detalle de una pieza decorativa"
      className="aspect-[4/3] w-full rounded-3xl object-cover"
    />
  </section>
);

const Gallery = () => (
  <section className="bg-white py-18">
    <div className="mx-auto max-w-7xl px-2 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
            Inspiración
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Ideas para mirar tu casa distinto.
          </h2>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-semibold text-primary"
        >
          Ver más inspiración <ArrowRight size={18} />
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          "Un rincón para vos",
          "Texturas y calma",
          "Detalles cotidianos",
          "Luz de tarde",
          "Objetos con carácter",
        ].map((label, index) => (
          <Link
            key={label}
            to="/"
            className={`group overflow-hidden rounded-2xl ${index === 0 || index === 5 ? "md:row-span-2" : ""}`}
          >
            <img
              src={placeholder(
                label,
                700,
                index === 0 || index === 5 ? 1100 : 700,
              )}
              alt={label}
              className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-105 md:aspect-auto"
            />
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="mx-auto max-w-7xl px-2 py-18 sm:px-6">
    <div className="text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
        Quienes nos eligen
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        Historias que nos inspiran a seguir creando.
      </h2>
    </div>
    <div className="mt-11 grid gap-5 md:grid-cols-3">
      {testimonials.map((testimonial) => (
        <figure
          key={testimonial.name}
          className="rounded-2xl border border-border bg-white p-6 shadow-sm"
        >
          <Heart size={19} className="text-primary" fill="currentColor" />
          <blockquote className="mt-5 leading-7 text-text-secondary">
            “{testimonial.quote}”
          </blockquote>
          <figcaption className="mt-6">
            <p className="font-semibold text-text">{testimonial.name}</p>
            <p className="text-sm text-text-secondary">{testimonial.place}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="bg-primary-light/35 py-18">
      <div className="mx-auto max-w-3xl px-2 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
            Preguntas frecuentes
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Todo lo que querés saber antes de elegir.
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map(([question, answer], index) => (
            <article
              key={question}
              className="rounded-2xl border border-border bg-white"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex((current) => (current === index ? -1 : index))
                }
                aria-expanded={openIndex === index}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-text sm:px-6"
              >
                {question}
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-primary transition ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === index && (
                <p className="px-5 pb-5 leading-7 text-text-secondary sm:px-6 sm:pb-6">
                  {answer}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const ClosingCTA = () => {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <section className="mx-auto max-w-7xl px-2 py-18 sm:px-6">
      <div className="rounded-3xl bg-background-dark px-6 py-12 text-center text-white sm:px-12">
        <CircleCheck size={30} className="mx-auto text-primary-light" />
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.3em] text-primary-light">
          Tu casa, tu forma
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Empezá a crear un espacio que se sienta completamente tuyo.
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-white/70">
          Descubrí nuevas piezas y recibí inspiración para transformar cada
          rincón.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold transition hover:bg-primary-dark"
          >
            Ver catálogo <ArrowRight size={18} />
          </Link>
          <Link
            to="/about"
            className="rounded-full border border-white/25 px-6 py-3.5 font-semibold transition hover:bg-white/10"
          >
            Contactanos
          </Link>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubscribed(true);
          }}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Tu email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Tu email para recibir novedades"
            className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-white/55 focus:border-primary-light"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-text transition hover:bg-background"
          >
            <Send size={16} />
            Suscribirme
          </button>
        </form>
        {subscribed && (
          <p aria-live="polite" className="mt-4 text-sm text-primary-light">
            ¡Gracias! Pronto recibirás novedades.
          </p>
        )}
      </div>
    </section>
  );
};

const Landing = () => (
  <main>
    <Hero />
    <Benefits />
    <FeaturedProducts />
    <Categories />
    <EditorialSection />
    <HowItWorks />
    <CustomOrder />
    <Story />
    <Gallery />
    <Testimonials />
    <FAQ />
    <ClosingCTA />
  </main>
);

export default Landing;
