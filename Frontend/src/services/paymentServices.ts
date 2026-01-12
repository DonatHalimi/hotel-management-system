import axiosInstance from "../config/axiosInstance";

export type PaymentDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<PaymentPayload> | null;
    mode?: 'create' | 'edit';
    id?: string | null;
};

export const emptyModel: PaymentPayload = {
    bookingID: '',
    amount: 0,
    method: 0,
    status: 0,
    transactionReference: '',
    paymentDate: new Date().toISOString(),
};

export interface BookingOption {
    label: string;
    value: string;
};

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