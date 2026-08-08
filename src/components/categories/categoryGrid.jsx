import CategoryCard from "./categoryCard";

export default function CategoryGrid({ categories }) {
    const root_categories = categories.filter(
        (category) => category.parent_id === null
    );

    if (root_categories.length === 0) {
        return (
            <p className="text-center text-gray-500">
                No hay categorías disponibles.
            </p>
        );
    }

    return (
        <div
            className="
                grid
                gap-8
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            "
        >
            {root_categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    categories={categories}
                />
            ))}
        </div>
    );
}