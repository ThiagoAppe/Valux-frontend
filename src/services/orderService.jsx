import { fetchData } from "./api/requests";

const getOrders = () => fetchData("/orders");
const getOrder = (orderId) => fetchData(`/orders/${orderId}`);

export { getOrder, getOrders };
