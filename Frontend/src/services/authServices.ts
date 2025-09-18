import axiosInstance from "../config/axiosInstance";

interface LoginProps {
    email: string,
    password: string
}

interface RegisterProps {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}

export const getCurrentUser = () => axiosInstance.get('/auth/profile');

export const loginUser = (LoginProps: LoginProps) => axiosInstance.post("auth/login", LoginProps)

export const registerUser = (RegisterProps: RegisterProps) => axiosInstance.post("auth/register", RegisterProps)