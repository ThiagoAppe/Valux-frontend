import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { verifyEmail } from "../../services/authService";

const VerifyEmailMain = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "El enlace de verificación es inválido.");
  const started = useRef(false);

  useEffect(() => {
    // El token es de un solo uso: evitar la doble ejecución de StrictMode.
    if (!token || started.current) return;
    started.current = true;

    verifyEmail(token)
      .then(() => setStatus("ok"))
      .catch((error) => {
        setStatus("error");
        setMessage(error.message || "No se pudo confirmar el email.");
      });
  }, [token]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-col justify-center px-2 py-10 text-text sm:px-6 lg:min-h-[38rem]">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><MailCheck size={25} /></div>
        {status === "loading" && <p className="mt-6" aria-live="polite">Confirmando tu email…</p>}
        {status === "ok" && (
          <>
            <h1 className="mt-6 text-3xl font-semibold">¡Email confirmado!</h1>
            <p className="mt-3 text-text-secondary">Tu cuenta está activa. Ya podés ingresar.</p>
            <Link to="/perfil" className="mt-6 inline-block rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark">Ingresar</Link>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="mt-6 text-3xl font-semibold">No pudimos confirmar tu email</h1>
            <p role="alert" className="mt-3 text-text-secondary">{message}</p>
            <Link to="/perfil" className="mt-6 inline-block text-sm font-medium text-primary underline">Volver a ingresar y pedir un nuevo enlace</Link>
          </>
        )}
      </div>
    </main>
  );
};

export default VerifyEmailMain;
