import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchData } from "../../components/api/requests";

const ProductCard = ({ product }) => {
    return (
        <Link
            to={`/catalog/${product.slug}`}
            className="block"
        >
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <img
                    src={
                        product.image_url ??
                        "https://placehold.co/600x600?text=Sin+Imagen"
                    }
                    alt={product.name}
                    className="aspect-square w-full object-cover"
                />

                <div className="p-5">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        {product.name}
                    </h2>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Desde
                        </span>

                        <span className="text-xl font-bold text-gray-900">
                            $
                            {Number(product.price_from).toLocaleString("es-AR")}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await fetchData("/products/catalog");
                setProducts(data);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                Cargando productos...
            </div>
        );
    }

    return (
        <div className="bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </section>
        </div>
    );
};

export default Catalog;