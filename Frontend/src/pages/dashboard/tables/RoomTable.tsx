import React, { useCallback, useState } from "react";
import EntityTable from "../../../components/table/EntityTable";
import { type ColumnDef } from "../../../components/table/DataTableWrapper";
import axiosInstance from "../../../config/axiosInstance";
import { hasRole } from "../../../utils/auth";
import { Button } from "primereact/button";
import RoomDialog from "../dialogs/RoomDialog";

const getId = (row: any) => row.roomID ?? row.RoomID ?? row.id ?? row.Id ?? row._id;

const RoomStatus: Record<number, string> = {
    0: "Available",
    1: "Occupied",
    2: "Out of Order",
    3: "Maintenance",
    4: "Cleaning",
    5: "Reserved",
};

const RoomCondition: Record<number, string> = {
    0: "Excellent",
    1: "Good",
    2: "Fair",
    3: "Poor",
};

const RoomTable: React.FC = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editInitial, setEditInitial] = useState<any | null>(null);
    const [createVisible, setCreateVisible] = useState(false);

    const columns: ColumnDef[] = [
        { field: "roomNumber", header: "Room Number", body: (r) => r.roomNumber ?? "—" },
        { field: "floorNumber", header: "Floor", body: (r) => r.floorNumber ?? "—" },
        { field: "status", header: "Status", body: (r) => RoomStatus[r.status] ?? "Unknown" },
        { field: "condition", header: "Condition", body: (r) => RoomCondition[r.condition] ?? "Unknown" },
        { field: "hotelName", header: "Hotel", body: (r) => r.hotelName ?? "—" },
        { field: "roomTypeName", header: "Room Type", body: (r) => r.roomTypeName ?? "—" },
        { field: "isActive", header: "Active", body: (r) => (r.isActive ? "Yes" : "No") },
        { field: "notes", header: "Notes", body: (r) => r.notes ?? "—" },
    ];

    const openEditModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/rooms/${id}`);
        setEditingId(id);
        setEditInitial(res.data);
        setEditVisible(true);
    }, []);

    return (
        <EntityTable
            title="Rooms"
            columns={columns}
            fetchUrl="/rooms"
            getId={getId}
            canEdit={hasRole(["Admin"])}
            canDelete={hasRole(["Admin"])}
            onEdit={openEditModal}
            createButton={
                <Button
                    label="Create Room"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            }
            createDialog={
                <RoomDialog
                    visible={createVisible}
                    onHide={() => setCreateVisible(false)}
                    onSaved={() => window.location.reload()}
                    mode="create"
                />
            }
            editDialog={
                <RoomDialog
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

export default RoomTable;
