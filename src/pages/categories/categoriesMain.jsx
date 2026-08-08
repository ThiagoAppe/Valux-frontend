import { useEffect, useState } from "react";

import CategoriesHero from "../../components/categories/categoriesHero";
import CategoryGrid from "../../components/categories/categoryGrid";

import { getCategories } from "../../services/categoriesService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <main className="">
      <CategoriesHero />

      <section className="mx-auto max-w-7xl px-6 pb-2">
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
