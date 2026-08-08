import { Link } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";

const NotFound = () => {
    return (
        <main className="flex flex-1 items-center justify-center bg-white px-6">
            <section className="w-full max-w-2xl text-center">
                <span className="text-[7rem] font-bold leading-none tracking-tighter text-zinc-200 sm:text-[10rem]">
                    404
                </span>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                    Parece que esta página no existe.
                </h1>

                <p className="mx-auto mt-5 max-w-md text-base leading-7 text-zinc-500">
                    Puede que el enlace haya cambiado, que la página ya no esté
                    disponible o que simplemente hayas llegado a un lugar que
                    todavía no hemos decorado.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        to="/"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-zinc-800 hover:shadow-md"
                    >
                        <House size={18} />
                        Volver al inicio
                    </Link>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-700 transition-all duration-300 hover:border-zinc-300 hover:bg-zinc-50"
                    >
                        <ArrowLeft size={18} />
                        Volver atrás
                    </button>
                </div>
            </section>
        </main>
    );
};

export default NotFound;