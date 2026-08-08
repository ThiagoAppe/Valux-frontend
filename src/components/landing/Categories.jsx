import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import CategoryCard from "./categoryCard";
import { getCategories } from "../../services/categoriesService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mainCategories = categories.filter(
    (category) => category.parent_id === null,
  );

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
    <section>
      <motion.div
        className="mb-14 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-black">
          COLECCIONES
        </p>

        <h2 className="font-heading text-4xl font-medium text-black md:text-5xl">
          Nuestras Categorías
        </h2>
      </motion.div>

      {loading && (
        <p className="text-center text-sm text-neutral-500">
          Cargando categorías...
        </p>
      )}

      {error && (
        <p className="text-center text-sm text-red-500">
          No fue posible cargar las categorías.
        </p>
      )}

      {!loading && !error && (
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {mainCategories.map((category, index) => (
            <div
              key={category.slug}
              className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)]"
            >
              <CategoryCard
                name={category.name}
                image={category.image_url}
                index={index}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}