import { useState } from "react";
import { BarChart3, Boxes, ClipboardList, LogOut, Settings, ShieldCheck, Tags, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await adminLogin(credentials);
    } catch (error) {
      setErrorMessage(error.message || "No se pudo validar el acceso administrativo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[38rem] w-full max-w-md items-center px-2 py-10 text-text sm:px-6">
      <section className="w-full rounded-3xl border border-border bg-white p-7 shadow-sm sm:p-9">
        <div className="flex size-13 items-center justify-center rounded-2xl bg-background-dark text-primary-light"><ShieldCheck size={27} /></div>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.25em] text-primary">Acceso restringido</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Panel de administración</h1>
        <p className="mt-3 leading-6 text-text-secondary">Ingresá con una cuenta a la que se le haya asignado el rol de administrador.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block"><span className="mb-2 block text-sm font-medium">Email administrativo</span><input type="email" value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} autoComplete="email" required className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium">Contraseña</span><input type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} autoComplete="current-password" required className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Validando…" : "Ingresar al panel"}</button>
        </form>
        {errorMessage && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}
      </section>
    </main>
  );
};

const AccessDenied = () => {
  const { logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const switchAccount = async () => {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[34rem] w-full max-w-xl items-center px-2 py-10 text-center text-text sm:px-6">
      <section className="w-full rounded-3xl border border-border bg-white p-8 shadow-sm"><ShieldCheck size={38} className="mx-auto text-primary" /><h1 className="mt-5 text-3xl font-semibold">Tu cuenta no tiene acceso al panel</h1><p className="mx-auto mt-3 max-w-md leading-7 text-text-secondary">El panel está reservado para las cuentas que tengan el rol de administrador asignado desde el sistema.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={switchAccount} disabled={isSigningOut} className="rounded-full bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60">{isSigningOut ? "Cerrando…" : "Usar otra cuenta"}</button><Link to="/" className="rounded-full border border-border px-5 py-3 font-semibold text-text transition hover:border-primary hover:text-primary">Volver al sitio</Link></div></section>
    </main>
  );
};

const sections = [
  { icon: Boxes, title: "Productos", text: "Crear, editar y organizar el catálogo.", status: "Disponible", to: "/panel/productos" },
  { icon: Tags, title: "Configuración del catálogo", text: "Gestionar categorías y tipos de variantes reutilizables.", status: "Disponible", to: "/panel/configuracion-catalogo" },
  { icon: ClipboardList, title: "Pedidos", text: "Consultar estados, pagos y entregas.", status: "Próximamente" },
  { icon: UsersRound, title: "Clientes", text: "Ver perfiles y el historial de compras.", status: "Próximamente" },
  { icon: ShieldCheck, title: "Administradores", text: "Asignar accesos elevados de forma segura.", status: "Próximamente" },
];

const AdminDashboard = ({ user }) => {
  const { logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-2 py-6 text-text sm:px-6 lg:py-10">
      <section className="overflow-hidden rounded-3xl bg-background-dark px-6 py-9 text-white sm:px-10 sm:py-12"><div className="flex flex-wrap items-start justify-between gap-6"><div><p className="text-sm font-bold uppercase tracking-[0.28em] text-primary-light">Administración</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Bienvenido al panel, {user.first_name || "administrador"}.</h1><p className="mt-4 max-w-2xl leading-7 text-white/70">Este es el punto de control para gestionar Valux Deco. Las herramientas de operación se habilitarán de forma gradual.</p></div><button type="button" onClick={signOut} disabled={isSigningOut} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-60"><LogOut size={17} />{isSigningOut ? "Cerrando…" : "Cerrar sesión"}</button></div></section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{sections.map(({ icon: Icon, title, text, status, to }) => { const content = <><div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={21} /></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">{status}</p><h2 className="mt-2 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-text-secondary">{text}</p></>; return to ? <Link key={title} to={to} className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">{content}</Link> : <article key={title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">{content}</article>; })}</section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><article className="rounded-2xl border border-border bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><BarChart3 size={20} /></div><div><h2 className="font-semibold">Resumen operativo</h2><p className="text-sm text-text-secondary">La información aparecerá cuando se habiliten los módulos del panel.</p></div></div><div className="mt-7 grid grid-cols-3 gap-3">{["Productos", "Pedidos", "Clientes"].map((label) => <div key={label} className="rounded-xl bg-background p-4"><p className="text-2xl font-semibold text-text-secondary">—</p><p className="mt-1 text-sm text-text-secondary">{label}</p></div>)}</div></article><article className="rounded-2xl border border-border bg-white p-6 shadow-sm"><div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Settings size={20} /></div><h2 className="mt-5 text-xl font-semibold">Tu acceso</h2><p className="mt-2 text-sm text-text-secondary">{user.email}</p><p className="mt-4 inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">Rol: administrador</p><p className="mt-5 text-sm leading-6 text-text-secondary">Los nuevos administradores se agregarán desde este panel cuando ese módulo esté habilitado.</p></article></section>
    </main>
  );
};

const PanelMain = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <main className="mx-auto flex min-h-[38rem] w-full items-center justify-center text-text-secondary">Comprobando acceso administrativo…</main>;
  if (!user) return <AdminLogin />;
  if (user.role !== "admin") return <AccessDenied />;

  return <AdminDashboard user={user} />;
};

export default PanelMain;
