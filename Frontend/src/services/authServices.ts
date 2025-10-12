import axiosInstance from "../config/axiosInstance";

interface LoginPayload {
    email: string,
    password: string
}

interface RegisterPayload {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}

interface GoogleLoginData {
    idToken: string,
}

export const getCurrentUser = () => axiosInstance.get("/auth/profile");

export const loginUser = (payload: LoginPayload) => axiosInstance.post("auth/login", payload)

export const registerUser = (payload: RegisterPayload) => axiosInstance.post("auth/register", payload)

export const googleLogin = (payload: GoogleLoginData) => axiosInstance.post("auth/google-login", payload)