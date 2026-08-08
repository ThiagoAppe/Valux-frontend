import { useEffect, useState } from "react";

import CategoriesHero from "../../components/categories/categoriesHero";
import CategoryGrid from "../../components/categories/categoryGrid";

import { getCategories } from "../../services/productService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load_categories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load_categories();
  }, []);

  return (
    <main className="min-h-screen bg-stone-50">
      <CategoriesHero />

      <section className="mx-auto max-w-7xl px-6 pb-16">
        {loading && (
          <p className="text-center text-gray-500">Cargando categorías...</p>
        )}

        {error && (
          <p className="text-center text-red-500">
            No fue posible cargar las categorías.
          </p>
        )}

        {!loading && !error && <CategoryGrid categories={categories} />}
      </section>
    </main>
  );
}
