import { useState } from "react";

export default function ProductCard({
    image,
    title,
    details,
    colors,
}) {
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
                                style={{
                                    backgroundColor: color.hex,
                                }}
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
}