import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const fallbackImage = "https://placehold.co/900x1100/f4ede3/3e2c23?text=Valux+Deco";

const ProductCard = ({ product, featured = false }) => {
  return (
    <Link to={`/catalog/${product.slug}`} className={`group block ${featured ? "lg:col-span-2" : ""}`}>
      <article className="h-full">
        <div className="relative overflow-hidden rounded-3xl bg-primary-light/35 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
          <img src={product.image_url || fallbackImage} alt={product.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackImage; }} className={`${featured ? "aspect-[4/3]" : "aspect-[4/5]"} w-full object-cover transition duration-700 group-hover:scale-105`} />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-background-dark/80 via-background-dark/20 to-transparent p-5 pt-20 opacity-0 transition duration-300 group-hover:opacity-100"><span className="text-sm font-semibold text-white">Descubrir pieza</span><span className="flex size-9 items-center justify-center rounded-full bg-white text-text"><ArrowUpRight size={18} /></span></div>
          {featured && <span className="absolute left-4 top-4 rounded-full bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">Selección especial</span>}
        </div>
        <div className="px-1 pt-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Valux Deco</p><h2 className="mt-1 text-lg font-semibold leading-snug text-text transition group-hover:text-primary">{product.name}</h2><div className="mt-2 flex items-center justify-between text-sm"><p className="text-text-secondary">Desde</p><p className="font-semibold text-text-secondary">${Number(product.price_from ?? 0).toLocaleString("es-AR")}</p></div></div>
      </article>
    </Link>
  );
};

export default ProductCard;
