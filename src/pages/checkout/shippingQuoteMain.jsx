import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, PackageCheck, Truck } from "lucide-react";
import useAuth from "../../context/useAuth";
import { useCart } from "../../context/cartContext";
import { getAddresses } from "../../services/profileService";
import { quoteAndreaniShipping } from "../../services/shippingService";

const ShippingQuoteMain = () => {
  const { user, isLoading } = useAuth();
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [error, setError] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [isQuoting, setIsQuoting] = useState(false);

  const cartItems = useMemo(() => items.map((item) => ({
    variant_id: item.variantId,
    quantity: item.quantity,
  })), [items]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/perfil?returnTo=/checkout/envio", { replace: true });
      return;
    }
    if (!items.length) {
      navigate("/carrito", { replace: true });
      return;
    }

    let active = true;
    getAddresses()
      .then((addresses) => {
        if (active) setAddress(addresses.find((item) => item.is_default) ?? addresses[0] ?? null);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "No pudimos cargar tu dirección.");
      })
      .finally(() => {
        if (active) setIsLoadingAddress(false);
      });
    return () => { active = false; };
  }, [isLoading, items.length, navigate, user]);

  const requestQuote = async () => {
    setError("");
    setIsQuoting(true);
    try {
      await quoteAndreaniShipping(cartItems);
    } catch (requestError) {
      setError(requestError.message || "No pudimos cotizar el envío.");
    } finally {
      setIsQuoting(false);
    }
  };

  if (isLoading || isLoadingAddress) {
    return <main className="mx-auto flex min-h-96 w-full max-w-3xl items-center justify-center px-4 text-text">Preparando la cotización…</main>;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-2 py-6 text-text sm:px-6 lg:py-10">
      <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">Paso 2 de 3</p>
      <h1 className="mt-2 text-3xl font-semibold">Cotizá tu envío</h1>
      <p className="mt-3 text-text-secondary">Calcularemos el costo antes de enviarte al pago.</p>

      <section className="mt-7 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3"><MapPin className="mt-0.5 text-primary" /><div><h2 className="font-semibold">Dirección de entrega</h2>{address ? <p className="mt-1 text-sm text-text-secondary">{address.street}, {address.city}, {address.province} · CP {address.postal_code}</p> : <p className="mt-1 text-sm text-text-secondary">Necesitamos una dirección para cotizar.</p>}</div></div>
        <Link to="/perfil?returnTo=/checkout/envio" className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-dark">{address ? "Modificar dirección" : "Agregar dirección"}</Link>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3"><PackageCheck className="mt-0.5 text-primary" /><div><h2 className="font-semibold">Resumen de productos</h2><p className="mt-1 text-sm text-text-secondary">{items.reduce((quantity, item) => quantity + item.quantity, 0)} producto(s) · ${Number(subtotal).toLocaleString("es-AR")}</p></div></div>
      </section>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button type="button" disabled={!address || isQuoting} onClick={requestQuote} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"><Truck size={19} />{isQuoting ? "Cotizando con Andreani…" : "Cotizar envío con Andreani"}</button>
      <Link to="/carrito" className="mt-4 block text-center text-sm font-medium text-text-secondary hover:text-primary">Volver al carrito</Link>
    </main>
  );
};

export default ShippingQuoteMain;
