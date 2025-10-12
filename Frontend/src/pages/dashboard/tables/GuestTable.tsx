import React, { useCallback, useState } from "react";
import EntityTable from "../../../components/table/EntityTable";
import { type ColumnDef } from "../../../components/table/DataTableWrapper";
import axiosInstance from "../../../config/axiosInstance";
import { hasRole } from "../../../utils/auth";
import { Button } from "primereact/button";
import GuestDialog from "../dialogs/GuestDialog";
import GuestDetails from "../details/GuestDetails";

const getId = (row: any) =>
    row.guestID || row.GuestID || row.id || row.Id || row._id;

const GuestTable: React.FC = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editInitial, setEditInitial] = useState<any | null>(null);
    const [createVisible, setCreateVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [viewData, setViewData] = useState<any | null>(null);

    const columns: ColumnDef[] = [
        { field: "firstName", header: "First Name", body: (r) => r.firstName || "—" },
        { field: "lastName", header: "Last Name", body: (r) => r.lastName || "—" },
        { field: "idNumber", header: "ID Number", body: (r) => r.idNumber || "—" },
        { field: "email", header: "Email", body: (r) => r.email || "—" },
        { field: "phoneNumber", header: "Phone Number", body: (r) => r.phoneNumber || "—" },
        { field: "city", header: "City", body: (r) => r.city || "—" },
        { field: "country", header: "Country", body: (r) => r.country || "—" },
    ];

    const openEditModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/guests/${id}`);
        setEditingId(id);
        setEditInitial(res.data);
        setEditVisible(true);
    }, []);

    const openViewModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/guests/${id}`);
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
            await axiosInstance.delete(`/guests/${id}`);
            setViewVisible(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    }, []);

    return (
        <EntityTable
            title="Guests"
            columns={columns}
            fetchUrl="/guests"
            getId={getId}
            canView={true}
            canEdit={hasRole(["Admin", "Receptionist"])}
            canDelete={hasRole(["Admin"])}
            onView={openViewModal}
            onEdit={openEditModal}
            createButton={
                hasRole(["Admin", "Receptionist"]) ? (
                    <Button
                        label="Create Guest"
                        icon="pi pi-plus"
                        onClick={() => setCreateVisible(true)}
                    />
                ) : undefined
            }
            createDialog={
                <GuestDialog
                    visible={createVisible}
                    onHide={() => setCreateVisible(false)}
                    onSaved={() => window.location.reload()}
                    mode="create"
                />
            }
            editDialog={
                <GuestDialog
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
                <GuestDetails
                    visible={viewVisible}
                    onHide={() => setViewVisible(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    guest={viewData}
                />
            }
        />
    );
};

export default GuestTable;