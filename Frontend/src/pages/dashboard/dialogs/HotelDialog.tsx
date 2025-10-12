import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useToast } from '../../../contexts/ToastContext';
import { createHotel, updateHotel, type HotelPayload } from '../../../services/hotelServices';
import { HotelSchema } from '../../../validations/HotelSchema';

type HotelDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<HotelPayload> | null;
    mode?: 'create' | 'edit';
    id?: string | null;
};

const emptyModel: HotelPayload = {
    name: '',
    description: '',
    email: '',
    phoneNumber: '',
    city: '',
    country: '',
    hasWifi: false,
    hasParking: false,
    hasPool: false,
    hasGym: false,
    hasSpa: false,
    petFriendly: false,
};

const HotelDialog: React.FC<HotelDialogProps> = ({ visible, onHide, onSaved, initial = null, mode = 'create', id }) => {
    const { toast } = useToast();

    const handleSubmit = async (values: HotelPayload, { setSubmitting }: any) => {
        try {
            if (mode === 'create') {
                await createHotel(values);
                toast({ severity: 'success', summary: 'Created', detail: 'Hotel created successfully' });
            } else {
                if (!id) throw new Error('Missing id for edit');
                await updateHotel(id, values);
                toast({ severity: 'success', summary: 'Saved', detail: 'Hotel updated successfully' });
            }

            setTimeout(() => {
                onSaved?.();
                onHide();
            }, 300);
        } catch (err: any) {
            console.error(err);
            const serverMessage =
                err?.response?.data?.message ||
                (err?.response?.data?.errors ? JSON.stringify(err.response.data.errors) : null) ||
                err?.message ||
                'Request failed';
            toast({ severity: 'error', summary: 'Error', detail: String(serverMessage) });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            header={mode === 'create' ? 'Create Hotel' : `Edit Hotel`}
            visible={visible}
            onHide={onHide}
            style={{ width: '640px' }}
            dismissableMask
            draggable={false}
        >
            <Formik
                initialValues={{ ...emptyModel, ...(initial || {}) }}
                validationSchema={HotelSchema}
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
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Field as={InputTextarea} name="description" rows={4} className="w-full" />
                            <ErrorMessage name="description" component="small" className="text-red-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <Field as={InputText} name="email" className="w-full" />
                                <ErrorMessage name="email" component="small" className="text-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <Field as={InputText} name="phoneNumber" className="w-full" />
                                <ErrorMessage name="phoneNumber" component="small" className="text-red-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <Field as={InputText} name="city" className="w-full" />
                                <ErrorMessage name="city" component="small" className="text-red-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <Field as={InputText} name="country" className="w-full" />
                                <ErrorMessage name="country" component="small" className="text-red-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <label className="block text-sm font-medium mb-1">Amenities</label>
                            <div className="grid grid-cols-3 gap-3">
                                <ToggleButton onLabel="Wi-Fi" offLabel="Wi-Fi" checked={!!values.hasWifi} onChange={(e) => setFieldValue('hasWifi', e.value)} />
                                <ToggleButton onLabel="Parking" offLabel="Parking" checked={!!values.hasParking} onChange={(e) => setFieldValue('hasParking', e.value)} />
                                <ToggleButton onLabel="Pool" offLabel="Pool" checked={!!values.hasPool} onChange={(e) => setFieldValue('hasPool', e.value)} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <ToggleButton onLabel="Gym" offLabel="Gym" checked={!!values.hasGym} onChange={(e) => setFieldValue('hasGym', e.value)} />
                                <ToggleButton onLabel="Spa" offLabel="Spa" checked={!!values.hasSpa} onChange={(e) => setFieldValue('hasSpa', e.value)} />
                                <ToggleButton onLabel="Pet Friendly" offLabel="Pet Friendly" checked={!!values.petFriendly} onChange={(e) => setFieldValue('petFriendly', e.value)} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} disabled={isSubmitting} />
                            <Button type="submit" label={mode === 'create' ? 'Create' : 'Save'} icon="pi pi-check" loading={isSubmitting} />
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default HotelDialog;