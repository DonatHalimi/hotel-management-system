import React, { useState, useCallback } from "react";
import DataTableWrapper, { type ColumnDef, showConfirmDialog, showConfirmPopup } from "./DataTableWrapper";
import { Button as PrimeButton } from "primereact/button";
import axiosInstance from "../../config/axiosInstance";

type FetchResult<T> = { data: T[]; total: number };

type EntityTableProps<T> = {
    title: string;
    columns: ColumnDef<T>[];
    fetchUrl: string;
    getId: (row: T) => string | number | undefined;
    createButton?: React.ReactNode;
    createDialog?: React.ReactNode;
    editDialog?: React.ReactNode;
    viewDialog?: React.ReactNode;
    canEdit?: boolean;
    canDelete?: boolean;
    canView?: boolean;
    onEdit?: (row: T) => void;
    onView?: (row: T) => void;
    extraTopActions?: React.ReactNode;
};

function EntityTable<T extends object>({
    title,
    columns,
    fetchUrl,
    getId,
    createButton,
    createDialog,
    editDialog,
    viewDialog,
    canEdit = false,
    canDelete = false,
    canView = false,
    onEdit,
    onView,
    extraTopActions,
}: EntityTableProps<T>) {
    const [selected, setSelected] = useState<T[] | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchData = useCallback(
        async (page: number, rows: number): Promise<FetchResult<T>> => {
            const pageOneBased = page + 1;
            const res = await axiosInstance.get(fetchUrl, {
                params: { page: pageOneBased, pageSize: rows },
            });

            const totalFromHeader =
                Number(
                    res.headers["x-total-count"] ||
                    res.headers["x-totalrecords"] ||
                    res.headers["x-total"] ||
                    res.headers["x-total-pages"]
                ) || undefined;

            const payload = res.data;
            const items = Array.isArray(payload) ? payload : payload.data || payload;
            const total =
                totalFromHeader ||
                (Array.isArray(payload)
                    ? payload.length
                    : payload.total || payload.data?.length || items.length);

            return { data: items || [], total };
        },
        [fetchUrl]
    );

    const handleDelete = useCallback(
        (event: React.MouseEvent, row: T) => {
            if (!canDelete) return;
            showConfirmPopup(event, {
                message: `Delete this item? This cannot be undone.`,
                accept: async () => {
                    try {
                        await axiosInstance.delete(`${fetchUrl}/${getId(row)}`);
                        setRefreshKey((k) => k + 1);
                    } catch {
                        alert("Delete failed");
                    }
                },
            });
        },
        [canDelete, fetchUrl, getId]
    );

    const handleBulkDelete = useCallback(() => {
        if (!canDelete || !selected?.length) return;

        showConfirmDialog({
            header: "Confirm bulk delete",
            message: `Delete ${selected.length} selected items? This cannot be undone.`,
            accept: async () => {
                const ids = selected.map(getId).filter(Boolean);
                try {
                    await axiosInstance.delete(`${fetchUrl}/bulk`, { data: { ids } });
                    setSelected(null);
                    setRefreshKey((k) => k + 1);
                } catch {
                    alert("Bulk delete failed");
                }
            },
        });
    }, [canDelete, fetchUrl, getId, selected]);

    const actions = (row: T) => {
        if (!canView && !canEdit && !canDelete) return null;
        return (
            <div className="flex gap-2">
                {canView && (
                    <PrimeButton
                        icon="pi pi-eye"
                        onClick={() => onView?.(row)}
                        aria-label="View"
                        className="p-button-text p-button-info"
                    />
                )}
                {canEdit && (
                    <PrimeButton
                        icon="pi pi-pencil"
                        onClick={() => onEdit?.(row)}
                        aria-label="Edit"
                        className="p-button-text"
                    />
                )}
                {canDelete && (
                    <PrimeButton
                        icon="pi pi-trash"
                        className="p-button-text p-button-danger"
                        onClick={(e) => handleDelete(e, row)}
                        aria-label="Delete"
                    />
                )}
            </div>
        );
    };

    const topActions = (
        <div className="flex w-full items-center mb-4 px-1">
            <h1 className="text-xl font-semibold">{title}</h1>
            <div className="flex gap-4 ml-auto">
                {createButton}
                {extraTopActions}
                {selected && selected.length > 0 && canDelete && (
                    <PrimeButton
                        label={`Delete selected (${selected.length})`}
                        icon="pi pi-trash"
                        onClick={handleBulkDelete}
                        className="p-button-danger"
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded shadow p-4 mx-20 my-20">
            <DataTableWrapper
                columns={columns}
                fetchData={fetchData}
                rowsPerPage={10}
                actions={actions}
                selection={selected}
                onSelectionChange={(s) => setSelected(s)}
                selectionMode="multiple"
                topActions={topActions}
                refreshKey={refreshKey}
                lazy
            />
            {createDialog}
            {editDialog}
            {viewDialog}
        </div>
    );
}

export default EntityTable;