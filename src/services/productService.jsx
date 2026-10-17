import { fetchData } from "./api/requests";

async function getCatalog(options = {}) {
  const params = new URLSearchParams();

  if (options.category) {
    params.append("category", options.category);
  }

  if (options.limit) {
    params.append("limit", options.limit);
  }

  if (options.page) {
    params.append("page", options.page);
  }

  if (options.offset) {
    params.append("offset", options.offset);
  }

  if (options.search) {
    params.append("search", options.search);
  }

  const query = params.toString();

  return fetchData(`/products/catalog${query ? `?${query}` : ""}`);
}

async function getProduct(slug) {
  return fetchData(`/products/${slug}`);
}

export { getCatalog, getProduct };
