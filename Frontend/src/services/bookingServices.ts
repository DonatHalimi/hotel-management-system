import axiosInstance from "../config/axiosInstance";

export type BookingPayload = {
    guestID: string;
    roomID: string;
    checkInDate: string | Date;
    checkOutDate: string | Date;
    numberOfGuests: number;
    totalPrice: number;
    status: number;
    cancellationReason?: string;
};

export const createBooking = (payload: BookingPayload) => axiosInstance.post("/bookings", payload);
export const updateBooking = (id: string, payload: BookingPayload) => axiosInstance.put(`/bookings/${id}`, payload);