// import CategoryCard from "./CategoryCard";

export default function CategoryGrid({ categories }) {
    if (categories.length === 0) {
        return (
            <div className="py-20 text-center text-gray-500">
                No hay categorías disponibles.
            </div>
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
            {/* {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                />
            ))} */}
        </div>
    );
}