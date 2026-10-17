import { fetchData, postData } from "./api/requests";


const getCurrentUser = () => fetchData("/auth/me");

const login = (credentials) => postData("/auth/login", credentials);

const adminLogin = (credentials) => postData("/auth/admin/login", credentials);

const register = (account) => postData("/auth/register", account);

const logout = () => postData("/auth/logout");

export { adminLogin, getCurrentUser, login, logout, register };
