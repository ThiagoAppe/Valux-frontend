import { deleteData, fetchData, postData, postFormData, putData } from "./api/requests";

const getProducts = () => fetchData("/admin/products");
const getProduct = (productId) => fetchData(`/admin/products/${productId}`);
const getMetadata = () => fetchData("/admin/products/metadata");
const createOptionType = (optionType) => postData("/admin/products/option-types", optionType);
const createProduct = (product) => postData("/admin/products", product);
const updateProduct = (productId, product) => putData(`/admin/products/${productId}`, product);
const archiveProduct = (productId) => deleteData(`/admin/products/${productId}`);
const uploadProductImages = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return postFormData("/admin/products/images/upload", formData);
};

export { archiveProduct, createOptionType, createProduct, getMetadata, getProduct, getProducts, updateProduct, uploadProductImages };
