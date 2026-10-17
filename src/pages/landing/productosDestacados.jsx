import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../../services/productService";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.slice(0, 8));
      } catch (err) {
        setError(err);
      }
    };

    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-16 md:py-24">
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">
          DESTACADOS
        </p>

        <h2 className="font-heading text-4xl font-medium text-text md:text-5xl">
          Productos destacados
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-text-secondary">
          Descubrí algunos de nuestros productos favoritos.
        </p>
      </div>

      {error && (
        <p className="text-center text-sm text-red-500">
          No fue posible cargar los productos.
        </p>
      )}

      {!error && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.slug}
                to={`/catalog/${product.slug}`}
                className="group"
              >
                <div className="overflow-hidden rounded-2xl bg-background-secondary">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="font-medium text-text">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-text-secondary">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              to="/catalog"
              className="rounded-full bg-primary px-8 py-3 text-lg font-medium text-white transition-colors duration-300 hover:bg-primary-dark"
            >
              Ver catálogo
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
