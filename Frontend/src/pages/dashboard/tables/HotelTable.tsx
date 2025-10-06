import React, { useCallback, useState } from "react";
import EntityTable from "../../../components/table/EntityTable";
import { type ColumnDef } from "../../../components/table/DataTableWrapper";
import axiosInstance from "../../../config/axiosInstance";
import HotelDialog from "../dialogs/HotelDialog";
import { hasRole } from "../../../utils/auth";
import { Button } from "primereact/button";

const getId = (row: any) => row.hotelID ?? row.HotelID ?? row.id ?? row.Id ?? row._id;

const HotelTable: React.FC = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editInitial, setEditInitial] = useState<any | null>(null);
    const [createVisible, setCreateVisible] = useState(false);

    const columns: ColumnDef[] = [
        { field: "name", header: "Name", body: (r) => r.name ?? "—" },
        { field: "city", header: "City", body: (r) => r.city ?? "—" },
        { field: "country", header: "Country", body: (r) => r.country ?? "—" },
        { field: "email", header: "Email", body: (r) => r.email ?? "—" },
        { field: "phoneNumber", header: "Phone", body: (r) => r.phoneNumber ?? "—" },
        {
            field: "rooms",
            header: "Rooms",
            body: (r) =>
                Array.isArray(r.rooms) ? r.rooms.length : r.roomCount ?? "—",
        },
        {
            field: 'amenities',
            header: 'Amenities',
            body: (r) => {
                const flags: string[] = [];
                if (r.hasWifi) flags.push('Wi-Fi');
                if (r.hasParking) flags.push('Parking');
                if (r.hasPool) flags.push('Pool');
                if (r.hasGym) flags.push('Gym');
                if (r.hasSpa) flags.push('Spa');
                if (r.petFriendly) flags.push('Pet Friendly');
                return flags.length ? flags.join(', ') : '—';
            },
        },
    ];

    const openEditModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/hotels/${id}`);
        setEditingId(id);
        setEditInitial(res.data);
        setEditVisible(true);
    }, []);

    return (
        <EntityTable
            title="Hotels"
            columns={columns}
            fetchUrl="/hotels"
            getId={getId}
            canEdit={hasRole(["Admin"])}
            canDelete={hasRole(["Admin"])}
            onEdit={openEditModal}
            createButton={
                <Button
                    label="Create hotel"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            }
            createDialog={
                <HotelDialog
                    visible={createVisible}
                    onHide={() => setCreateVisible(false)}
                    onSaved={() => window.location.reload()}
                    mode="create"
                />
            }
            editDialog={
                <HotelDialog
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

export default HotelTable;