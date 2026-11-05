import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Headset, MessageCircle, PackageSearch, ShoppingBag } from "lucide-react";
import Modal from "../../components/modal/modal";
import { whatsappUrl } from "../../config/support";
import { getOrder, getOrders } from "../../services/orderService";
import { FILTERS, PAYMENT_METHODS, TONE_CLASSES, formatDate, formatMoney, getOrderStatus } from "./orderStatus";

const primaryButton = "inline-flex items-center justify-center gap-2 rounded-xl bg-background-dark px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark";
const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-text transition hover:border-primary hover:text-primary";

const StatusBadge = ({ status }) => (
  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
);

const Thumbnails = ({ urls }) => {
  if (!urls?.length) return null;
  return (
    <div className="mt-3 flex gap-2">
      {urls.map((url) => <img key={url} src={url} alt="" loading="lazy" className="size-12 rounded-xl border border-border object-cover" />)}
    </div>
  );
};

const HELP_TOPICS = [
  "No me llegó mi pedido",
  "Llegó dañado o incorrecto",
  "Quiero cambiar la dirección de entrega",
  "Quiero cancelar mi pedido",
  "Tengo un problema con el pago",
  "Necesito la factura",
  "Otra consulta",
];

const HelpModal = ({ order, onClose }) => {
  const about = order ? ` con mi pedido #${order.id}` : "";
  return (
    <Modal title="¿En qué te ayudamos?" icon={<Headset size={25} />} onClose={onClose}>
      <p className="mt-3 text-text-secondary">Elegí un motivo y te abrimos un chat de WhatsApp con el mensaje listo{order ? ` para el pedido #${order.id}` : ""}.</p>
      <ul className="mt-5 space-y-2">
        {HELP_TOPICS.map((topic) => (
          <li key={topic}>
            <a href={whatsappUrl(`Hola, necesito ayuda${about}: ${topic}.`)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium transition hover:border-primary hover:text-primary">
              {topic}<MessageCircle size={16} className="shrink-0 text-primary" />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-text-secondary">Las cancelaciones se gestionan por este canal.</p>
    </Modal>
  );
};

const Timeline = ({ status }) => (
  <ol className="mt-4">
    {status.steps.map((step, index) => {
      const done = index < status.current;
      const now = index === status.current;
      return (
        <li key={step} className="relative pb-4 pl-7 last:pb-0">
          {index < status.steps.length - 1 && <span className={`absolute left-[9px] top-5 bottom-0 w-0.5 ${done ? "bg-primary" : "bg-border"}`} aria-hidden="true" />}
          <span className={`absolute left-1 top-1.5 size-3 rounded-full ${done ? "bg-primary" : now ? "bg-background-dark ring-4 ring-primary-light" : "bg-border"}`} aria-hidden="true" />
          <span className={now ? "font-semibold text-text" : done ? "text-text" : "text-text-secondary"}>{step}</span>
        </li>
      );
    })}
  </ol>
);

const Row = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4 text-sm"><span className="text-text-secondary">{label}</span><span className="text-right">{children}</span></div>
);

const OrderDetailModal = ({ orderId, onClose, onHelp }) => {
  const [state, setState] = useState({ loading: true, order: null, error: "" });

  useEffect(() => {
    let active = true;
    getOrder(orderId)
      .then((order) => { if (active) setState({ loading: false, order, error: "" }); })
      .catch((error) => { if (active) setState({ loading: false, order: null, error: error.message || "No pudimos cargar el pedido." }); });
    return () => { active = false; };
  }, [orderId]);

  const { order } = state;
  const status = order ? getOrderStatus(order) : null;

  return (
    <Modal title={`Pedido #${orderId}`} icon={<ShoppingBag size={25} />} onClose={onClose} size="lg">
      {state.loading && <p className="mt-4 text-text-secondary" aria-live="polite">Cargando pedido…</p>}
      {state.error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {order && status && (
        <div className="mt-2">
          <p className="text-sm text-text-secondary">{formatDate(order.created_at)}</p>
          <div className="mt-3 flex items-center gap-3"><StatusBadge status={status} /></div>
          {status.note && <p className="mt-3 text-sm text-text-secondary">{status.note}</p>}
          {status.current !== null && <Timeline status={status} />}

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-text-secondary">Productos</h3>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white">
            {order.items.map((item, index) => (
              <li key={`${item.product_name}-${index}`} className="flex gap-3 p-3">
                {item.image_url ? <img src={item.image_url} alt="" loading="lazy" className="size-14 shrink-0 rounded-xl border border-border object-cover" /> : <div className="size-14 shrink-0 rounded-xl bg-primary-light/40" aria-hidden="true" />}
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{item.product_slug ? <Link to={`/catalog/${item.product_slug}`} className="hover:text-primary">{item.product_name}</Link> : item.product_name}</p>
                  {item.options.length > 0 && <p className="text-xs text-text-secondary">{item.options.map((option) => `${option.name}: ${option.value}`).join(" · ")}</p>}
                  <p className="mt-1 text-sm text-text-secondary">{item.quantity} × {formatMoney(item.unit_price)}</p>
                </div>
                <p className="text-sm font-semibold">{formatMoney(item.unit_price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2">
            <Row label="Subtotal">{formatMoney(order.subtotal)}</Row>
            {order.shipping_cost !== null && <Row label="Envío">{Number(order.shipping_cost) > 0 ? formatMoney(order.shipping_cost) : "Sin costo"}</Row>}
            <div className="flex justify-between border-t border-border pt-3 font-semibold"><span>Total</span><span>{formatMoney(order.total_amount)}</span></div>
          </div>

          <div className="mt-5 space-y-2 rounded-2xl bg-white p-4">
            <Row label="Pago">{PAYMENT_METHODS[order.payment_method] ?? "—"}</Row>
            <Row label="Entrega">
              {order.is_pickup
                ? "Retiro en almacén"
                : [order.shipping_street, order.shipping_city, order.shipping_province].filter(Boolean).join(", ") || "A coordinar"}
            </Row>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => onHelp(order)} className={primaryButton}><Headset size={16} />Ayuda con este pedido</button>
            <button type="button" onClick={onClose} className={secondaryButton}>Cerrar</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

const OrderCard = ({ order, onOpen, onHelp }) => {
  const status = getOrderStatus(order);
  return (
    <article className="rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-primary/60 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">Pedido #{order.id}</h3>
          <p className="text-sm text-text-secondary">{formatDate(order.created_at)} · {order.item_count} {order.item_count === 1 ? "producto" : "productos"} · {formatMoney(order.total_amount)}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <Thumbnails urls={order.thumbnails} />
      {status.note && <p className="mt-3 text-sm text-text-secondary">{status.note}</p>}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => onOpen(order.id)} className={primaryButton}>Ver detalle</button>
        <button type="button" onClick={() => onHelp(order)} className={secondaryButton}>Ayuda</button>
      </div>
    </article>
  );
};

const OrdersTab = () => {
  const [state, setState] = useState({ loading: true, orders: [], error: "" });
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [helpOrder, setHelpOrder] = useState(undefined); // undefined = cerrado, null = ayuda general

  const load = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    getOrders()
      .then((orders) => setState({ loading: false, orders, error: "" }))
      .catch((error) => setState({ loading: false, orders: [], error: error.message || "No pudimos cargar tus compras." }));
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
  useEffect(() => { load(); }, [load]);

  const visible = state.orders.filter((order) => filter === "all" || getOrderStatus(order).group === filter);

  if (state.loading) return <p className="py-10 text-center text-text-secondary" aria-live="polite">Cargando tus compras…</p>;

  if (state.error) {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 text-center">
        <p role="alert" className="text-red-700">{state.error}</p>
        <button type="button" onClick={load} className={`${secondaryButton} mt-4`}>Reintentar</button>
      </div>
    );
  }

  if (state.orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><PackageSearch size={28} /></div>
        <h2 className="mt-4 text-xl font-semibold">Todavía no hiciste compras</h2>
        <p className="mx-auto mt-2 max-w-sm text-text-secondary">Cuando compres, vas a ver acá el estado de cada pedido.</p>
        <Link to="/catalog" className={`${primaryButton} mt-5`}>Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar compras">
          {FILTERS.map((item) => (
            <button key={item.id} type="button" onClick={() => setFilter(item.id)} aria-pressed={filter === item.id} className={`rounded-full border px-4 py-1.5 text-sm transition ${filter === item.id ? "border-primary bg-primary text-white" : "border-border bg-white text-text-secondary hover:border-primary hover:text-primary"}`}>{item.label}</button>
          ))}
        </div>
        <button type="button" onClick={() => setHelpOrder(null)} className="inline-flex items-center gap-2 text-sm font-medium text-primary underline"><Headset size={16} />Necesito ayuda</button>
      </div>

      <div className="mt-5 space-y-4">
        {visible.length === 0
          ? <p className="rounded-2xl border border-dashed border-border bg-white/60 p-6 text-center text-text-secondary">No tenés compras en esta categoría.</p>
          : visible.map((order) => <OrderCard key={order.id} order={order} onOpen={setOpenId} onHelp={setHelpOrder} />)}
      </div>

      {openId !== null && <OrderDetailModal orderId={openId} onClose={() => setOpenId(null)} onHelp={(order) => { setOpenId(null); setHelpOrder(order); }} />}
      {helpOrder !== undefined && <HelpModal order={helpOrder} onClose={() => setHelpOrder(undefined)} />}
    </div>
  );
};

export default OrdersTab;
