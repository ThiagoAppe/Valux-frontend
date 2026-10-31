import { postData } from "./api/requests";

const quoteShipping = (items, addressId, deliveryMethod) => postData("/shipping/quote", {
  items,
  address_id: addressId,
  delivery_method: deliveryMethod,
});

export { quoteShipping };
