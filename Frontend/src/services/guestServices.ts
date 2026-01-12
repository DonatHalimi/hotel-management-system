import axiosInstance from "../config/axiosInstance";

export type GuestDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<GuestPayload> | null;
    mode?: 'create' | 'edit';
    id?: string | null;
};

export const emptyModel: GuestPayload = {
    idNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    country: '',
};

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