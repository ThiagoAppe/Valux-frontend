import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../context/cartContext";
import useAuth from "../../context/useAuth";

const fallbackImage = "https://placehold.co/240x240?text=Sin+Imagen";
const formatPrice = (price) => Number(price ?? 0).toLocaleString("es-AR");

const CartMain = () => {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const continuePurchase = () => {
    if (!user) {
      navigate("/perfil?returnTo=/checkout/envio");
      return;
    }
    navigate("/checkout/envio");
  };

  if (!items.length) {
    return (
      <main className="mx-auto flex min-h-96 w-full max-w-7xl flex-col items-center justify-center px-4 text-center text-text">
        <ShoppingBag size={42} className="text-primary" />
        <h1 className="mt-4 text-3xl font-semibold">Tu carrito está vacío</h1>
        <p className="mt-2 text-text-secondary">Agregá productos del catálogo para continuar.</p>
        <Link to="/catalog" className="mt-6 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark">Ver catálogo</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-2 py-6 text-text sm:px-6 lg:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">Tu selección</p>
          <h1 className="mt-1 text-3xl font-semibold">Carrito</h1>
        </div>
        <button type="button" onClick={clearCart} className="text-sm font-medium text-text-secondary transition hover:text-primary">Vaciar carrito</button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="flex gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm sm:gap-6">
              <Link to={`/catalog/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-background sm:h-32 sm:w-32">
                <img src={item.imageUrl || fallbackImage} alt={item.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} className="h-full w-full object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link to={`/catalog/${item.slug}`} className="font-semibold transition hover:text-primary">{item.name}</Link>
                    {item.variantName && <p className="mt-1 text-sm text-text-secondary">{item.variantName}</p>}
                    {item.options.map((option) => <p key={`${option.name}-${option.value}`} className="text-sm text-text-secondary">{option.name}: {option.value}</p>)}
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} aria-label={`Eliminar ${item.name} del carrito`} className="h-fit p-1 text-text-secondary transition hover:text-red-700"><Trash2 size={19} /></button>
                </div>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                  <div>
                    <p className="text-sm text-text-secondary">Cantidad</p>
                    <div className="mt-1 flex w-fit items-center rounded-lg border border-border">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Reducir cantidad de ${item.name}`} className="p-2 transition hover:bg-background"><Minus size={16} /></button>
                      <span className="min-w-9 text-center text-sm font-medium">{item.quantity}</span>
                      <button type="button" disabled={item.quantity >= item.maxStock} onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Aumentar cantidad de ${item.name}`} className="p-2 transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-35"><Plus size={16} /></button>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-primary">${formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <h2 className="text-xl font-semibold">Resumen</h2>
          <div className="mt-5 flex items-center justify-between border-b border-border pb-4 text-text-secondary"><span>Subtotal</span><span className="font-medium text-text">${formatPrice(subtotal)}</span></div>
          <div className="mt-4 flex items-center justify-between text-lg font-semibold"><span>Total</span><span className="text-primary">${formatPrice(subtotal)}</span></div>
          <p className="mt-3 text-sm text-text-secondary">Primero vamos a cotizar el envío. Luego podrás elegir cómo pagar.</p>
          {!user && !isLoading && <p className="mt-4 text-sm text-text-secondary">Vas a ingresar o registrarte antes de cotizar el envío.</p>}
          <button type="button" disabled={isLoading} onClick={continuePurchase} className="mt-6 w-full rounded-xl bg-background-dark px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60">{user ? "Continuar con el envío" : "Ingresar para continuar"}</button>
        </aside>
      </div>
    </main>
  );
};

export default CartMain;
