import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Formik, Form, Field } from "formik";
import { UpdateUserSchema } from "../../../validations/UserSchema";

interface Props {
    visible: boolean;
    onHide: () => void;
    user: any;
    onSubmit: (values: any) => Promise<void>;
}

const EditUserDialog = ({ visible, onHide, user, onSubmit }: Props) => {
    const initialValues = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        currentPassword: "",
        newPassword: "",
    };

    return (
        <Dialog header="Edit Profile" visible={visible} onHide={onHide} draggable={false} style={{ width: "30vw" }}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={UpdateUserSchema}
                onSubmit={async (values, helpers) => {
                    await onSubmit(values);
                    helpers.setSubmitting(false);
                }}
            >
                {({ isSubmitting, errors, touched, setFieldTouched }) => (
                    <Form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">First Name</label>
                                <Field name="firstName" as={InputText} className="w-full" />
                                {errors.firstName && touched.firstName && (
                                    <div className="text-red-500 text-sm">{errors.firstName.message}</div>
                                )}
                            </div>
                            <div>
                                <label className="label">Last Name</label>
                                <Field name="lastName" as={InputText} className="w-full" />
                                {errors.lastName && touched.lastName && (
                                    <div className="text-red-500 text-sm">{errors.lastName.message}</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Email</label>
                                <Field name="email" as={InputText} className="w-full" />
                                {errors.email && touched.email && (
                                    <div className="text-red-500 text-sm">{errors.email.message}</div>
                                )}
                            </div>

                            <div>
                                <label className="label">Phone Number</label>
                                <Field name="phoneNumber" as={InputText} className="w-full" />
                            </div>
                        </div>

                        <Divider />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label flex items-center gap-1">
                                    Current Password <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    name="currentPassword"
                                    as={Password}
                                    toggleMask
                                    feedback={false}
                                    placeholder="Required to update profile"
                                    onFocus={() => setFieldTouched("currentPassword", true)}
                                    className="w-full"
                                />

                                {errors.currentPassword && touched.currentPassword && (
                                    <div className="text-red-500 text-sm">{errors.currentPassword}</div>
                                )}
                            </div>

                            <div>
                                <label className="label">New Password (optional)</label>
                                <Field
                                    name="newPassword"
                                    as={Password}
                                    toggleMask
                                    feedback={false}
                                    className="w-full"
                                    disabled={!touched.currentPassword}
                                />

                                {errors.newPassword && touched.newPassword && (
                                    <div className="text-red-500 text-sm">{errors.newPassword}</div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                label="Cancel"
                                onClick={onHide}
                                type="button"
                                className="p-button-text"
                            />
                            <Button
                                label={isSubmitting ? "Saving..." : "Save Changes"}
                                type="submit"
                                disabled={isSubmitting}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default EditUserDialog;