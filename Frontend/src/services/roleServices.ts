import axiosInstance from '../config/axiosInstance';

export interface RolePayload {
    name: string | null;
    description?: string | null;
};

export const createRole = async (payload: RolePayload) => axiosInstance.post("/roles", payload);
export const updateRole = async (id: string, payload: RolePayload) => axiosInstance.put(`/roles/${id}`, payload);