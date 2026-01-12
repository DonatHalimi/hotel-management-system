import axiosInstance from '../config/axiosInstance';

export type HotelDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<HotelPayload> | null;
    mode?: 'create' | 'edit';
    id?: string | null;
};

export const emptyModel: HotelPayload = {
    name: '',
    description: '',
    email: '',
    phoneNumber: '',
    city: '',
    country: '',
    hasWifi: false,
    hasParking: false,
    hasPool: false,
    hasGym: false,
    hasSpa: false,
    petFriendly: false,
};

export interface HotelPayload {
    name?: string | null;
    description?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    city?: string | null;
    country?: string | null;
    hasWifi?: boolean | null;
    hasParking?: boolean | null;
    hasPool?: boolean | null;
    hasGym?: boolean | null;
    hasSpa?: boolean | null;
    petFriendly?: boolean | null;
};

export const createHotel = async (payload: HotelPayload) => axiosInstance.post("/hotels", payload)

export const updateHotel = async (id: string, payload: HotelPayload) => axiosInstance.put(`/hotels/${id}`, payload)