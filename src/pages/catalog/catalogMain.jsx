import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { getCatalog } from "../../services/productService";
import { getCategories } from "../../services/categoriesService";
import ProductCard from "../../components/product/productCard";

const PAGE_SIZE = 20;

const CatalogMain = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || undefined;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(false);

      try {
        const data = await getCatalog({
          category,
          page: currentPage,
          limit: PAGE_SIZE,
        });

        setProducts(data.items);
        setTotalPages(data.total_pages);
        setTotal(data.total);
      } catch {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category, currentPage]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const changePage = (page) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (page === 1) nextSearchParams.delete("page");
    else nextSearchParams.set("page", page.toString());
    setSearchParams(nextSearchParams);
  };

  const selectCategory = (slug) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (slug) nextSearchParams.set("category", slug);
    else nextSearchParams.delete("category");
    nextSearchParams.delete("page");
    setSearchParams(nextSearchParams);
  };

  const mainCategories = categories.filter((item) => item.parent_id === null);
  const selectedCategory = categories.find((item) => item.slug === category);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1);

  return (
    <main className="pb-18 text-text">
      <section className="-mx-4 overflow-hidden bg-background-dark px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-7xl"><div className="flex size-12 items-center justify-center rounded-2xl bg-primary/30 text-primary-light"><Sparkles size={22} /></div><p className="mt-7 text-sm font-bold uppercase tracking-[0.3em] text-primary-light">Catálogo</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Piezas para vivir los espacios a tu manera.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Explorá objetos, detalles y colecciones que transforman lo cotidiano en algo propio.</p></div>
      </section>

      <section className="mx-auto max-w-7xl px-2 pt-10 sm:px-6 lg:pt-14">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">{selectedCategory ? "Colección" : "Todos los productos"}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{selectedCategory?.name ?? "Encontrá tu próxima pieza"}</h2></div><p className="rounded-full border border-border bg-white px-4 py-2 text-sm text-text-secondary">{total} {total === 1 ? "pieza" : "piezas"}</p></div>

        <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-2"><button type="button" onClick={() => selectCategory("")} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${!category ? "bg-primary text-white" : "border border-border bg-white text-text-secondary hover:border-primary hover:text-primary"}`}>Todo</button>{mainCategories.map((item) => <button type="button" key={item.id} onClick={() => selectCategory(item.slug)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${category === item.slug ? "bg-primary text-white" : "border border-border bg-white text-text-secondary hover:border-primary hover:text-primary"}`}>{item.name}</button>)}<Link to="/categories" className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-primary transition hover:text-primary-dark"><SlidersHorizontal size={16} />Ver colecciones</Link></div>

        {loading && <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className={`animate-pulse ${index === 0 ? "lg:col-span-2" : ""}`}><div className={`rounded-3xl bg-primary-light/40 ${index === 0 ? "aspect-[4/3]" : "aspect-[4/5]"}`} /><div className="mt-4 h-3 w-1/3 rounded bg-primary-light/45" /><div className="mt-2 h-5 w-4/5 rounded bg-primary-light/35" /></div>)}</div>}

        {!loading && error && <div className="mt-10 rounded-3xl border border-border bg-white p-10 text-center"><h3 className="text-xl font-semibold">No pudimos cargar el catálogo.</h3><p className="mt-2 text-text-secondary">Intentá nuevamente en unos instantes.</p></div>}
        {!loading && !error && products.length === 0 && <div className="mt-10 rounded-3xl border border-border bg-white p-10 text-center"><h3 className="text-xl font-semibold">No encontramos piezas en esta colección.</h3><p className="mt-2 text-text-secondary">Probá explorar todas las colecciones para descubrir más opciones.</p><button type="button" onClick={() => selectCategory("")} className="mt-6 rounded-full bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark">Ver todo el catálogo</button></div>}

        {!loading && !error && products.length > 0 && <section className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">{products.map((product, index) => <ProductCard key={product.id} product={product} featured={index === 0 && currentPage === 1} />)}</section>}

      {totalPages > 1 && (
        <nav aria-label="Paginación del catálogo" className="mt-14 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={16} />Anterior
          </button>

          {pageNumbers.map((page, index) => <div key={page} className="flex items-center gap-2">{index > 0 && pageNumbers[index - 1] !== page - 1 && <span className="px-1 text-text-secondary">…</span>}
              <button
                type="button"
                onClick={() => changePage(page)}
                className={`size-10 rounded-full text-sm font-semibold transition ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "border border-border bg-white text-text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {page}
              </button>
            </div>)}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente<ArrowRight size={16} />
          </button>
        </nav>
      )}
      </section>
    </main>
  );
};

export default CatalogMain;
