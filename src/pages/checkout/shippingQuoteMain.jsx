import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Banknote, CreditCard, MapPin, PackageCheck, Store, Truck } from "lucide-react";
import useAuth from "../../context/useAuth";
import { useCart } from "../../context/cartContext";
import { createCashCheckout, createPreference, createStorePickupPreference } from "../../services/checkoutService";
import { getAddresses } from "../../services/profileService";
import { quoteShipping } from "../../services/shippingService";

const formatPrice = (price) => Number(price ?? 0).toLocaleString("es-AR");
const CHECKOUT_MAINTENANCE_MESSAGE = "En mantenimiento";
const CHECKOUT_ENABLED = false;

const ShippingQuoteMain = () => {
  const { user, isLoading } = useAuth();
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [isQuoting, setIsQuoting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const cartItems = useMemo(() => items.map((item) => ({
    variant_id: item.variantId,
    quantity: item.quantity,
  })), [items]);
  const total = Number(subtotal) + Number(quote?.cost ?? 0);

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
    if (!address) return;
    setError("");
    setQuote(null);
    setIsQuoting(true);
    try {
      setQuote(await quoteShipping(cartItems, address.id, "delivery"));
    } catch (requestError) {
      setError(requestError.message || "No pudimos cotizar el envío.");
    } finally {
      setIsQuoting(false);
    }
  };

  const startStorePickupCheckout = async () => {
    setError("");
    setIsProcessingPayment(true);
    try {
      const checkout = await createStorePickupPreference(cartItems);
      window.location.assign(checkout.init_point);
    } catch (requestError) {
      setIsProcessingPayment(false);
      setError(requestError.message || "No pudimos iniciar el pago para el retiro en almacén.");
    }
  };

  const startMercadoPagoCheckout = async () => {
    if (!quote) return;
    setError("");
    setIsProcessingPayment(true);
    try {
      const checkout = await createPreference(cartItems, quote.id, "/checkout/mercado-pago");
      window.location.assign(checkout.init_point);
    } catch (requestError) {
      setIsProcessingPayment(false);
      setError(requestError.message || "No pudimos iniciar el pago con Mercado Pago.");
    }
  };

  const startCashCheckout = async () => {
    if (!quote) return;
    setError("");
    setIsProcessingPayment(true);
    try {
      const checkout = await createCashCheckout(cartItems, quote.id);
      navigate(`/pago/resultado?order_id=${checkout.order_id}`);
    } catch (requestError) {
      setIsProcessingPayment(false);
      setError(requestError.message || "No pudimos registrar el pago en efectivo.");
    }
  };

  if (isLoading || isLoadingAddress) {
    return <main className="mx-auto flex min-h-96 w-full max-w-3xl items-center justify-center px-4 text-text">Preparando la cotización…</main>;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-2 py-6 text-text sm:px-6 lg:py-10">
      <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">Paso 2 de 3</p>
      <h1 className="mt-2 text-3xl font-semibold">Envío y pago</h1>
      <p className="mt-3 text-text-secondary">Primero confirmamos el costo de envío; después elegís cómo pagar el total.</p>

      <section className="mt-7 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => { setDeliveryMethod("delivery"); setQuote(null); setError(""); }} className={`rounded-2xl border p-5 text-left shadow-sm transition ${deliveryMethod === "delivery" ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/50"}`}><Truck className="text-primary" /><h2 className="mt-3 font-semibold">Envío a domicilio</h2><p className="mt-1 text-sm text-text-secondary">Calculamos el costo según tu dirección.</p></button>
        <button type="button" onClick={() => { setDeliveryMethod("store_pickup"); setQuote(null); setError(""); }} className={`rounded-2xl border p-5 text-left shadow-sm transition ${deliveryMethod === "store_pickup" ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/50"}`}><Store className="text-primary" /><h2 className="mt-3 font-semibold">Retiro en almacén</h2><p className="mt-1 text-sm text-text-secondary">Sin costo de envío. Te avisaremos cuando esté listo.</p></button>
      </section>

      {deliveryMethod === "delivery" &&
      <section className="mt-7 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3"><MapPin className="mt-0.5 text-primary" /><div><h2 className="font-semibold">Dirección de entrega</h2>{address ? <p className="mt-1 text-sm text-text-secondary">{address.street}, {address.city}, {address.province} · CP {address.postal_code}</p> : <p className="mt-1 text-sm text-text-secondary">Necesitamos una dirección para cotizar.</p>}</div></div>
        <Link to="/perfil?returnTo=/checkout/envio" className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-dark">{address ? "Modificar dirección" : "Agregar dirección"}</Link>
      </section>}

      <section className={`${deliveryMethod === "delivery" ? "mt-4" : "mt-7"} rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6`}>
        <div className="flex items-start gap-3"><PackageCheck className="mt-0.5 text-primary" /><div><h2 className="font-semibold">Resumen de productos</h2><p className="mt-1 text-sm text-text-secondary">{items.reduce((quantity, item) => quantity + item.quantity, 0)} producto(s) · ${formatPrice(subtotal)}</p></div></div>
      </section>

      {quote && <section className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-sm sm:p-6"><div className="flex items-start gap-3">{deliveryMethod === "store_pickup" ? <Store className="mt-0.5 text-primary" /> : <Truck className="mt-0.5 text-primary" />}<div className="flex-1"><h2 className="font-semibold">{quote.service_name}</h2><p className="mt-1 text-sm text-text-secondary">{deliveryMethod === "store_pickup" ? "Sin costo de envío." : `Envío $${formatPrice(quote.cost)} · Cotización válida por 15 minutos.`}</p>{quote.instructions && <p className="mt-2 text-sm text-text-secondary">{quote.instructions}</p>}<div className="mt-4 flex items-center justify-between border-t border-primary/20 pt-4 text-lg font-semibold"><span>Total a pagar</span><span className="text-primary">${formatPrice(total)}</span></div></div></div></section>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {!quote && (deliveryMethod === "store_pickup" ? <span title={CHECKOUT_ENABLED ? undefined : CHECKOUT_MAINTENANCE_MESSAGE} className="mt-6 inline-flex w-full"><button type="button" disabled={!CHECKOUT_ENABLED || isProcessingPayment} onClick={CHECKOUT_ENABLED ? startStorePickupCheckout : undefined} className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-background-dark px-5 py-3 font-semibold text-white opacity-60"><Store size={19} />Continuar al pago</button></span> : <button type="button" disabled={!address || isQuoting || isProcessingPayment} onClick={requestQuote} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"><Truck size={19} />{isQuoting ? "Preparando tu pedido…" : "Calcular envío"}</button>)}
      {quote && <section className="mt-6"><p className="mb-3 text-sm font-medium text-text-secondary">Elegí cómo pagar</p><span title={CHECKOUT_ENABLED ? undefined : CHECKOUT_MAINTENANCE_MESSAGE} className="inline-flex w-full"><button type="button" disabled={!CHECKOUT_ENABLED || isProcessingPayment} onClick={CHECKOUT_ENABLED ? startMercadoPagoCheckout : undefined} data-mp-checkout-cta="checkout-pro" aria-label="Pagar con Mercado Pago" className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white opacity-60"><CreditCard size={19} />{isProcessingPayment ? "Iniciando pago…" : "Pagar con Mercado Pago"}</button></span><span title={CHECKOUT_ENABLED ? undefined : CHECKOUT_MAINTENANCE_MESSAGE} className="mt-3 inline-flex w-full"><button type="button" disabled={!CHECKOUT_ENABLED || isProcessingPayment} onClick={CHECKOUT_ENABLED ? startCashCheckout : undefined} className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 font-semibold text-text opacity-60"><Banknote size={19} />Pagar en efectivo</button></span></section>}
      <Link to="/carrito" className="mt-4 block text-center text-sm font-medium text-text-secondary hover:text-primary">Volver al carrito</Link>
    </main>
  );
};

export default ShippingQuoteMain;
