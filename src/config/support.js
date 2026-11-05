// Canal de ayuda de la tienda (WhatsApp, formato internacional sin "+" ni espacios).
export const SUPPORT_WHATSAPP = "5491137814097";

export const whatsappUrl = (message) =>
  `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`;
