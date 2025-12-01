import axiosInstance from "../config/axiosInstance";

export type PaymentPayload = {
    bookingID: string;
    amount: number;
    method: number;
    status: number;
    transactionReference?: string;
    paymentDate?: string | Date;
};

export const createPayment = (payload: PaymentPayload) => axiosInstance.post("/payments", payload);

export const updatePayment = (id: string, payload: PaymentPayload) => axiosInstance.put(`/payments/${id}`, payload);