import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Formik, Form, Field } from "formik";
import { useToast } from "../../../contexts/ToastContext";
import axiosInstance from "../../../config/axiosInstance";
import { createBooking, updateBooking, type BookingPayload } from "../../../services/bookingServices";

export const BookingStatus: Record<number, string> = {
    0: "Pending",
    1: "Confirmed",
    2: "Checked In",
    3: "Checked Out",
    4: "Cancelled",
    5: "No Show",
};

type BookingDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<BookingPayload> | null;
    mode?: "create" | "edit";
    id?: string | null;
};

const BookingStatusOptions = Object.entries(BookingStatus).map(([value, label]) => ({
    label,
    value: Number(value),
}));

const emptyModel: BookingPayload = {
    guestID: "",
    roomID: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    totalPrice: 0,
    status: 0,
    cancellationReason: "",
};

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

    useEffect(() => {
        if (!visible) return;
        (async () => {
            try {
                const [guestsRes, roomsRes] = await Promise.all([
                    axiosInstance.get("/guests"),
                    axiosInstance.get("/rooms"),
                ]);

                setGuests(
                    guestsRes.data.map((g: any) => ({
                        label: g.name || `${g.firstName} ${g.lastName}`,
                        value: g.guestID,
                    }))
                );

                setRooms(
                    roomsRes.data.map((r: any) => ({
                        label: `${r.roomNumber} - ${r.hotelName || ""}`,
                        value: r.roomID,
                    }))
                );
            } catch (err) {
                console.error(err);
                toast({ severity: "error", summary: "Error", detail: "Failed to load guests or rooms" });
            }
        })();
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
                                <Field as={InputText} type="number" name="totalPrice" className="w-full" />
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
                            <Button type="button" label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                            <Button type="submit" label={mode === "create" ? "Create" : "Save"} icon="pi pi-check" loading={isSubmitting} />
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default BookingDialog;
