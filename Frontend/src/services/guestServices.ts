import axiosInstance from "../config/axiosInstance";

export interface GuestPayload {
    idNumber?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    street?: string;
    city?: string;
    country?: string;
}

export const createGuest = (payload: GuestPayload) => axiosInstance.post('/guests', payload);
export const updateGuest = (id: string, payload: GuestPayload) => axiosInstance.put(`/guests/${id}`, payload);