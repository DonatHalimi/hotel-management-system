import axiosInstance from "../config/axiosInstance";

export interface RoomPayload {
    roomNumber?: string | null;
    floorNumber?: number | null;
    status?: number | null;
    condition?: number | null;
    notes?: string | null;
    hotelID?: string | null;
    roomTypeID?: string | null;
    isActive?: boolean | null;
};

export const createRoom = async (payload: RoomPayload) => axiosInstance.post("/rooms", payload);

export const updateRoom = async (id: string, payload: RoomPayload) => axiosInstance.put(`/rooms/${id}`, payload);
