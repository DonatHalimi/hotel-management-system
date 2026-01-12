import axiosInstance from "../config/axiosInstance";

export const BookingStatus: Record<number, string> = {
    0: "Pending",
    1: "Confirmed",
    2: "Checked In",
    3: "Checked Out",
    4: "Cancelled",
    5: "No Show",
};

export type BookingDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<BookingPayload> | null;
    mode?: "create" | "edit";
    id?: string | null;
};

export const BookingStatusOptions = Object.entries(BookingStatus).map(([value, label]) => ({
    label,
    value: Number(value),
}));

export const emptyModel: BookingPayload = {
    guestID: "",
    roomID: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    totalPrice: 0,
    status: 0,
    cancellationReason: "",
};

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