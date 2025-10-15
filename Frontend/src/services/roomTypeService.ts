import axiosInstance from "../config/axiosInstance";

export interface RoomTypePayload {
    name?: string;
    description?: string;
    maxOccupancy: number;
    bedCount: number;
    bedType: number;
    basePrice: number;
    sizeSqft: number;
    hasBalcony: boolean;
    hasKitchen: boolean;
    hasAirConditioning: boolean;
    hasWifi: boolean;
    isSmokingAllowed: boolean;
    isActive: boolean;
};

export const createRoomType = async (payload: RoomTypePayload) => axiosInstance.post("/room-types", payload);
export const updateRoomType = async (id: string, payload: RoomTypePayload) => axiosInstance.put(`/room-types/${id}`, payload);