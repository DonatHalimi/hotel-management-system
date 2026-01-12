import { Field, Form, Formik } from "formik";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/axiosInstance";
import { useToast } from "../../../contexts/ToastContext";
import { BookingStatusOptions, createBooking, emptyModel, updateBooking, type BookingDialogProps, type BookingPayload } from "../../../services/bookingServices";
import { BookingSchema } from "../../../validations/BookingSchema";

const BookingDialog: React.FC<BookingDialogProps> = ({
    visible,
    onHide,
    onSaved,
    initial = null,
    mode = "create",
    id,
}) => {
    const { toast } = useToast();
    const [guests, setGuests] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [guestsRes, roomsRes] = await Promise.all([
                    axiosInstance.get("/guests"),
                    axiosInstance.get("/rooms"),
                ]);

                const guestsData = guestsRes.data;
                const roomsData = roomsRes.data;

                const guestOptions = (Array.isArray(guestsData) ? guestsData : []).map((guest: any) => {
                    const guestId = guest.id || guest.guestID || guest.guestId || guest.ID;
                    const guestName =
                        guest.name ||
                        `${guest.firstName ?? ""} ${guest.lastName ?? ""}`.trim() ||
                        `Guest ${guestId}`;
                    return {
                        label: guestName,
                        value: guestId,
                    };
                });

                const roomOptions = (Array.isArray(roomsData) ? roomsData : []).map((room: any) => {
                    const roomId = room.id || room.roomID || room.roomId || room.ID;
                    const roomLabel = room.roomNumber
                        ? `${room.roomNumber}${room.hotelName ? ` - ${room.hotelName}` : ""}`
                        : room.name || `Room ${roomId}`;
                    return {
                        label: roomLabel,
                        value: roomId,
                    };
                });

                setGuests(guestOptions);
                setRooms(roomOptions);
            } catch (err: any) {
                console.error("Error fetching guest/room data:", err);
                toast({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to load guests or rooms",
                });
            } finally {
                setLoading(false);
            }
        };

        if (visible) {
            fetchData();
        }
    }, [visible, toast]);

    const handleSubmit = async (values: BookingPayload, { setSubmitting }: any) => {
        try {
            if (mode === "create") {
                await createBooking(values);
                toast({ severity: "success", summary: "Created", detail: "Booking created successfully" });
            } else {
                if (!id) throw new Error("Missing id for edit");
                await updateBooking(id, values);
                toast({ severity: "success", summary: "Saved", detail: "Booking updated successfully" });
            }

            setTimeout(() => {
                onSaved?.();
                onHide();
            }, 300);
        } catch (err: any) {
            console.error(err);
            toast({ severity: "error", summary: "Error", detail: "Failed to save booking" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            header={mode === "create" ? "Create Booking" : "Edit Booking"}
            visible={visible}
            onHide={onHide}
            style={{ width: "640px" }}
            dismissableMask
            draggable={false}
        >
            <Formik
                initialValues={{ ...emptyModel, ...(initial || {}) }}
                enableReinitialize
                validationSchema={BookingSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="grid grid-cols-1 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Guest</label>
                            <Dropdown
                                value={values.guestID}
                                options={guests}
                                onChange={(e) => setFieldValue("guestID", e.value)}
                                placeholder="Select guest"
                                filter
                                disabled={loading}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Room</label>
                            <Dropdown
                                value={values.roomID}
                                options={rooms}
                                onChange={(e) => setFieldValue("roomID", e.value)}
                                placeholder="Select room"
                                filter
                                disabled={loading}
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Check-In</label>
                                <Calendar
                                    value={values.checkInDate ? new Date(values.checkInDate) : undefined}
                                    onChange={(e) => setFieldValue("checkInDate", e.value)}
                                    dateFormat="yy-mm-dd"
                                    showIcon
                                    showTime
                                    hourFormat="24"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Check-Out</label>
                                <Calendar
                                    value={values.checkOutDate ? new Date(values.checkOutDate) : undefined}
                                    onChange={(e) => setFieldValue("checkOutDate", e.value)}
                                    dateFormat="yy-mm-dd"
                                    showIcon
                                    showTime
                                    hourFormat="24"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Guests</label>
                                <Field as={InputText} type="number" name="numberOfGuests" className="w-full" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Total Price (€)</label>
                                <InputNumber
                                    value={values.totalPrice}
                                    onValueChange={(e) => setFieldValue("totalPrice", e.value)}
                                    mode="currency"
                                    currency="EUR"
                                    locale="en-US"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <Dropdown
                                value={values.status}
                                options={BookingStatusOptions}
                                onChange={(e) => setFieldValue("status", e.value)}
                                placeholder="Select status"
                                className="w-full"
                            />
                        </div>

                        {values.status === 4 && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Cancellation Reason</label>
                                <Field as={InputText} name="cancellationReason" className="w-full" />
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                type="button"
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={onHide}
                                className="p-button-text"
                            />
                            <Button
                                type="submit"
                                label={mode === "create" ? "Create" : "Save"}
                                icon="pi pi-check"
                                loading={isSubmitting}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default BookingDialog;
