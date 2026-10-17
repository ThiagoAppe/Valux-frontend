import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Minus, Package, Plus } from "lucide-react";
import { findVariant, getActiveVariants, getInitialSelection, isOptionAvailable } from "../../services/productVariantUtils";
import { useCart } from "../../context/cartContext";

const fallbackImage = "https://placehold.co/800x800?text=Sin+Imagen";
const formatPrice = (price) => Number(price ?? 0).toLocaleString("es-AR");

const ProductDetail = ({ product }) => {
  const activeVariants = useMemo(() => getActiveVariants(product), [product]);
  const optionTypes = product.option_types ?? [];
  const [selectedOptions, setSelectedOptions] = useState(() => getInitialSelection(product));
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const selectedVariant = useMemo(() => {
    if (selectedOptions.__variant) return activeVariants.find((variant) => variant.id === selectedOptions.__variant) ?? null;
    return findVariant(activeVariants, selectedOptions);
  }, [activeVariants, selectedOptions]);
  const images = product.images?.length ? product.images : [{ id: "fallback", url: product.image_url }];
  const currentImage = images[imageIndex % images.length]?.url || fallbackImage;
  const stock = Number(selectedVariant?.stock_available ?? 0);
  const canBuy = Boolean(selectedVariant && stock > 0);
  const selectedQuantity = Math.min(quantity, stock);

  const chooseOption = (typeId, value) => {
    setAddedToCart(false);
    setSelectedOptions((current) => {
      const nextOptions = { ...current, __variant: undefined };

      if (current[typeId] === value) {
        delete nextOptions[typeId];
      } else {
        nextOptions[typeId] = value;
      }

      return nextOptions;
    });
  };

  const addToCart = () => {
    if (!selectedVariant || !canBuy) return;

    addItem(product, selectedVariant, selectedQuantity);
    setAddedToCart(true);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-2 py-6 text-text sm:px-6 lg:py-10">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-3">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <img src={currentImage} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} className="aspect-square w-full object-cover" />
            {images.length > 1 && <><button type="button" aria-label="Imagen anterior" onClick={() => setImageIndex((index) => (index - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 rounded-full bg-white/90 p-2 shadow"><ChevronLeft size={20} /></button><button type="button" aria-label="Imagen siguiente" onClick={() => setImageIndex((index) => (index + 1) % images.length)} className="absolute right-3 top-1/2 rounded-full bg-white/90 p-2 shadow"><ChevronRight size={20} /></button></>}
          </div>
          {images.length > 1 && <div className="flex gap-3 overflow-x-auto">{images.map((image, index) => <button type="button" key={image.id} onClick={() => setImageIndex(index)} className={`overflow-hidden rounded-xl border-2 ${index === imageIndex ? "border-primary" : "border-transparent"}`}><img src={image.url || fallbackImage} alt={`${product.name} ${index + 1}`} className="h-20 w-20 object-cover" /></button>)}</div>}
        </section>
        <section className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">{product.code}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-5 text-3xl font-semibold text-primary">${formatPrice(selectedVariant?.price ?? product.price_from)}</p>
          <div className="mt-4 flex items-center gap-2 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${selectedVariant && stock > 0 ? "bg-green-600" : "bg-amber-500"}`} />{selectedVariant ? (stock > 0 ? `Disponible · ${stock} en stock` : "Sin stock") : "Seleccioná las opciones para ver disponibilidad"}</div>
          {product.description && <p className="mt-7 max-w-xl leading-7 text-text-secondary">{product.description}</p>}
          {optionTypes.map((type) => {
            const values = [...new Set(activeVariants.flatMap((variant) => (variant.options ?? []).filter((option) => option.option_type_id === type.id).map((option) => option.value)))];
            return <fieldset key={type.id} className="mt-7"><legend className="mb-3 font-medium">{type.name}</legend><div className="flex flex-wrap gap-2">{values.map((value) => { const chosen = selectedOptions[type.id] === value; const available = isOptionAvailable(activeVariants, selectedOptions, type.id, value); return <button type="button" key={value} disabled={!available} onClick={() => chooseOption(type.id, value)} className={`rounded-xl border px-4 py-2 text-sm transition ${chosen ? "border-primary bg-primary text-white" : "border-border bg-white hover:border-primary"} disabled:cursor-not-allowed disabled:opacity-35`}>{chosen && <Check className="mr-1 inline" size={15} />}{value}</button>; })}</div></fieldset>;
          })}
          {selectedVariant && <p className="mt-6 text-sm text-text-secondary">SKU: <span className="font-medium text-text">{selectedVariant.sku}</span>{selectedVariant.name ? ` · ${selectedVariant.name}` : ""}</p>}
          {canBuy && <div className="mt-7"><p className="mb-2 text-sm font-medium">Cantidad</p><div className="flex w-fit items-center rounded-xl border border-border bg-white"><button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={selectedQuantity === 1} aria-label="Reducir cantidad" className="p-3 transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-35"><Minus size={17} /></button><span className="min-w-10 text-center font-medium">{selectedQuantity}</span><button type="button" onClick={() => setQuantity((current) => Math.min(stock, current + 1))} disabled={selectedQuantity >= stock} aria-label="Aumentar cantidad" className="p-3 transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-35"><Plus size={17} /></button></div></div>}
          <button type="button" disabled={!canBuy} onClick={addToCart} className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-background-dark px-6 py-4 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-45"><Package size={19} />{canBuy ? (addedToCart ? "Agregado al carrito" : "Agregar al carrito") : selectedVariant ? "Sin stock" : "Elegí una variante"}</button>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
