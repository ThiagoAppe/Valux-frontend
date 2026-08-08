import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
    return (
        <Link
            to={`/catalog?category=${category.slug}`}
            className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
            "
        >
            <div className="aspect-square overflow-hidden bg-stone-100">
                <img
                    src={category.image_url}
                    alt={category.name}
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
                />
            </div>

            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    {category.name}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    {category.product_count} productos
                </p>
            </div>
        </Link>
    );
}