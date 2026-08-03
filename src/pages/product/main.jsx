import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchData } from "../../components/api/requests";
import ProductDetail from "../../components/product/product";

const Product = () => {
    const { slug } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProduct() {
            try {
                const data = await fetchData(`/products/${slug}`);
                setProduct(data);
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                Cargando producto...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-1 items-center justify-center">
                Producto no encontrado.
            </div>
        );
    }

    return <ProductDetail product={product} />;
};

export default Product;