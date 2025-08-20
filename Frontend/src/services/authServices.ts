import axiosInstance from "../config/axiosInstance";

export const getCurrentUser = () => axiosInstance.get('/auth/profile');
