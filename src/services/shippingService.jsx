import { postData } from "./api/requests";

const quoteAndreaniShipping = (items) => postData("/shipping/andreani/quote", { items });

export { quoteAndreaniShipping };
