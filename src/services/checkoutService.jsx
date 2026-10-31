import { fetchData, postData } from "./api/requests";

const createPreference = (items, shippingQuoteId, preferenceRoute = "/checkout/mercado-pago") => postData(preferenceRoute, {
  items,
  shipping_quote_id: shippingQuoteId,
});
const createStorePickupPreference = (items) => postData("/checkout/mercado-pago/store-pickup", {
  items,
});
const createCashCheckout = (items, shippingQuoteId) => postData("/checkout/cash", {
  items,
  shipping_quote_id: shippingQuoteId,
});
const getCheckoutOrder = (orderId) => fetchData(`/checkout/orders/${orderId}`);

export { createCashCheckout, createPreference, createStorePickupPreference, getCheckoutOrder };
