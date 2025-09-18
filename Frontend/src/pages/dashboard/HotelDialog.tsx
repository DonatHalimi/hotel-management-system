import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import axiosInstance from '../../config/axiosInstance';
import { useToast } from '../../contexts/ToastContext';

type HotelPayload = {
    name?: string | null;
    description?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    city?: string | null;
    country?: string | null;
    hasWifi?: boolean | null;
    hasParking?: boolean | null;
    hasPool?: boolean | null;
    hasGym?: boolean | null;
    hasSpa?: boolean | null;
    petFriendly?: boolean | null;
};

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
    const [model, setModel] = useState<HotelPayload>({ ...emptyModel });
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setModel({ ...emptyModel, ...(initial ?? {}) });
    }, [initial, visible]);

    const setField = (k: keyof HotelPayload, v: any) => setModel(m => ({ ...m, [k]: v }));

    const validate = () => {
        if (!model.name || String(model.name).trim() === '') {
            toast({ severity: 'warn', summary: 'Validation', detail: 'Name is required' });
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);

        try {
            if (mode === 'create') {
                await axiosInstance.post('/hotels', model);
                toast({ severity: 'success', summary: 'Created', detail: 'Hotel created' });
            } else {
                if (!id) throw new Error('Missing id for edit');
                await axiosInstance.put(`/hotels/${id}`, model);
                toast({ severity: 'success', summary: 'Saved', detail: 'Hotel updated' });
            }

            setTimeout(() => {
                onSaved?.();
                onHide();
            }, 300);
        } catch (err: any) {
            console.error(err);

            const serverMessage =
                err?.response?.data?.message ??
                (err?.response?.data?.errors ? JSON.stringify(err.response.data.errors) : null) ??
                err?.message ??
                'Request failed';
            toast({ severity: 'error', summary: 'Error', detail: String(serverMessage) });
        } finally {
            setSubmitting(false);
        }
    };

    const footer = (
        <div>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} disabled={submitting} />
            <Button label={mode === 'create' ? 'Create' : 'Save'} icon="pi pi-check" onClick={handleSubmit} loading={submitting} />
        </div>
    );

    return (
        <>
            <Dialog
                header={mode === 'create' ? 'Create Hotel' : `Edit ${model.name ?? ''}`}
                visible={visible}
                onHide={onHide}
                style={{ width: '640px' }}
                footer={footer}
                dismissableMask
            >
                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <InputText value={model.name ?? ''} onChange={(e) => setField('name', e.currentTarget.value)} className="w-full" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <InputTextarea value={model.description ?? ''} onChange={(e) => setField('description', e.currentTarget.value)} rows={4} className="w-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <InputText value={model.email ?? ''} onChange={(e) => setField('email', e.currentTarget.value)} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <InputText value={model.phoneNumber ?? ''} onChange={(e) => setField('phoneNumber', e.currentTarget.value)} className="w-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">City</label>
                            <InputText value={model.city ?? ''} onChange={(e) => setField('city', e.currentTarget.value)} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Country</label>
                            <InputText value={model.country ?? ''} onChange={(e) => setField('country', e.currentTarget.value)} className="w-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center">
                            <Checkbox inputId="wifi" checked={!!model.hasWifi} onChange={(e) => setField('hasWifi', e.checked)} />
                            <label htmlFor="wifi" className="ml-2">Wi-Fi</label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox inputId="parking" checked={!!model.hasParking} onChange={(e) => setField('hasParking', e.checked)} />
                            <label htmlFor="parking" className="ml-2">Parking</label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox inputId="pool" checked={!!model.hasPool} onChange={(e) => setField('hasPool', e.checked)} />
                            <label htmlFor="pool" className="ml-2">Pool</label>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center">
                            <Checkbox inputId="gym" checked={!!model.hasGym} onChange={(e) => setField('hasGym', e.checked)} />
                            <label htmlFor="gym" className="ml-2">Gym</label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox inputId="spa" checked={!!model.hasSpa} onChange={(e) => setField('hasSpa', e.checked)} />
                            <label htmlFor="spa" className="ml-2">Spa</label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox inputId="pets" checked={!!model.petFriendly} onChange={(e) => setField('petFriendly', e.checked)} />
                            <label htmlFor="pets" className="ml-2">Pet friendly</label>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default HotelDialog;