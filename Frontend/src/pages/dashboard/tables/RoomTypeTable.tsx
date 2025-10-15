import { useCallback, useState } from "react";
import EntityTable from "../../../components/table/EntityTable";
import { type ColumnDef } from "../../../components/table/DataTableWrapper";
import axiosInstance from "../../../config/axiosInstance";
import { hasRole } from "../../../utils/auth";
import { Button } from "primereact/button";
import RoomTypeDialog from "../dialogs/RoomTypeDialog";
import RoomTypeDetails from "../details/RoomTypeDetails";

const getId = (row: any) => row.roomTypeID || row.RoomTypeID || row.id || row.Id || row._id;

export const BedType: Record<number, string> = {
    0: "Single",
    1: "Double",
    2: "Queen",
    3: "King",
    4: "TwinBeds",
    5: "Bunk",
};

const RoomTypeTable = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editInitial, setEditInitial] = useState<any | null>(null);
    const [createVisible, setCreateVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [viewData, setViewData] = useState<any | null>(null);

    const columns: ColumnDef[] = [
        { field: "name", header: "Name", body: (r) => r.name || "—" },
        { field: "description", header: "Description", body: (r) => r.description || "—" },
        { field: "maxOccupancy", header: "Max Occupancy", body: (r) => r.maxOccupancy || "—" },
        { field: "bedCount", header: "Bed Count", body: (r) => r.bedCount || "—" },
        { field: "notes", header: "Notes", body: (r) => r.notes || "—" },
        { field: "bedType", header: "Bed Type", body: (r) => BedType[r.bedType] || "Unknown" },
        { field: "basePrice", header: "Base Price", body: (r) => r.basePrice || "—" },
    ];

    const openEditModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/room-types/${id}`);
        setEditingId(id);
        setEditInitial(res.data);
        setEditVisible(true);
    }, []);

    const openViewModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/room-types/${id}`);
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
            await axiosInstance.delete(`/room-types/${id}`);
            setViewVisible(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <EntityTable
            title="Room Types"
            columns={columns}
            fetchUrl="/room-types"
            getId={getId}
            canView={true}
            canEdit={hasRole(["Admin"])}
            canDelete={hasRole(["Admin"])}
            onView={openViewModal}
            onEdit={openEditModal}
            createButton={
                <Button
                    label="Create Room Type"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            }
            createDialog={
                <RoomTypeDialog
                    visible={createVisible}
                    onHide={() => setCreateVisible(false)}
                    onSaved={() => window.location.reload()}
                    mode="create"
                />
            }
            editDialog={
                <RoomTypeDialog
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
                <RoomTypeDetails
                    visible={viewVisible}
                    onHide={() => setViewVisible(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    roomType={viewData}
                />
            }
        />
    );
};

export default RoomTypeTable;