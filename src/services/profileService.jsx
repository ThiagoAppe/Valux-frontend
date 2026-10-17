import { fetchData, patchData, postData } from "./api/requests";

const updateProfile = (profile) => patchData("/auth/me", profile);
const getAddresses = () => fetchData("/auth/me/addresses");
const createAddress = (address) => postData("/auth/me/addresses", address);
const updateAddress = (addressId, address) => patchData(`/auth/me/addresses/${addressId}`, address);

export { createAddress, getAddresses, updateAddress, updateProfile };
