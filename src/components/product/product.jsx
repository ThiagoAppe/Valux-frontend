import { useState } from "react";

const ProductDetail = ({ product }) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid gap-10 lg:grid-cols-2">
                <div>
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <img
                            src={
                                product.image_url ??
                                "https://placehold.co/800x800?text=Sin+Imagen"
                            }
                            alt={product.name}
                            className="aspect-square w-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {product.name}
                    </h1>

                    <p className="mt-4 text-3xl font-semibold text-gray-900">
                        Desde $
                        {Number(product.price_from).toLocaleString("es-AR")}
                    </p>

                    {product.description && (
                        <div className="mt-8">
                            <h2 className="mb-2 text-lg font-semibold text-gray-900">
                                Descripción
                            </h2>

                            <p className="text-gray-600">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {product.variants?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">
                                Modelo
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        className="rounded-lg border border-gray-300 px-4 py-2 transition hover:border-black hover:bg-gray-100"
                                    >
                                        {variant.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.colors?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-3 text-lg font-semibold text-gray-900">
                                Color
                            </h2>

                            <div className="flex gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.id}
                                        className="h-10 w-10 rounded-full border-2 border-gray-300 transition hover:scale-110"
                                        style={{
                                            backgroundColor: color.hex,
                                        }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">
                            Cantidad
                        </h2>

                        <div className="flex w-fit items-center rounded-lg border border-gray-300">
                            <button
                                className="px-4 py-2 text-xl"
                                onClick={() =>
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                            >
                                −
                            </button>

                            <span className="min-w-12 text-center">
                                {quantity}
                            </span>

                            <button
                                className="px-4 py-2 text-xl"
                                onClick={() => setQuantity((q) => q + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button className="mt-10 rounded-xl bg-black px-6 py-4 text-lg font-semibold text-white transition hover:bg-gray-800">
                        Agregar al carrito
                    </button>
                </div>
            </div>

            {product.specifications?.length > 0 && (
                <div className="mt-16">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                        Especificaciones
                    </h2>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        {product.specifications.map((spec) => (
                            <div
                                key={spec.name}
                                className="flex justify-between border-b border-gray-200 px-6 py-4 last:border-b-0"
                            >
                                <span className="font-medium text-gray-700">
                                    {spec.name}
                                </span>

                                <span className="text-gray-600">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;