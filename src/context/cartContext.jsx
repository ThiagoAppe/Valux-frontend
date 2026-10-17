import { createContext, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "valux-cart";
const CartContext = createContext(null);

const readStoredCart = () => {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    const items = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const getOptionLabels = (product, variant) => {
  const optionNames = new Map((product.option_types ?? []).map((type) => [type.id, type.name]));

  return (variant.options ?? []).map((option) => ({
    name: optionNames.get(option.option_type_id) ?? "Opción",
    value: option.value,
  }));
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, variant, quantity = 1) => {
    const maxStock = Math.max(0, Number(variant.stock_available) || 0);
    const requestedQuantity = Math.max(1, Number(quantity) || 1);
    const lineId = `${product.id}-${variant.id}`;

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === lineId);
      const nextQuantity = Math.min((existingItem?.quantity ?? 0) + requestedQuantity, maxStock);
      const nextItem = {
        id: lineId,
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.images?.[0]?.url ?? product.image_url,
        variantName: variant.name,
        sku: variant.sku,
        options: getOptionLabels(product, variant),
        price: Number(variant.price),
        maxStock,
        quantity: nextQuantity,
      };

      return existingItem
        ? currentItems.map((item) => (item.id === lineId ? nextItem : item))
        : [...currentItems, nextItem];
    });
  };

  const updateQuantity = (lineId, quantity) => {
    const requestedQuantity = Number(quantity);

    setItems((currentItems) => currentItems.flatMap((item) => {
      if (item.id !== lineId) return [item];
      if (!Number.isFinite(requestedQuantity) || requestedQuantity < 1) return [];

      return [{ ...item, quantity: Math.min(Math.floor(requestedQuantity), item.maxStock) }];
    }));
  };

  const removeItem = (lineId) => setItems((currentItems) => currentItems.filter((item) => item.id !== lineId));
  const clearCart = () => setItems([]);

  const value = {
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + (item.price * item.quantity), 0),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const cart = useContext(CartContext);

  if (!cart) throw new Error("useCart debe utilizarse dentro de CartProvider");

  return cart;
};
