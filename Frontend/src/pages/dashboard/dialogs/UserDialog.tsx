import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useToast } from "../../../contexts/ToastContext";
import { createUser, updateUser, type UserPayload } from "../../../services/userServices";
import { UserSchema } from "../../../validations/UserSchema";
import axiosInstance from "../../../config/axiosInstance";

type UserDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<UserPayload> | null;
    mode?: "create" | "edit";
    id?: string | null;
};

const emptyModel: UserPayload = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleID: null,
};

const UserDialog: React.FC<UserDialogProps> = ({ visible, onHide, onSaved, initial = null, mode = "create", id }) => {
    const { toast } = useToast();
    const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axiosInstance.get("/roles");
                setRoleOptions(res.data.map((r: any) => ({ label: r.name, value: r.roleID ?? r.id })));
            } catch (err) {
                console.error("Failed to fetch roles", err);
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = async (values: UserPayload, { setSubmitting }: any) => {
        try {
            if (mode === "create") {
                await createUser(values);
                toast({ severity: "success", summary: "Created", detail: "User created successfully" });
            } else {
                if (!id) throw new Error("Missing id for edit");
                await updateUser(id, values);
                toast({ severity: "success", summary: "Saved", detail: "User updated successfully" });
            }

            setTimeout(() => {
                onSaved?.();
                onHide();
            }, 300);
        } catch (err: any) {
            console.error("User save failed:", err);
            const serverMessage =
                err?.response?.data?.message ??
                (err?.response?.data?.errors ? JSON.stringify(err.response.data.errors) : null) ??
                err?.message ??
                "Request failed";
            toast({ severity: "error", summary: "Error", detail: String(serverMessage) });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            header={mode === "create" ? "Create User" : "Edit User"}
            visible={visible}
            onHide={onHide}
            style={{ width: "480px" }}
            dismissableMask
            draggable={false}
        >
            <Formik
                initialValues={{ ...emptyModel, ...(initial ?? {}) }}
                validationSchema={UserSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <Field as={InputText} name="firstName" className="w-full" />
                                <ErrorMessage name="firstName" component="small" className="text-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <Field as={InputText} name="lastName" className="w-full" />
                                <ErrorMessage name="lastName" component="small" className="text-red-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Field as={InputText} name="email" className="w-full" />
                            <ErrorMessage name="email" component="small" className="text-red-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <Field as={InputText} name="phoneNumber" className="w-full" />
                            <ErrorMessage name="phoneNumber" component="small" className="text-red-500" />
                        </div>

                        {mode === "create" && (
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <Field as={InputText} type="password" name="password" className="w-full" />
                                <ErrorMessage name="password" component="small" className="text-red-500" />
                            </div>
                        )}

                        {mode === "edit" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Current Password <span className="text-red-500">*</span>
                                    </label>
                                    <Field as={InputText} type="password" name="password" className="w-full" />
                                    <ErrorMessage name="password" component="small" className="text-red-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">New Password</label>
                                    <Field as={InputText} type="password" name="newPassword" className="w-full" />
                                    <ErrorMessage name="newPassword" component="small" className="text-red-500" />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                value={values.roleID}
                                options={roleOptions}
                                onChange={(e) => setFieldValue("roleID", e.value)}
                                placeholder="Select Role"
                                className="w-full"
                            />
                            <ErrorMessage name="roleID" component="small" className="text-red-500" />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                type="button"
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={onHide}
                                disabled={isSubmitting}
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

export default UserDialog;