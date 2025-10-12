import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useToast } from '../../../contexts/ToastContext';
import { createRole, updateRole, type RolePayload } from '../../../services/roleServices';
import { RoleSchema } from '../../../validations/RoleSchema';

type RoleDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<RolePayload> | null;
    mode?: 'create' | 'edit';
    id?: string | null;
};

const emptyModel: RolePayload = {
    name: '',
    description: '',
};

const RoleDialog: React.FC<RoleDialogProps> = ({
    visible,
    onHide,
    onSaved,
    initial = null,
    mode = 'create',
    id,
}) => {
    const { toast } = useToast();

    const handleSubmit = async (values: RolePayload, { setSubmitting }: any) => {
        try {
            if (mode === 'create') {
                await createRole(values);
                toast({ severity: 'success', summary: 'Created', detail: 'Role created successfully' });
            } else {
                if (!id) throw new Error('Missing ID for edit');
                await updateRole(id, values);
                toast({ severity: 'success', summary: 'Saved', detail: 'Role updated successfully' });
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
            header={mode === 'create' ? 'Create Role' : 'Edit Role'}
            visible={visible}
            onHide={onHide}
            style={{ width: '480px' }}
            dismissableMask
            draggable={false}
        >
            <Formik
                initialValues={{ ...emptyModel, ...(initial || {}) }}
                validationSchema={RoleSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
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
                            <Field
                                as={InputTextarea}
                                name="description"
                                rows={4}
                                className="w-full"
                            />
                            <ErrorMessage name="description" component="small" className="text-red-500" />
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

export default RoleDialog;
