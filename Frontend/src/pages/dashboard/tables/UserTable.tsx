import React, { useCallback, useState } from "react";
import EntityTable from "../../../components/table/EntityTable";
import { type ColumnDef } from "../../../components/table/DataTableWrapper";
import axiosInstance from "../../../config/axiosInstance";
import { hasRole } from "../../../utils/auth";
import { Button } from "primereact/button";
import UserDialog from "../dialogs/UserDialog";
import UserDetails from "../details/UserDetails";

const getId = (row: any) => row.userID || row.id || row._id;

const UserTable: React.FC = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editInitial, setEditInitial] = useState<any | null>(null);
    const [createVisible, setCreateVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [viewData, setViewData] = useState<any | null>(null);

    const columns: ColumnDef[] = [
        { field: "firstName", header: "First Name", body: (r) => r.firstName || "—" },
        { field: "lastName", header: "Last Name", body: (r) => r.lastName || "—" },
        { field: "email", header: "Email", body: (r) => r.email || "—" },
        {
            field: "profilePicture",
            header: "Profile Picture",
            body: (r) =>
                r.profilePicture ? (
                    <img
                        src={r.profilePicture}
                        alt={`${r.firstName} ${r.lastName}`}
                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                    />
                ) : (
                    "—"
                ),
        },
        { field: "role", header: "Role", body: (r) => r.role || "—" },
        { field: "createdAt", header: "Created At", body: (r) => new Date(r.createdAt).toLocaleDateString() },
    ];

    const openEditModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/users/${id}`);
        setEditingId(id);
        setEditInitial(res.data);
        setEditVisible(true);
    }, []);

    const openViewModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/users/${id}`);
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
            await axiosInstance.delete(`/users/${id}`);
            setViewVisible(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <EntityTable
            title="Users"
            columns={columns}
            fetchUrl="/users"
            getId={getId}
            canView={true}
            canEdit={hasRole(["Admin"])}
            canDelete={hasRole(["Admin"])}
            onView={openViewModal}
            onEdit={openEditModal}
            createButton={
                <Button
                    label="Create user"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            }
            createDialog={
                <UserDialog
                    visible={createVisible}
                    onHide={() => setCreateVisible(false)}
                    onSaved={() => window.location.reload()}
                    mode="create"
                />
            }
            editDialog={
                <UserDialog
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
                <UserDetails
                    visible={viewVisible}
                    onHide={() => setViewVisible(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    user={viewData}
                />
            }
        />
    );
};

export default UserTable;