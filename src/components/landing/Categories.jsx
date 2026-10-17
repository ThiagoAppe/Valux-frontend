import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoriesService";

const fallbackImage = (name) => `https://placehold.co/1000x900/f4ede3/3e2c23?text=${encodeURIComponent(name)}`;
const gridSizes = ["lg:col-span-5 lg:row-span-2", "lg:col-span-4", "lg:col-span-3", "lg:col-span-3", "lg:col-span-4"];

const CategoryTile = ({ category, index }) => (
  <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.24) }} className={`min-h-58 ${gridSizes[index] ?? "lg:col-span-3"} ${index === 0 ? "min-h-105 lg:min-h-0" : ""}`}>
    <Link to={`/catalog?category=${category.slug}`} className="group relative flex h-full min-h-58 overflow-hidden rounded-3xl bg-primary-light p-5 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
      <img src={category.image_url || fallbackImage(category.name)} alt={category.name} onError={(event) => { event.currentTarget.src = fallbackImage(category.name); }} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-linear-to-t from-background-dark/90 via-background-dark/20 to-black/5" />
      <div className="relative z-10 mt-auto flex w-full items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.26em] text-primary-light">Colección {String(index + 1).padStart(2, "0")}</p><h3 className={`${index === 0 ? "mt-3 text-3xl sm:text-4xl" : "mt-2 text-xl sm:text-2xl"} font-semibold tracking-tight`}>{category.name}</h3><p className="mt-2 max-w-xs text-sm text-white/75">Descubrí piezas para darle carácter a cada rincón.</p></div>
        <span className="mb-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 transition group-hover:bg-white group-hover:text-text"><ArrowUpRight size={19} /></span>
      </div>
    </Link>
  </motion.div>
);

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mainCategories = categories.filter((category) => category.parent_id === null).slice(0, 5);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(await getCategories());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className="py-18">
      <div className="mx-auto max-w-7xl px-2 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Colecciones</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-text sm:text-4xl">Elegí el punto de partida para tu espacio.</h2><p className="mt-4 text-text-secondary">Cada colección reúne formas, materiales y detalles para inspirar nuevas combinaciones.</p></div>
          <Link to="/categories" className="group inline-flex items-center gap-2 rounded-full border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white">Ver todas <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
        </div>

        {loading && <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">{Array.from({ length: 5 }, (_, index) => <div key={index} className={`${gridSizes[index]} min-h-58 animate-pulse rounded-3xl bg-primary-light/40 ${index === 0 ? "min-h-105 lg:min-h-0" : ""}`} />)}</div>}
        {!loading && error && <p className="mt-10 rounded-3xl bg-white p-8 text-center text-text-secondary">No pudimos cargar las colecciones en este momento.</p>}
        {!loading && !error && mainCategories.length === 0 && <p className="mt-10 rounded-3xl bg-white p-8 text-center text-text-secondary">Pronto vas a poder explorar nuestras colecciones.</p>}
        {!loading && !error && mainCategories.length > 0 && <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">{mainCategories.map((category, index) => <CategoryTile key={category.id} category={category} index={index} />)}</div>}
      </div>
    </section>
  );
}
