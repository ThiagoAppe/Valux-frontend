export default function CategoriesHero() {
    return (
        <section className="relative overflow-hidden px-6">
            <div className="absolute -right-[10%] top-[10%] size-[clamp(12rem,30vw,28rem)] rounded-full bg-gray-50 blur-3xl" />

            <div className="absolute -left-[15%] bottom-[-30%] size-[clamp(10rem,25vw,22rem)] rounded-full bg-gray-100/70 blur-3xl" />

            <div className="relative mb-2 mx-auto max-w-7xl">
                <div className="max-w-[clamp(40rem,65vw,52rem)]">
                    <div className="mb-6 flex items-center gap-3">
                        <span className="h-px w-[clamp(1.5rem,5vw,2.5rem)] bg-gray-900" />

                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                            Nuestra colección
                        </span>
                    </div>

                    <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.95] tracking-tight text-gray-950">
                        Categorías
                    </h1>

                    <p className="mt-6 max-w-[clamp(30rem,60vw,42rem)] text-[clamp(1rem,2vw,1.25rem)] leading-relaxed text-gray-600">
                        Descubrí nuestras colecciones para cada ambiente del hogar.
                        Diseños minimalistas, modernos y pensados para transformar tus
                        espacios.
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="h-px w-[clamp(2.5rem,8vw,4rem)] bg-gray-200" />

                        <span className="text-sm text-gray-400">
                            Explorá por categoría
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}