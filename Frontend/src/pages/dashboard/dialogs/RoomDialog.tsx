import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useToast } from "../../../contexts/ToastContext";
import { createRoom, updateRoom } from "../../../services/roomServices";
import { RoomSchema } from "../../../validations/RoomSchema";
import axiosInstance from "../../../config/axiosInstance";

type RoomPayload = {
    roomNumber?: string;
    floorNumber: number;
    status: number;
    condition: number;
    notes?: string;
    hotelID: string;
    roomTypeID: string;
    isActive: boolean;
};

type RoomDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<RoomPayload> | null;
    mode?: "create" | "edit";
    id?: string | null;
};

const RoomStatusOptions = [
    { label: "Available", value: 0 },
    { label: "Occupied", value: 1 },
    { label: "Out of Order", value: 2 },
    { label: "Maintenance", value: 3 },
    { label: "Cleaning", value: 4 },
    { label: "Reserved", value: 5 },
];

const RoomConditionOptions = [
    { label: "Excellent", value: 0 },
    { label: "Good", value: 1 },
    { label: "Fair", value: 2 },
    { label: "Poor", value: 3 },
];

const emptyModel: RoomPayload = {
    roomNumber: "",
    floorNumber: 1,
    status: 0,
    condition: 1,
    notes: "",
    hotelID: "",
    roomTypeID: "",
    isActive: true,
};

const RoomDialog: React.FC<RoomDialogProps> = ({
    visible,
    onHide,
    onSaved,
    initial = null,
    mode = "create",
    id,
}) => {
    const { toast } = useToast();
    const [hotels, setHotels] = useState<any[]>([]);
    const [roomTypes, setRoomTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [hotelsResponse, roomTypesResponse] = await Promise.all([
                    axiosInstance.get("/hotels"),
                    axiosInstance.get("/room-types"),
                ]);

                const hotelsData = hotelsResponse.data;
                const roomTypesData = roomTypesResponse.data;

                const hotelOptions = (Array.isArray(hotelsData) ? hotelsData : []).map((hotel: any) => {
                    const hotelId = hotel.id || hotel.hotelID || hotel.hotelId || hotel.ID;
                    const hotelName = hotel.name || hotel.hotelName || `Hotel ${hotelId}`;
                    return {
                        label: hotelName,
                        value: hotelId,
                    };
                });

                const roomTypeOptions = (Array.isArray(roomTypesData) ? roomTypesData : []).map((roomType: any) => {
                    const typeId = roomType.id || roomType.roomTypeID || roomType.roomTypeId || roomType.ID;
                    const typeName = roomType.name || roomType.typeName || roomType.roomTypeName || `Type ${typeId}`;
                    return {
                        label: typeName,
                        value: typeId,
                    };
                });

                setHotels(hotelOptions);
                setRoomTypes(roomTypeOptions);
            } catch (err: any) {
                console.error("Error fetching data:", err);
                toast({ severity: "error", summary: "Error", detail: "Failed to load hotels or room types", });
            } finally {
                setLoading(false);
            }
        };

        if (visible) {
            fetchData();
        }
    }, [visible, toast]);

    const handleSubmit = async (values: RoomPayload, { setSubmitting }: any) => {
        try {
            if (mode === "create") {
                await createRoom(values);
                toast({ severity: "success", summary: "Created", detail: "Room created successfully", });
            } else {
                if (!id) throw new Error("Missing id for edit");
                await updateRoom(id, values);
                toast({ severity: "success", summary: "Saved", detail: "Room updated successfully", });
            }

            setTimeout(() => {
                onSaved?.();
                onHide();
            }, 300);
        } catch (err: any) {
            console.error(err);
            const serverMessage =
                err?.response?.data?.message ||
                (err?.response?.data?.errors
                    ? JSON.stringify(err.response.data.errors)
                    : null) ||
                err?.message ||
                "Request failed";
            toast({ severity: "error", summary: "Error", detail: String(serverMessage), });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            header={mode === "create" ? "Create Room" : "Edit Room"}
            visible={visible}
            onHide={onHide}
            style={{ width: "640px" }}
            dismissableMask
            draggable={false}
        >
            <Formik
                initialValues={{ ...emptyModel, ...(initial || {}) }}
                validationSchema={RoomSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="grid grid-cols-1 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Room Number <span className="text-red-500">*</span>
                            </label>
                            <Field as={InputText} name="roomNumber" className="w-full" />
                            <ErrorMessage name="roomNumber" component="small" className="text-red-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Floor Number <span className="text-red-500">*</span>
                            </label>
                            <Field
                                as={InputText}
                                type="number"
                                name="floorNumber"
                                className="w-full"
                            />
                            <ErrorMessage name="floorNumber" component="small" className="text-red-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <Dropdown
                                    value={values.status}
                                    options={RoomStatusOptions}
                                    onChange={(e) => setFieldValue("status", e.value)}
                                    placeholder="Select status"
                                    className="w-full"
                                />
                                <ErrorMessage name="status" component="small" className="text-red-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Condition <span className="text-red-500">*</span>
                                </label>
                                <Dropdown
                                    value={values.condition}
                                    options={RoomConditionOptions}
                                    onChange={(e) => setFieldValue("condition", e.value)}
                                    placeholder="Select condition"
                                    className="w-full"
                                />
                                <ErrorMessage name="condition" component="small" className="text-red-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Hotel <span className="text-red-500">*</span>
                                </label>
                                <Dropdown
                                    value={values.hotelID}
                                    options={hotels}
                                    onChange={(e) => setFieldValue("hotelID", e.value)}
                                    placeholder="Select hotel"
                                    disabled={loading}
                                    filter
                                    filterPlaceholder="Search hotels"
                                    className="w-full"
                                />
                                <ErrorMessage name="hotelID" component="small" className="text-red-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Room Type <span className="text-red-500">*</span>
                                </label>
                                <Dropdown
                                    value={values.roomTypeID}
                                    options={roomTypes}
                                    onChange={(e) => setFieldValue("roomTypeID", e.value)}
                                    placeholder="Select room type"
                                    disabled={loading}
                                    filter
                                    filterPlaceholder="Search room types"
                                    className="w-full"
                                />
                                <ErrorMessage name="roomTypeID" component="small" className="text-red-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Notes</label>
                            <Field
                                as={InputTextarea}
                                name="notes"
                                rows={3}
                                className="w-full"
                            />
                            <ErrorMessage name="notes" component="small" className="text-red-500" />
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <ToggleButton
                                onLabel="Active"
                                offLabel="Inactive"
                                checked={!!values.isActive}
                                onChange={(e) => setFieldValue("isActive", e.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                type="button"
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={onHide}
                                disabled={isSubmitting}
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

export default RoomDialog;