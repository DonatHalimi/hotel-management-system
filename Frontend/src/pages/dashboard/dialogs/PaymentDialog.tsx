import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useToast } from '../../../contexts/ToastContext';
import { PaymentMethod, PaymentStatus } from '../tables/PaymentTable';
import axiosInstance from '../../../config/axiosInstance';
import { PaymentSchema } from '../../../validations/PaymentSchema';
import { createPayment, updatePayment, type PaymentPayload } from '../../../services/paymentServices';

type PaymentDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<PaymentPayload> | null;
    mode?: 'create' | 'edit';
    id?: string | null;
};

const emptyModel: PaymentPayload = {
    bookingID: '',
    amount: 0,
    method: 0,
    status: 0,
    transactionReference: '',
    paymentDate: new Date().toISOString(),
};

interface BookingOption {
    label: string;
    value: string;
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({
    visible,
    onHide,
    onSaved,
    initial = null,
    mode = 'create',
    id,
}) => {
    const { toast } = useToast();
    const [bookings, setBookings] = useState<BookingOption[]>([]);

    const methodOptions = Object.entries(PaymentMethod).map(([key, value]) => ({
        label: value,
        value: Number(key),
    }));

    const statusOptions = Object.entries(PaymentStatus).map(([key, value]) => ({
        label: value,
        value: Number(key),
    }));

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axiosInstance.get("/bookings");
                const data = Array.isArray(res.data) ? res.data : [];

                const options = data.map((b: any) => ({
                    label: b.bookingNumber || `Booking ${b.id?.substring(0, 8)}`,
                    value: b.bookingID || b.id,
                }));

                setBookings(options);
            } catch (err) {
                console.error("Failed to load bookings:", err);
            }
        };
        fetchBookings();
    }, []);

    const handleSubmit = async (values: PaymentPayload, { setSubmitting }: any) => {
        try {
            if (mode === 'create') {
                await createPayment(values);
                toast({ severity: 'success', summary: 'Created', detail: 'Payment created successfully' });
            } else {
                if (!id) throw new Error('Missing ID for edit');
                await updatePayment(id, values);
                toast({ severity: 'success', summary: 'Saved', detail: 'Payment updated successfully' });
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
            header={mode === 'create' ? 'Create Payment' : 'Edit Payment'}
            visible={visible}
            onHide={onHide}
            style={{ width: '520px' }}
            dismissableMask
            draggable={false}
        >
            <Formik
                initialValues={{ ...emptyModel, ...(initial || {}) }}
                validationSchema={PaymentSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="grid grid-cols-1 gap-3">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Booking</label>
                            <Dropdown
                                value={values.bookingID}
                                options={bookings}
                                onChange={(e) => setFieldValue("bookingID", e.value)}
                                placeholder="Select a booking"
                                filter
                                filterBy="label"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <Field
                                as={InputText}
                                name="amount"
                                type="number"
                                step="0.01"
                                className="w-full"
                            />
                            <ErrorMessage name="amount" component="small" className="text-red-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Payment Method <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                value={values.method}
                                options={methodOptions}
                                onChange={(e) => setFieldValue('method', e.value)}
                                className="w-full"
                                placeholder="Select method"
                            />
                            <ErrorMessage name="method" component="small" className="text-red-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                value={values.status}
                                options={statusOptions}
                                onChange={(e) => setFieldValue('status', e.value)}
                                className="w-full"
                                placeholder="Select status"
                            />
                            <ErrorMessage name="status" component="small" className="text-red-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Transaction Reference</label>
                            <Field as={InputText} name="transactionReference" className="w-full" />
                            <ErrorMessage name="transactionReference" component="small" className="text-red-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Payment Date</label>
                            <Calendar
                                value={values.paymentDate ? new Date(values.paymentDate) : undefined}
                                onChange={(e) =>
                                    setFieldValue('paymentDate', e.value ? e.value.toISOString() : null)
                                }
                                showTime
                                hourFormat="24"
                                className="w-full"
                            />
                            <ErrorMessage name="paymentDate" component="small" className="text-red-500" />
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

export default PaymentDialog;