import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useToast } from "../../../contexts/ToastContext";
import { createRoomType, updateRoomType, type RoomTypePayload } from "../../../services/roomTypeService";
import { RoomTypeSchema } from "../../../validations/RoomTypeSchema";

type RoomTypeDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<RoomTypePayload> | null;
    mode?: "create" | "edit";
    id?: string | null;
};

const BedTypeOptions = [
    { label: "Single", value: 0 },
    { label: "Double", value: 1 },
    { label: "Queen", value: 2 },
    { label: "King", value: 3 },
    { label: "Twin", value: 4 },
    { label: "Bunk", value: 5 },
];

const emptyModel: RoomTypePayload = {
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

const RoomTypeDialog: React.FC<RoomTypeDialogProps> = ({
    visible,
    onHide,
    onSaved,
    initial = null,
    mode = "create",
    id,
}) => {
    const { toast } = useToast();

    const handleSubmit = async (values: RoomTypePayload, { setSubmitting }: any) => {
        try {
            if (mode === "create") {
                await createRoomType(values);
                toast({ severity: "success", summary: "Created", detail: "Room type created successfully", });
            } else {
                if (!id) throw new Error("Missing id for edit");
                await updateRoomType(id, values);
                toast({ severity: "success", summary: "Saved", detail: "Room type updated successfully", });
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
            toast({
                severity: "error",
                summary: "Error",
                detail: String(serverMessage),
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            header={mode === "create" ? "Create Room Type" : "Edit Room Type"}
            visible={visible}
            onHide={onHide}
            style={{ width: "640px" }}
            dismissableMask
            draggable={false}
        >
            <Formik
                initialValues={{ ...emptyModel, ...(initial || {}) }}
                validationSchema={RoomTypeSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="grid grid-cols-1 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Field as={InputText} name="name" className="w-full" />
                            <ErrorMessage name="name" component="small" className="text-red-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Description
                            </label>
                            <Field as={InputTextarea} name="description" rows={3} className="w-full" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Max Occupancy <span className="text-red-500">*</span>
                                </label>
                                <InputNumber
                                    value={values.maxOccupancy}
                                    onValueChange={(e) => setFieldValue("maxOccupancy", e.value)}
                                    className="w-full"
                                />
                                <ErrorMessage name="maxOccupancy" component="small" className="text-red-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Bed Count <span className="text-red-500">*</span>
                                </label>
                                <InputNumber
                                    value={values.bedCount}
                                    onValueChange={(e) => setFieldValue("bedCount", e.value)}
                                    className="w-full"
                                />
                                <ErrorMessage name="bedCount" component="small" className="text-red-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Bed Type <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                value={values.bedType}
                                options={BedTypeOptions}
                                onChange={(e) => setFieldValue("bedType", e.value)}
                                placeholder="Select bed type"
                                className="w-full"
                            />
                            <ErrorMessage name="bedType" component="small" className="text-red-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Base Price (€) <span className="text-red-500">*</span>
                                </label>
                                <InputNumber
                                    value={values.basePrice}
                                    onValueChange={(e) => setFieldValue("basePrice", e.value)}
                                    mode="currency"
                                    currency="EUR"
                                    locale="en-US"
                                    className="w-full"
                                />
                                <ErrorMessage name="basePrice" component="small" className="text-red-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Size (sqft) <span className="text-red-500">*</span>
                                </label>
                                <InputNumber
                                    value={values.sizeSqft}
                                    onValueChange={(e) => setFieldValue("sizeSqft", e.value)}
                                    className="w-full"
                                />
                                <ErrorMessage name="sizeSqft" component="small" className="text-red-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {[
                                ["Has Balcony", "hasBalcony"],
                                ["Has Kitchen", "hasKitchen"],
                                ["Air Conditioning", "hasAirConditioning"],
                                ["Wi-Fi", "hasWifi"],
                                ["Smoking Allowed", "isSmokingAllowed"],
                                ["Active", "isActive"],
                            ].map(([label, field]) => (
                                <div key={field} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{label}</span>
                                    <InputSwitch
                                        checked={!!(values as any)[field]}
                                        onChange={(e) => setFieldValue(field, e.value)}
                                    />
                                </div>
                            ))}
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

export default RoomTypeDialog;
