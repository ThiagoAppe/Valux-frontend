import { deleteData, fetchData, postData, postFormData, putData } from "./api/requests";

const getAdminCategories = () => fetchData("/admin/categories");
const createCategory = (category) => postData("/admin/categories", category);
const updateCategory = (categoryId, category) => putData(`/admin/categories/${categoryId}`, category);
const deleteCategory = (categoryId) => deleteData(`/admin/categories/${categoryId}`);
const uploadCategoryImage = (file) => {
  const formData = new FormData();
  formData.append("files", file);
  return postFormData("/admin/categories/images/upload", formData);
};

export { createCategory, deleteCategory, getAdminCategories, updateCategory, uploadCategoryImage };
