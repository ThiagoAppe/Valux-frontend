const About = () => {
    return (
        <main className="bg-white text-zinc-900">
            {/* Hero */}
            <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 lg:px-12 lg:pt-24">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    <div>
                        <span className="mb-5 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Sobre nosotros
                        </span>

                        <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Diseñamos espacios que se sienten como hogar.
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
                            Somos una empresa familiar dedicada a crear objetos,
                            muebles y soluciones para el hogar, combinando diseño,
                            tecnología y fabricación personalizada.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600">
                                Impresión 3D
                            </span>
                            <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600">
                                Muebles
                            </span>
                            <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600">
                                Diseño personalizado
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square overflow-hidden rounded-3xl bg-zinc-100">
                            <img
                                src="/images/about-workshop.jpg"
                                alt="Espacio de trabajo de Valux Deco"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-zinc-100 sm:-left-6">
                            <p className="text-2xl font-bold text-zinc-900">
                                Hecho con intención
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                                Diseñado para tu espacio.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Historia */}
            <section className="border-y border-zinc-100 bg-zinc-50">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                Nuestra historia
                            </span>

                            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Un proyecto familiar que empezó con una idea.
                            </h2>
                        </div>

                        <div className="space-y-5 text-base leading-8 text-zinc-600">
                            <p>
                                Valux Deco nació como un proyecto familiar con una
                                idea simple: crear productos para el hogar que
                                combinaran funcionalidad, estética y personalidad.
                            </p>

                            <p>
                                Con el tiempo, la fabricación digital y la impresión
                                3D se convirtieron en una parte fundamental de nuestro
                                trabajo. Esto nos permite desarrollar piezas únicas,
                                experimentar con nuevos diseños y fabricar productos
                                adaptados a diferentes necesidades.
                            </p>

                            <p>
                                También trabajamos con muebles tanto estándar como
                                realizados a medida, buscando que cada producto pueda
                                integrarse naturalmente en el espacio para el que fue
                                pensado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Luciano */}
            <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    <div className="order-2 lg:order-1">
                        <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-100">
                            <img
                                src="/images/luciano.jpg"
                                alt="Luciano Valentino"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Detrás de Valux
                        </span>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Luciano Valentino
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-zinc-600">
                            Detrás de Valux Deco está Luciano, quien junto a su
                            familia lleva adelante este proyecto con la intención
                            de convertir ideas en objetos que formen parte de la
                            vida cotidiana.
                        </p>

                        <p className="mt-5 leading-8 text-zinc-600">
                            Desde el diseño de una pieza hasta su fabricación y
                            preparación, cada producto representa una combinación
                            de creatividad, trabajo artesanal y tecnología.
                        </p>

                        <div className="mt-8 h-px w-16 bg-zinc-300" />

                        <p className="mt-6 text-sm font-medium uppercase tracking-wider text-zinc-500">
                            Luciano Valentino · Fundador
                        </p>
                    </div>
                </div>
            </section>

            {/* Qué hacemos */}
            <section className="bg-zinc-950 text-white">
                <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
                    <div className="max-w-2xl">
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                            Qué hacemos
                        </span>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            De una idea a un objeto real.
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        <article className="rounded-2xl border border-white/10 bg-white/5 p-7">
                            <span className="text-sm font-semibold text-zinc-400">
                                01
                            </span>

                            <h3 className="mt-5 text-xl font-semibold">
                                Impresión 3D
                            </h3>

                            <p className="mt-3 leading-7 text-zinc-400">
                                Objetos decorativos y funcionales fabricados mediante
                                impresión 3D, con diferentes diseños, tamaños y
                                terminaciones.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-white/10 bg-white/5 p-7">
                            <span className="text-sm font-semibold text-zinc-400">
                                02
                            </span>

                            <h3 className="mt-5 text-xl font-semibold">
                                Muebles
                            </h3>

                            <p className="mt-3 leading-7 text-zinc-400">
                                Muebles pensados para distintos espacios, desde
                                modelos disponibles en nuestro catálogo hasta
                                proyectos realizados a medida.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-white/10 bg-white/5 p-7">
                            <span className="text-sm font-semibold text-zinc-400">
                                03
                            </span>

                            <h3 className="mt-5 text-xl font-semibold">
                                Personalización
                            </h3>

                            <p className="mt-3 leading-7 text-zinc-400">
                                Adaptamos productos y desarrollamos nuevas propuestas
                                para que cada pieza pueda responder a una necesidad
                                concreta.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* Filosofía */}
            <section className="mx-auto max-w-5xl px-6 py-24 text-center sm:px-8">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Nuestra filosofía
                </span>

                <blockquote className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
                    “Creemos que los objetos que elegimos para nuestro hogar
                    también cuentan nuestra historia.”
                </blockquote>

                <p className="mx-auto mt-8 max-w-2xl leading-7 text-zinc-500">
                    Por eso buscamos crear productos que no solo ocupen un lugar,
                    sino que aporten algo al espacio y a quienes lo habitan.
                </p>
            </section>
        </main>
    );
};

export default About;