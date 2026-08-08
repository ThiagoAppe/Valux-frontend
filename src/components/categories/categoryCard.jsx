import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    return (
        <Link
            to={`/catalog/${product.slug}`}
            className="block overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
        >
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
                        ${Number(product.price_from).toLocaleString("es-AR")}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;