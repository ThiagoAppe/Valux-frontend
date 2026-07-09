import { useState } from "react";

const ProductCard = ({ image, title, details, colors }) => {
    const [selectedColor, setSelectedColor] = useState(colors[0]);

    return (
        <div className="w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
            <img
                src={image}
                alt={title}
                className="h-72 w-full object-cover"
            />

            <div className="p-5">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    {title}
                </h2>

                <div className="mb-5 space-y-2 text-sm text-gray-600">
                    {details.map((detail) => (
                        <div
                            key={detail.label}
                            className="flex justify-between"
                        >
                            <span className="font-medium text-gray-800">
                                {detail.label}
                            </span>

                            <span>{detail.value}</span>
                        </div>
                    ))}
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold text-gray-800">
                        Color
                    </p>

                    <div className="flex gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color)}
                                className={`h-9 w-9 rounded-full border-2 transition-all ${
                                    selectedColor.name === color.name
                                        ? "scale-110 border-black"
                                        : "border-gray-300"
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>

                    <p className="mt-3 text-sm text-gray-600">
                        Seleccionado:{" "}
                        <span className="font-medium">
                            {selectedColor.name}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const Catalog = () => {
    const product = {
        image:
            "https://images.unsplash.com/photo-1616627454823-9cd1d9b9c1b0?w=800",
        title: "Florero Geométrico",
        details: [
            {
                label: "Modelo",
                value: "Grande",
            },
            {
                label: "Altura",
                value: "22 cm",
            },
            {
                label: "Material",
                value: "PLA Premium",
            },
        ],
        colors: [
            {
                name: "Blanco",
                hex: "#FFFFFF",
            },
            {
                name: "Negro",
                hex: "#111111",
            },
            {
                name: "Azul",
                hex: "#2563EB",
            },
            {
                name: "Rojo",
                hex: "#DC2626",
            },
            {
                name: "Verde",
                hex: "#16A34A",
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <section className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8">
                <ProductCard
                    image={product.image}
                    title={product.title}
                    details={product.details}
                    colors={product.colors}
                />
            </section>
        </div>
    );
};

export default Catalog;