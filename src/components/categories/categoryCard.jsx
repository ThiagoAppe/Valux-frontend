import { Link } from "react-router-dom";

export default function CategoryCard({ category, categories }) {
    const child_categories = categories.filter(
        (child) => child.parent_id === category.id,
    );

    return (
        <article
            className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-gray-200
                hover:shadow-xl
            "
        >
            <Link to={`/catalog?category=${category.slug}`} className="block p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2
                            className="
                                text-xl
                                font-semibold
                                tracking-tight
                                text-gray-900
                            "
                        >
                            {category.name}
                        </h2>

                        {child_categories.length > 0 && (
                            <p className="mt-1 text-sm text-gray-500">
                                {child_categories.length}{" "}
                                {child_categories.length === 1
                                    ? "subcategoría"
                                    : "subcategorías"}
                            </p>
                        )}
                    </div>

                    <span
                        className="
                            mt-1
                            text-lg
                            text-gray-300
                            transition-all
                            duration-300
                            group-hover:translate-x-1
                            group-hover:text-gray-900
                        "
                    >
                        →
                    </span>
                </div>
            </Link>

            {child_categories.length > 0 && (
                <div
                    className="
                        border-t
                        border-gray-100
                        bg-gray-50/70
                        px-6
                        py-5
                    "
                >
                    <p
                        className="
                            mb-3
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            text-gray-400
                        "
                    >
                        Explorar
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {child_categories.map((child) => (
                            <Link
                                key={child.id}
                                to={`/catalog?category=${child.slug}`}
                                className="
                                    rounded-full
                                    border
                                    border-gray-200
                                    bg-white
                                    px-3
                                    py-1.5
                                    text-sm
                                    text-gray-600
                                    transition-all
                                    duration-200
                                    hover:border-gray-900
                                    hover:bg-gray-900
                                    hover:text-white
                                "
                            >
                                {child.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
