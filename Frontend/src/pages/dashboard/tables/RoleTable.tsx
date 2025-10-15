import React, { useCallback, useState } from "react";
import EntityTable from "../../../components/table/EntityTable";
import { type ColumnDef } from "../../../components/table/DataTableWrapper";
import axiosInstance from "../../../config/axiosInstance";
import { hasRole } from "../../../utils/auth";
import { Button } from "primereact/button";
import RoleDialog from "../dialogs/RoleDialog";
import RoleDetails from "../details/RoleDetails";

const getId = (row: any) => row.roleID || row.RoleID || row.id || row.Id || row._id;

const RoleTable: React.FC = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editInitial, setEditInitial] = useState<any | null>(null);
    const [createVisible, setCreateVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [viewData, setViewData] = useState<any | null>(null);

    const columns: ColumnDef[] = [
        { field: "name", header: "Name", body: (r) => r.name || "—" },
        { field: "description", header: "Description", body: (r) => r.description || "—" },
    ];

    const openEditModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/roles/${id}`);
        setEditingId(id);
        setEditInitial(res.data);
        setEditVisible(true);
    }, []);

    const openViewModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/roles/${id}`);
        setViewData(res.data);
        setViewVisible(true);
    }, []);

    const handleEdit = useCallback(async (row: any) => {
        await openEditModal(row);
        setViewVisible(false);
    }, [openEditModal]);

    const handleDelete = useCallback(async (row: any) => {
        const id = getId(row);
        if (!id) return;
        try {
            await axiosInstance.delete(`/roles/${id}`);
            setViewVisible(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <EntityTable
            title="Roles"
            columns={columns}
            fetchUrl="/roles"
            getId={getId}
            canView={true}
            canEdit={hasRole(["Admin"])}
            canDelete={hasRole(["Admin"])}
            onEdit={openEditModal}
            onView={openViewModal}
            createButton={
                <Button
                    label="Create Role"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            }
            createDialog={
                <RoleDialog
                    visible={createVisible}
                    onHide={() => setCreateVisible(false)}
                    onSaved={() => window.location.reload()}
                    mode="create"
                />
            }
            editDialog={
                <RoleDialog
                    visible={editVisible}
                    onHide={() => {
                        setEditVisible(false);
                        setEditingId(null);
                        setEditInitial(null);
                    }}
                    onSaved={() => window.location.reload()}
                    mode="edit"
                    id={editingId}
                    initial={editInitial}
                />
            }
            viewDialog={
                <RoleDetails
                    visible={viewVisible}
                    onHide={() => setViewVisible(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    role={viewData}
                />
            }
        />
    );
};

export default RoleTable;
