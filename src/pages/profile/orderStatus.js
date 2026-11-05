// Traduce el estado técnico del pedido (orders.status + shipments.status) a lo que ve el cliente.

const DELIVERY_STEPS = ["Pedido recibido", "Pago acreditado", "Preparando tu pedido", "Enviado", "Entregado"];
const PICKUP_STEPS = ["Pedido recibido", "Pago acreditado", "Listo para retirar", "Retirado"];

export const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "active", label: "En curso" },
  { id: "done", label: "Entregadas" },
  { id: "problem", label: "Con problemas" },
];

export const TONE_CLASSES = {
  wait: "bg-amber-100 text-amber-800",
  go: "bg-primary-light/50 text-primary-dark",
  ok: "bg-green-100 text-green-800",
  problem: "bg-red-50 text-red-700",
  neutral: "bg-neutral-100 text-text-secondary",
};

const PROBLEMS = {
  payment_rejected: { label: "Pago rechazado", note: "El pago no se pudo acreditar. Podés volver a comprar los productos desde el catálogo o escribirnos si necesitás ayuda." },
  payment_error: { label: "No se pudo iniciar el pago", note: "Hubo un problema al iniciar el pago y no se cobró nada. Podés intentar de nuevo desde el catálogo." },
  payment_refunded: { label: "Pago reembolsado", note: "El pago fue reembolsado. Si tenés dudas sobre el reintegro, escribinos." },
  cancelled: { label: "Cancelado", note: "Este pedido fue cancelado." },
};

export const getOrderStatus = (order) => {
  const steps = order.is_pickup ? PICKUP_STEPS : DELIVERY_STEPS;
  const shipping = order.shipping_status;

  if (PROBLEMS[order.status]) {
    return { ...PROBLEMS[order.status], tone: order.status === "payment_refunded" || order.status === "cancelled" ? "neutral" : "problem", group: "problem", steps, current: null };
  }
  if (order.status === "delivered" || shipping === "delivered") {
    return { label: order.is_pickup ? "Retirado" : "Entregado", note: "", tone: "ok", group: "done", steps, current: steps.length };
  }
  if (order.status === "cash_payment_pending") {
    return { label: "Pago a coordinar", note: "Nos vamos a comunicar con vos para coordinar el pago en efectivo y la entrega.", tone: "wait", group: "active", steps, current: 1 };
  }
  if (order.status === "paid") {
    if (shipping === "shipped") return { label: "En camino", note: "Tu pedido ya salió. Pronto lo vas a recibir.", tone: "go", group: "active", steps, current: 3 };
    if (shipping === "ready_for_pickup") return { label: "Listo para retirar", note: "Tu pedido está listo para retirar en el almacén.", tone: "go", group: "active", steps, current: 2 };
    return { label: "Preparando tu pedido", note: "Recibimos tu pago y estamos preparando el pedido.", tone: "go", group: "active", steps, current: 2 };
  }
  return { label: "Pago pendiente", note: "Estamos esperando la confirmación del pago. Se actualiza solo cuando Mercado Pago nos avise.", tone: "wait", group: "active", steps, current: 1 };
};

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
export const formatMoney = (value) => money.format(Number(value ?? 0));

export const formatDate = (value) => {
  if (!value) return "";
  // El backend guarda fechas UTC sin zona: indicarla para que no se corra el día.
  const date = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(value) ? value : `${value}Z`);
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
};

export const PAYMENT_METHODS = { mercado_pago: "Mercado Pago", cash: "Efectivo" };
