import { ArrowLeft, Layers3, Tags } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

import useAuth from "../../context/useAuth";


const configurationAreas = [
  {
    icon: Tags,
    title: "Categorías",
    description: "Definí el árbol de navegación, sus imágenes y relaciones padre e hija.",
    to: "/panel/categorias",
  },
  {
    icon: Layers3,
    title: "Tipos de variantes",
    description: "Administrá opciones reutilizables como Color, Tamaño o Material.",
    to: "/panel/tipos-variantes",
  },
];


const CatalogConfigurationMain = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <main className="flex min-h-[34rem] items-center justify-center text-text-secondary">Comprobando acceso administrativo…</main>;
  if (!user || user.role !== "admin") return <Navigate to="/panel" replace />;

  return <main className="mx-auto w-full max-w-5xl px-2 py-6 text-text sm:px-6 lg:py-10"><Link to="/panel" className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-primary"><ArrowLeft size={16} />Panel</Link><p className="mt-5 text-sm font-bold uppercase tracking-[0.26em] text-primary">Administración · Catálogo</p><h1 className="mt-2 text-3xl font-semibold">Configuración del catálogo</h1><p className="mt-2 max-w-2xl text-text-secondary">Administrá las estructuras compartidas del catálogo antes de crear o editar productos.</p><section className="mt-8 grid gap-5 sm:grid-cols-2">{configurationAreas.map(({ icon: Icon, title, description, to }) => <Link key={title} to={to} className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"><div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={21} /></div><h2 className="mt-6 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p><span className="mt-6 inline-flex text-sm font-semibold text-primary">Gestionar →</span></Link>)}</section></main>;
};


export default CatalogConfigurationMain;
