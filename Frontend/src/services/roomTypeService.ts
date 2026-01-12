import axiosInstance from "../config/axiosInstance";

export type RoomTypeDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<RoomTypePayload> | null;
    mode?: "create" | "edit";
    id?: string | null;
};

export const BedTypeOptions = [
    { label: "Single", value: 0 },
    { label: "Double", value: 1 },
    { label: "Queen", value: 2 },
    { label: "King", value: 3 },
    { label: "Twin", value: 4 },
    { label: "Bunk", value: 5 },
];

export const emptyModel: RoomTypePayload = {
    name: "",
    description: "",
    maxOccupancy: 1,
    bedCount: 1,
    bedType: 1,
    basePrice: 0,
    sizeSqft: 0,
    hasBalcony: false,
    hasKitchen: false,
    hasAirConditioning: false,
    hasWifi: false,
    isSmokingAllowed: false,
    isActive: true,
};

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