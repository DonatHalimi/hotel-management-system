import React, { useCallback, useState } from "react";
import EntityTable from "../../../components/table/EntityTable";
import { type ColumnDef } from "../../../components/table/DataTableWrapper";
import axiosInstance from "../../../config/axiosInstance";
import { hasRole } from "../../../utils/auth";
import { Button } from "primereact/button";
import RoleDialog from "../dialogs/RoleDialog";

const getId = (row: any) => row.roleID ?? row.RoleID ?? row.id ?? row.Id ?? row._id;

const RoleTable: React.FC = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editInitial, setEditInitial] = useState<any | null>(null);
    const [createVisible, setCreateVisible] = useState(false);

    const columns: ColumnDef[] = [
        { field: "name", header: "Name", body: (r) => r.name ?? "—" },
        { field: "description", header: "Description", body: (r) => r.description ?? "—" },
    ];

    const openEditModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/roles/${id}`);
        setEditingId(id);
        setEditInitial(res.data);
        setEditVisible(true);
    }, []);

    return (
        <EntityTable
            title="Roles"
            columns={columns}
            fetchUrl="/roles"
            getId={getId}
            canEdit={hasRole(["Admin"])}
            canDelete={hasRole(["Admin"])}
            onEdit={openEditModal}
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
        />
    );
};

export default RoleTable;
