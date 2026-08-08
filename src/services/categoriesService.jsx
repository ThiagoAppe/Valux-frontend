import { fetchData } from "./api/requests";

async function getCategories() {
  return fetchData("/categories");
}

export { getCategories };
