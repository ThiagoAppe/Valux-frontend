import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getCatalog } from "../../services/productService";

const fallbackImage = "https://placehold.co/700x700/f4ede3/3e2c23?text=Producto+Valux";
const formatPrice = (price) => Number(price ?? 0).toLocaleString("es-AR");

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getCatalog({ limit: 8 });
        setProducts(response.items ?? []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-2 py-18 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Selección Valux</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text sm:text-4xl">Piezas que hacen especial lo cotidiano.</h2>
        <p className="mt-4 text-text-secondary">Una selección pensada para sumar calidez, textura y personalidad a tus espacios.</p>
      </div>

      {loading && <div className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">{Array.from({ length: 4 }, (_, index) => <div key={index} className="animate-pulse"><div className="aspect-[4/5] rounded-2xl bg-primary-light/45" /><div className="mt-4 h-4 w-3/4 rounded bg-primary-light/45" /><div className="mt-2 h-3 w-1/2 rounded bg-primary-light/35" /></div>)}</div>}

      {!loading && error && <p className="mt-10 rounded-2xl bg-white p-6 text-center text-text-secondary">Los productos estarán disponibles muy pronto.</p>}

      {!loading && !error && <div className="mt-11 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">{products.map((product) => <Link key={product.id} to={`/catalog/${product.slug}`} className="group"><div className="relative overflow-hidden rounded-2xl bg-primary-light/30"><img src={product.image_url || fallbackImage} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background-dark/75 via-background-dark/15 to-transparent p-4 pt-12 opacity-0 transition duration-300 group-hover:opacity-100"><span className="inline-flex items-center gap-2 text-sm font-semibold text-white">Ver detalle <ArrowRight size={16} /></span></div></div><div className="mt-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Disponible ahora</p><h3 className="mt-1 font-semibold text-text transition group-hover:text-primary">{product.name}</h3><p className="mt-1 text-sm text-text-secondary">Desde ${formatPrice(product.price_from)}</p></div></Link>)}</div>}

      <div className="mt-11 flex justify-center"><Link to="/catalog" className="group inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white">Explorar todas las piezas <ArrowRight size={18} className="transition group-hover:translate-x-1" /></Link></div>
    </section>
  );
};

export default FeaturedProducts;
