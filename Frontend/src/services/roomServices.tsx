import axiosInstance from "../config/axiosInstance";

export type RoomDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<RoomPayload> | null;
    mode?: "create" | "edit";
    id?: string | null;
};

export const RoomStatusOptions = [
    { label: "Available", value: 0 },
    { label: "Occupied", value: 1 },
    { label: "Out of Order", value: 2 },
    { label: "Maintenance", value: 3 },
    { label: "Cleaning", value: 4 },
    { label: "Reserved", value: 5 },
];

export const RoomConditionOptions = [
    { label: "Excellent", value: 0 },
    { label: "Good", value: 1 },
    { label: "Fair", value: 2 },
    { label: "Poor", value: 3 },
];

export const emptyModel: RoomPayload = {
    roomNumber: "",
    floorNumber: 1,
    status: 0,
    condition: 1,
    notes: "",
    hotelID: "",
    roomTypeID: "",
    isActive: true,
};

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