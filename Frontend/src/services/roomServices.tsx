import axiosInstance from "../config/axiosInstance";

export interface RoomPayload {
    roomNumber?: string;
    floorNumber?: number;
    status?: number;
    condition?: number;
    notes?: string;
    hotelID?: string;
    roomTypeID?: string;
    isActive?: boolean;
};

export const createRoom = async (payload: RoomPayload) => axiosInstance.post("/rooms", payload);

export const updateRoom = async (id: string, payload: RoomPayload) => axiosInstance.put(`/rooms/${id}`, payload);