import React, { useCallback, useState } from "react";
import EntityTable from "../../../components/table/EntityTable";
import { type ColumnDef } from "../../../components/table/DataTableWrapper";
import axiosInstance from "../../../config/axiosInstance";
import { hasRole } from "../../../utils/auth";
import { Button } from "primereact/button";
import BookingDialog from "../dialogs/BookingDialog";
import BookingDetails from "../details/BookingDetails";

const getId = (row: any) => row.bookingID || row.BookingID || row.id || row.Id || row._id;

export const BookingStatus: Record<number, string> = {
    0: "Pending",
    1: "Confirmed",
    2: "Checked In",
    3: "Checked Out",
    4: "Cancelled",
    5: "No Show",
};

const BookingTable: React.FC = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editInitial, setEditInitial] = useState<any | null>(null);
    const [createVisible, setCreateVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [viewData, setViewData] = useState<any | null>(null);

    const columns: ColumnDef[] = [
        { field: "bookingNumber", header: "Booking #", body: (r) => r.bookingNumber || "—" },
        { field: "guestName", header: "Guest", body: (r) => r.guestName || "—" },
        { field: "roomNumber", header: "Room", body: (r) => r.roomNumber || "—" },
        { field: "checkInDate", header: "Check-In", body: (r) => r.checkInDate ? new Date(r.checkInDate).toLocaleDateString() : "—" },
        { field: "checkOutDate", header: "Check-Out", body: (r) => r.checkOutDate ? new Date(r.checkOutDate).toLocaleDateString() : "—" },
        { field: "numberOfGuests", header: "Guests", body: (r) => r.numberOfGuests || "—" },
        { field: "totalPrice", header: "Total Price", body: (r) => `€${r.totalPrice?.toFixed(2) || "—"}` },
        { field: "status", header: "Status", body: (r) => BookingStatus[r.status] || "Unknown" },
    ];

    const openEditModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/bookings/${id}`);
        setEditingId(id);
        setEditInitial(res.data);
        setEditVisible(true);
    }, []);

    const openViewModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/bookings/${id}`);
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
            await axiosInstance.delete(`/bookings/${id}`);
            setViewVisible(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    }, []);

    return (
        <EntityTable
            title="Bookings"
            columns={columns}
            fetchUrl="/bookings"
            getId={getId}
            canView
            canEdit={hasRole(["Admin"])}
            canDelete={hasRole(["Admin"])}
            onView={openViewModal}
            onEdit={openEditModal}
            createButton={
                <Button
                    label="Create Booking"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            }
            createDialog={
                <BookingDialog
                    visible={createVisible}
                    onHide={() => setCreateVisible(false)}
                    onSaved={() => window.location.reload()}
                    mode="create"
                />
            }
            editDialog={
                <BookingDialog
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
                <BookingDetails
                    visible={viewVisible}
                    onHide={() => setViewVisible(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    booking={viewData}
                />
            }
        />
    );
};

export default BookingTable;