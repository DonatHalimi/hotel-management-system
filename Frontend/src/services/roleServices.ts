import axiosInstance from '../config/axiosInstance';

export type RoleDialogProps = {
    visible: boolean;
    onHide: () => void;
    onSaved?: () => void;
    initial?: Partial<RolePayload> | null;
    mode?: 'create' | 'edit';
    id?: string | null;
};

export const emptyModel: RolePayload = {
    name: '',
    description: '',
};

export interface RolePayload {
    name: string | null;
    description?: string | null;
};

export const createRole = async (payload: RolePayload) => axiosInstance.post("/roles", payload);
export const updateRole = async (id: string, payload: RolePayload) => axiosInstance.put(`/roles/${id}`, payload);