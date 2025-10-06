import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useToast } from '../../../contexts/ToastContext';
import { createGuest, updateGuest, type GuestPayload } from '../../../services/guestServices';
import { GuestSchema } from '../../../validations/GuestSchema';

type GuestDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<GuestPayload> | null;
    mode?: 'create' | 'edit';
    id?: string | null;
};

const emptyModel: GuestPayload = {
    idNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    country: '',
};

const GuestDialog: React.FC<GuestDialogProps> = ({
    visible,
    onHide,
    onSaved,
    initial = null,
    mode = 'create',
    id,
}) => {
    const { toast } = useToast();

    const handleSubmit = async (values: GuestPayload, { setSubmitting }: any) => {
        try {
            if (mode === 'create') {
                await createGuest(values);
                toast({ severity: 'success', summary: 'Created', detail: 'Guest created successfully' });
            } else {
                if (!id) throw new Error('Missing ID for edit');
                await updateGuest(id, values);
                toast({ severity: 'success', summary: 'Updated', detail: 'Guest updated successfully' });
            }

            setTimeout(() => {
                onSaved?.();
                onHide();
            }, 300);
        } catch (err: any) {
            console.error(err);
            const message =
                err?.response?.data?.message ??
                (err?.response?.data?.errors ? JSON.stringify(err.response.data.errors) : err?.message ?? 'Request failed');
            toast({ severity: 'error', summary: 'Error', detail: String(message) });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            header={mode === 'create' ? 'Create Guest' : 'Edit Guest'}
            visible={visible}
            onHide={onHide}
            style={{ width: '600px' }}
            dismissableMask
            draggable={false}
        >
            <Formik
                initialValues={{ ...emptyModel, ...(initial ?? {}) }}
                validationSchema={GuestSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
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
                            <label className="block text-sm font-medium mb-1">ID Number</label>
                            <Field as={InputText} name="idNumber" className="w-full" />
                            <ErrorMessage name="idNumber" component="small" className="text-red-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <Field as={InputText} name="email" className="w-full" />
                                <ErrorMessage name="email" component="small" className="text-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <Field as={InputText} name="phoneNumber" className="w-full" />
                                <ErrorMessage name="phoneNumber" component="small" className="text-red-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Street</label>
                            <Field as={InputText} name="street" className="w-full" />
                            <ErrorMessage name="street" component="small" className="text-red-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <Field as={InputText} name="city" className="w-full" />
                                <ErrorMessage name="city" component="small" className="text-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Country</label>
                                <Field as={InputText} name="country" className="w-full" />
                                <ErrorMessage name="country" component="small" className="text-red-500" />
                            </div>
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
                                label={mode === 'create' ? 'Create' : 'Save'}
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

export default GuestDialog;