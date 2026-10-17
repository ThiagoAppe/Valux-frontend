import { fetchData, postData } from "./api/requests";

const createMercadoPagoCheckout = (items) => postData("/checkout/mercado-pago", { items });
const getCheckoutOrder = (orderId) => fetchData(`/checkout/orders/${orderId}`);

export { createMercadoPagoCheckout, getCheckoutOrder };
