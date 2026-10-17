import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, CircleAlert, Clock3 } from "lucide-react";
import { useCart } from "../../context/cartContext";
import { getCheckoutOrder } from "../../services/checkoutService";

const messages = {
  paid: {
    title: "Pago acreditado",
    text: "Recibimos tu pago. Vamos a confirmar el envío cuando esté cotizado.",
    icon: CheckCircle2,
    color: "text-green-700",
  },
  payment_rejected: {
    title: "No se pudo acreditar el pago",
    text: "Podés volver al carrito e intentar nuevamente con otro medio de pago.",
    icon: CircleAlert,
    color: "text-red-700",
  },
  payment_error: {
    title: "No pudimos iniciar el pago",
    text: "Volvé al carrito e intentá nuevamente.",
    icon: CircleAlert,
    color: "text-red-700",
  },
};

const PaymentResultMain = () => {
  const [params] = useSearchParams();
  const { clearCart } = useCart();
  const [state, setState] = useState({ loading: true, order: null, error: "" });
  const orderId = params.get("order_id");
  const didClearCart = useRef(false);

  useEffect(() => {
    let active = true;
    const parsedOrderId = Number(orderId);
    if (!Number.isInteger(parsedOrderId) || parsedOrderId < 1) {
      setState({ loading: false, order: null, error: "No encontramos el pedido asociado a este pago." });
      return () => { active = false; };
    }

    getCheckoutOrder(parsedOrderId)
      .then((order) => {
        if (!active) return;
        if (order.status === "paid" && !didClearCart.current) {
          didClearCart.current = true;
          clearCart();
        }
        setState({ loading: false, order, error: "" });
      })
      .catch((error) => {
        if (active) setState({ loading: false, order: null, error: error.message || "No pudimos consultar el estado del pago." });
      });

    return () => { active = false; };
  }, [clearCart, orderId]);

  if (state.loading) {
    return <main className="mx-auto flex min-h-96 w-full max-w-2xl items-center justify-center px-4 text-text"><p>Estamos confirmando tu pago…</p></main>;
  }

  const presentation = messages[state.order?.status] ?? {
    title: "Pago en proceso",
    text: "Mercado Pago todavía está confirmando el resultado. Actualizaremos el pedido cuando recibamos la confirmación.",
    icon: Clock3,
    color: "text-primary",
  };
  const Icon = presentation.icon;

  return (
    <main className="mx-auto flex min-h-96 w-full max-w-2xl items-center px-2 py-10 text-text sm:px-6">
      <section className="w-full rounded-3xl border border-border bg-white p-7 text-center shadow-sm sm:p-10">
        <Icon size={46} className={`mx-auto ${state.error ? "text-red-700" : presentation.color}`} />
        <h1 className="mt-5 text-3xl font-semibold">{state.error ? "No pudimos confirmar el pago" : presentation.title}</h1>
        <p className="mx-auto mt-3 max-w-lg text-text-secondary">{state.error || presentation.text}</p>
        {state.order?.shipping_status === "pending_quote" && <p className="mx-auto mt-4 max-w-lg rounded-xl bg-background px-4 py-3 text-sm text-text-secondary">El envío no fue incluido en este pago: se cotizará y coordinará por separado.</p>}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/catalog" className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark">Seguir comprando</Link>
          {state.order?.status !== "paid" && <Link to="/carrito" className="rounded-xl border border-border px-5 py-3 font-semibold text-text transition hover:border-primary hover:text-primary">Volver al carrito</Link>}
        </div>
      </section>
    </main>
  );
};

export default PaymentResultMain;
