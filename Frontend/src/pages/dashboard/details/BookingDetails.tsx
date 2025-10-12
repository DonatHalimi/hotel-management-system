import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { BookingStatus } from "../tables/BookingTable";
import DetailsSidebar from "../../../components/layout/DetailsSidebar";

type BookingDetailsProps = {
    visible: boolean;
    onHide: () => void;
    booking: any | null;
    onEdit: (booking: any) => void;
    onDelete: (booking: any) => Promise<void>;
};

const BookingDetails: React.FC<BookingDetailsProps> = ({
    visible,
    onHide,
    booking,
    onEdit,
    onDelete }) => {
    return (
        <DetailsSidebar
            visible={visible}
            onHide={onHide}
            title="Booking Details"
            onEdit={() => onEdit(booking)}
            onDelete={() => onDelete(booking)}
        >
            <div>
                <label className="block text-sm font-medium mb-1">Booking Number</label>
                <InputText
                    value={booking?.bookingNumber || "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Guest</label>
                    <InputText
                        value={booking?.guestName || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Room</label>
                    <InputText
                        value={booking?.roomNumber || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Check-In</label>
                    <InputText
                        value={booking?.checkInDate ? new Date(booking.checkInDate).toLocaleString() : "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Check-Out</label>
                    <InputText
                        value={booking?.checkOutDate ? new Date(booking.checkOutDate).toLocaleString() : "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Guests</label>
                    <InputText
                        value={booking?.numberOfGuests || "—"}
                        readOnly
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Total Price</label>
                    <InputText
                        value={`€${booking?.totalPrice?.toFixed(2) || "—"}`}
                        readOnly
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <InputText
                    value={booking ? BookingStatus[booking.status] : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            {booking?.cancellationReason && (
                <div>
                    <label className="block text-sm font-medium mb-1">Cancellation Reason</label>
                    <InputTextarea
                        value={booking.cancellationReason}
                        rows={3}
                        readOnly
                        className="w-full"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Created At</label>
                <InputText
                    value={booking?.createdAt ? new Date(booking.createdAt).toLocaleString() : "—"}
                    readOnly
                    className="w-full"
                />
            </div>

            {booking?.updatedAt && (
                <div>
                    <label className="block text-sm font-medium mb-1">Updated At</label>
                    <InputText
                        value={new Date(booking.updatedAt).toLocaleString()}
                        readOnly
                        className="w-full"
                    />
                </div>
            )}
        </DetailsSidebar>
    );
};

export default BookingDetails;
