import { useEffect, useState } from "react";

import { getCatalog } from "../../services/productService";
import ProductCard from "../../components/product/productCard";

const CatalogMain = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getCatalog({
                    limit: 20,
                });

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
        <main className="px-4 sm:px-6 lg:px-8">
            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </section>
        </main>
    );
};

export default CatalogMain;