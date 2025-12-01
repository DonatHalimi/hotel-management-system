import { useCallback, useState } from "react";
import EntityTable from "../../../components/table/EntityTable";
import { type ColumnDef } from "../../../components/table/DataTableWrapper";
import axiosInstance from "../../../config/axiosInstance";
import { hasRole } from "../../../utils/auth";
import { Button } from "primereact/button";
import PaymentDialog from "../dialogs/PaymentDialog";
import PaymentDetails from "../details/PaymentDetails";

const getId = (row: any) => row.paymentID || row.PaymentID || row.id || row.Id || row._id;

export const PaymentMethod: Record<number, string> = {
    0: "Credit Card",
    1: "Debit Card",
    2: "Bank Transfer",
    3: "Cash",
    4: "Mobile Payment",
};

export const PaymentStatus: Record<number, string> = {
    0: "Pending",
    1: "Completed",
    2: "Failed",
    3: "Refunded",
};

const PaymentTable = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [editInitial, setEditInitial] = useState<any | null>(null);
    const [createVisible, setCreateVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [viewData, setViewData] = useState<any | null>(null);

    const columns: ColumnDef[] = [
        { field: "booking", header: "Booking", body: (r) => r.booking || "—" },
        { field: "amount", header: "Amount", body: (r) => r.amount || "—" },
        { field: "method", header: "Method", body: (r) => PaymentMethod[r.method] || "Unknown" },
        { field: "status", header: "Status", body: (r) => PaymentStatus[r.status] || "Unknown" },
        { field: "paymentDate", header: "Date", body: (r) => r.paymentDate ? new Date(r.paymentDate).toLocaleDateString() : "—" },
        { field: "transactionReference", header: "Transaction Reference", body: (r) => r.transactionReference || "—" },
    ];

    const openEditModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/payments/${id}`);
        setEditingId(id);
        setEditInitial(res.data);
        setEditVisible(true);
    }, []);

    const openViewModal = useCallback(async (row: any) => {
        const id = getId(row);
        const res = await axiosInstance.get(`/payments/${id}`);
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
            await axiosInstance.delete(`/payments/${id}`);
            setViewVisible(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <EntityTable
            title="Payments"
            columns={columns}
            fetchUrl="/payments"
            getId={getId}
            canView={true}
            canEdit={hasRole(["Admin"])}
            canDelete={hasRole(["Admin"])}
            onEdit={openEditModal}
            onView={openViewModal}
            createButton={
                <Button
                    label="Create Payment"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            }
            createDialog={
                <PaymentDialog
                    visible={createVisible}
                    onHide={() => setCreateVisible(false)}
                    onSaved={() => window.location.reload()}
                    mode="create"
                />
            }
            editDialog={
                <PaymentDialog
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
                <PaymentDetails
                    visible={viewVisible}
                    onHide={() => setViewVisible(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    payment={viewData}
                />
            }
        />
    );
};

export default PaymentTable;