import axiosInstance from '../config/axiosInstance';

export interface UserPayload {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    password?: string | null;
    newPassword?: string | null;
    roleID?: string | null;
};

export interface CreatePayload {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    roleID: string;
}

export interface UpdatePayload {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    password?: string | null;
    newPassword?: string | null;
    roleID?: string | null;
}

export const createUser = async (payload: CreatePayload) => axiosInstance.post("/users", payload);

export const updateUser = async (id: string, payload: UpdatePayload) => axiosInstance.put(`/users/${id}`, payload);

export const updateCurrentUser = (payload: any) => axiosInstance.put("/users/me", payload);